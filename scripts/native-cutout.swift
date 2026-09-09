// Optional macOS-only tool. Run only when local image editing is authorized.
// Keeps original RGB/canvas; writes NEW candidates, never overwrites files.
import Foundation
import Vision
import CoreImage
import ImageIO
import CryptoKit

struct Failure: Error, CustomStringConvertible { let description: String; init(_ s:String){description=s} }
struct Options: Decodable {
    var columns: Int?; var rows: Int?
    var protect: [[[Double]]]? // Filled union polygons, original top-left pixel coordinates.
    var clip: [[[Double]]]? // Intersecting polygons; each must enclose everything to keep.
}
let usage = "Usage: swift native-cutout.swift INPUT.png NEW_OUTPUT.png NEW_MASK.png [OPTIONS.json]\nOptions: {\"columns\":3,\"rows\":2,\"protect\":[],\"clip\":[]} (all optional). Review candidates before using."
func canonical(_ path:String)->URL { URL(fileURLWithPath:path).standardizedFileURL.resolvingSymlinksInPath() }
func sha(_ url:URL)throws->String { SHA256.hash(data:try Data(contentsOf:url)).map{String(format:"%02x",$0)}.joined() }
func polygon(_ points:[[Double]],extent:CGRect,cs:CGColorSpace)throws->CIImage {
    guard points.count>=3, points.allSatisfy({$0.count==2 && $0.allSatisfy(\.isFinite) && $0[0]>=0 && $0[0]<=extent.width && $0[1]>=0 && $0[1]<=extent.height}) else {throw Failure("Polygons require at least 3 finite [x,y] points inside the original canvas")}
    guard let c=CGContext(data:nil,width:Int(extent.width),height:Int(extent.height),bitsPerComponent:8,bytesPerRow:0,space:cs,bitmapInfo:CGImageAlphaInfo.premultipliedLast.rawValue) else{throw Failure("Cannot allocate polygon mask")}
    c.setFillColor(CGColor(gray:0,alpha:1));c.fill(extent);c.setFillColor(CGColor(gray:1,alpha:1));c.beginPath()
    for (i,p) in points.enumerated(){let q=CGPoint(x:p[0],y:extent.height-p[1]);if i==0{c.move(to:q)}else{c.addLine(to:q)}}
    c.closePath();c.fillPath();return CIImage(cgImage:c.makeImage()!)
}
@available(macOS 14.0, *)
func run()throws {
    let a=CommandLine.arguments
    if a.count==2 && a[1]=="--help" {print(usage);return}
    guard a.count==4 || a.count==5 else{throw Failure(usage)}
    let input=canonical(a[1]),output=canonical(a[2]),maskOutput=canonical(a[3])
    guard Set([input.path,output.path,maskOutput.path]).count==3 else{throw Failure("Input, output and mask paths must differ")}
    for u in [output,maskOutput] {guard !FileManager.default.fileExists(atPath:u.path) else{throw Failure("Refusing to overwrite existing file: \(u.path)")}}
    let o = a.count==5 ? try JSONDecoder().decode(Options.self,from:Data(contentsOf:canonical(a[4]))) : Options()
    let cols=o.columns ?? 1, rows=o.rows ?? 1
    guard cols>0 && rows>0 && cols<=64 && rows<=64 else{throw Failure("Grid rows/columns must be 1...64")}
    guard let source=CGImageSourceCreateWithURL(input as CFURL,nil),let cg=CGImageSourceCreateImageAtIndex(source,0,nil) else{throw Failure("Cannot decode input image")}
    let w=cg.width,h=cg.height,tw=w/cols,th=h/rows
    guard w%cols==0 && h%rows==0 && tw>0 && th>0 else{throw Failure("Image dimensions must divide exactly into the grid")}
    let original=CIImage(cgImage:cg),extent=CGRect(x:0,y:0,width:w,height:h),cs=CGColorSpace(name:CGColorSpace.sRGB)!
    // Validate every protection path before performing inference or writing files.
    let protect=try (o.protect ?? []).map{try polygon($0,extent:extent,cs:cs)}
    let clips=try (o.clip ?? []).map{try polygon($0,extent:extent,cs:cs)}
    var mask=CIImage(color:CIColor(red:0,green:0,blue:0,alpha:1)).cropped(to:extent)
    var observations:[[String:Any]]=[]
    for row in 0..<rows {for col in 0..<cols {
        let rect=CGRect(x:col*tw,y:h-(row+1)*th,width:tw,height:th)
        let tile=original.cropped(to:rect).transformed(by:CGAffineTransform(translationX:-rect.minX,y:-rect.minY))
        let request=VNGenerateForegroundInstanceMaskRequest();request.revision=VNGenerateForegroundInstanceMaskRequestRevision1
        let handler=VNImageRequestHandler(ciImage:tile,options:[:]);try handler.perform([request])
        guard let result=request.results?.first,!result.allInstances.isEmpty else{throw Failure("No foreground in row \(row), column \(col); no output written")}
        let b=try result.generateScaledMaskForImage(forInstances:result.allInstances,from:handler)
        guard CVPixelBufferGetWidth(b)==tw && CVPixelBufferGetHeight(b)==th else{throw Failure("Unexpected scaled mask dimensions")}
        let m=CIImage(cvPixelBuffer:b).cropped(to:CGRect(x:0,y:0,width:tw,height:th)).transformed(by:CGAffineTransform(translationX:rect.minX,y:rect.minY))
        mask=m.composited(over:mask)
        observations.append(["row":row,"column":col,"instances":Array(result.allInstances)])
    }}
    for p in protect{mask=mask.applyingFilter("CIMaximumCompositing",parameters:[kCIInputBackgroundImageKey:p])}
    for p in clips{mask=mask.applyingFilter("CIMinimumCompositing",parameters:[kCIInputBackgroundImageKey:p])}
    mask=mask.cropped(to:extent)
    let clear=CIImage(color:.clear).cropped(to:extent)
    let cut=original.applyingFilter("CIBlendWithMask",parameters:[kCIInputBackgroundImageKey:clear,kCIInputMaskImageKey:mask]).cropped(to:extent)
    let context=CIContext(options:[.cacheIntermediates:false])
    // Stage complete PNGs, then copy exclusively: even a raced-in destination cannot be overwritten.
    let stage=FileManager.default.temporaryDirectory.appendingPathComponent("native-cutout-"+UUID().uuidString,isDirectory:true)
    try FileManager.default.createDirectory(at:stage,withIntermediateDirectories:false)
    defer{try? FileManager.default.removeItem(at:stage)}
    let stageOutput=stage.appendingPathComponent("output.png"),stageMask=stage.appendingPathComponent("mask.png")
    try context.writePNGRepresentation(of:cut,to:stageOutput,format:.RGBA8,colorSpace:cs)
    try context.writePNGRepresentation(of:mask,to:stageMask,format:.RGBA8,colorSpace:cs)
    // copyItem refuses existing paths; the input is never opened for writing.
    try FileManager.default.copyItem(at:stageMask,to:maskOutput)
    do{try FileManager.default.copyItem(at:stageOutput,to:output)}catch{try? FileManager.default.removeItem(at:maskOutput);throw error}
    let report:[String:Any]=["input":input.path,"output":output.path,"mask":maskOutput.path,"width":w,"height":h,"source_sha256":try sha(input),"output_sha256":try sha(output),"vision_revision":1,"tiles":observations,"protection_polygons":protect.count,"clip_polygons":clips.count,"status":"candidate_requires_alpha_and_visual_review"]
    print(String(decoding:try JSONSerialization.data(withJSONObject:report,options:[.prettyPrinted,.sortedKeys]),as:UTF8.self))
}
do{if #available(macOS 14.0, *){try run()}else{throw Failure("Requires macOS 14 or newer")}}catch{fputs("\(error)\n",stderr);exit(1)}
