#!/usr/bin/env swift
// Prepared 2026-09-09. Run only after authorization to modify image pixels.
// Usage: swift scripts/cutout-macos.swift INPUT.png OUTPUT.png
// Apple SDK: VNGenerateForegroundInstanceMaskRequest.h, VNObservation.h
// (VNInstanceMaskObservation), and CIContext.h (writePNGRepresentation).
// Foreground instances are retained without cropping. No white color keying,
// background recoloring, image regeneration, or original-file replacement.
import Foundation
import Vision
import CoreImage
import CoreGraphics
import CoreVideo
import ImageIO

struct CutoutError: Error, CustomStringConvertible {
    let description: String
    init(_ description: String) { self.description = description }
}

@available(macOS 14.0, *)
func cutout(input: URL, output: URL) throws {
    let fm = FileManager.default
    guard input.standardizedFileURL.resolvingSymlinksInPath() != output.standardizedFileURL.resolvingSymlinksInPath() else {
        throw CutoutError("Input and output must differ; original assets cannot be overwritten.")
    }
    guard output.pathExtension.lowercased() == "png" else {
        throw CutoutError("Output must have a .png extension.")
    }
    guard !fm.fileExists(atPath: output.path) else {
        throw CutoutError("Output already exists; refusing to overwrite: \(output.path)")
    }
    guard let source = CGImageSourceCreateWithURL(input as CFURL, nil),
          let original = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        throw CutoutError("Cannot decode input image.")
    }
    // These lecture PNGs have no rotated EXIF orientation. Reject such an input
    // instead of silently changing its orientation or canvas dimensions.
    if let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any],
       let orientation = properties[kCGImagePropertyOrientation] as? NSNumber,
       orientation.intValue != 1 {
        throw CutoutError("Non-upright EXIF orientation is not supported by this preservation-oriented utility.")
    }
    let handler = VNImageRequestHandler(cgImage: original, options: [:])
    let request = VNGenerateForegroundInstanceMaskRequest()
    try handler.perform([request])
    guard let observation = request.results?.first, !observation.allInstances.isEmpty else {
        throw CutoutError("Vision found no foreground instances; no output written.")
    }
    let buffer = try observation.generateMaskedImage(
        ofInstances: observation.allInstances,
        from: handler,
        croppedToInstancesExtent: false
    )
    let width = CVPixelBufferGetWidth(buffer)
    let height = CVPixelBufferGetHeight(buffer)
    guard width == original.width && height == original.height else {
        throw CutoutError("Vision changed canvas dimensions; no output written.")
    }
    let image = CIImage(cvPixelBuffer: buffer)
    guard image.extent == CGRect(x: 0, y: 0, width: width, height: height) else {
        throw CutoutError("Unexpected Core Image extent; no output written.")
    }
    let colorSpace = (original.colorSpace?.model == .rgb ? original.colorSpace : nil)
        ?? CGColorSpace(name: CGColorSpace.sRGB)!
    let context = CIContext(options: [.cacheIntermediates: false])
    let directory = output.deletingLastPathComponent()
    try fm.createDirectory(at: directory, withIntermediateDirectories: true)
    let temporary = directory.appendingPathComponent(".cutout-\(UUID().uuidString).png")
    defer { try? fm.removeItem(at: temporary) }
    // RGBA8 retains the Vision foreground mask, including fractional edge alpha.
    try context.writePNGRepresentation(of: image, to: temporary,
        format: .RGBA8, colorSpace: colorSpace, options: [:])
    // moveItem refuses an existing destination, also guarding an output race.
    try fm.moveItem(at: temporary, to: output)
    let report: [String: Any] = [
        "input": input.path, "output": output.path,
        "width": width, "height": height,
        "foreground_instances": Array(observation.allInstances),
        "cropped": false, "format": "RGBA8 PNG",
        "method": "Apple Vision foreground-instance mask",
        "requires_visual_and_alpha_validation": true
    ]
    let data = try JSONSerialization.data(withJSONObject: report, options: [.sortedKeys])
    print(String(decoding: data, as: UTF8.self))
}

do {
    guard CommandLine.arguments.count == 3 else {
        throw CutoutError("Usage: swift transparent-cutout.swift INPUT.png OUTPUT.png")
    }
    guard #available(macOS 14.0, *) else {
        throw CutoutError("macOS 14 or later is required.")
    }
    try cutout(input: URL(fileURLWithPath: CommandLine.arguments[1]),
               output: URL(fileURLWithPath: CommandLine.arguments[2]))
} catch {
    FileHandle.standardError.write(Data("Cutout failed: \(error)\n".utf8))
    exit(1)
}
