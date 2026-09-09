# Cutouts A — native alpha results

User authorized native local background extraction on 2026-09-09. The earlier image-generation transparency attempt failed (RGB checkerboard); none of that output is used here.

These five outputs use macOS Vision `VNGenerateForegroundInstanceMaskRequest` revision 1, all detected instances, Core Image masks, and original image RGB. No new object pixels were generated. Original files and composition code were left unchanged. Canvas dimensions, atlas tile positions, and object scale were preserved. Ground backdrop/shadows were excluded; antialiased object edges retain partial alpha.

## Native repairs

- `object-atlas.png`: six independent 512×512 requests, reassembled without resizing into the original 1536×1024 layout. Native Vision omitted most of the bottom-right paper stack even on a tighter repeat crop. An original-silhouette protection polygon restores that stack; its green check is retained by the Vision mask. All six cells, both USB ends, standalone paper, monitor and keyboard are visible in the review.
- `local-llm.png`: an original black-screen-frame silhouette protection polygon restores the omitted top frame and white screen interior.
- `datacenter.png`: a protection polygon restores the omitted narrow left metal upright; an outer bound removes a small exterior fringe. All three racks and the brain remain.
- `web-chat.png`: a bottom-edge clipping half-plane removes a small background fragment below the window. White dialog content stays opaque.
- `model-package.png`: unmodified Vision mask; white box flaps and brain stay intact.

Mask union uses `CIMaximumCompositing`; trimming uses `CIMinimumCompositing`. Final alpha is applied to original RGB with `CIBlendWithMask` against a transparent canvas. Polygon coordinates refer to original top-left image pixels; CGContext conversion preserves placement. Source-specific paths deliberately remain separate from any generic helper.

## Validation

Pillow was used read-only for PNG mode, dimensions, alpha histogram, source/output hashes and opacity samples. All five outputs are RGBA, all four corner alpha values are 0, and every recorded object-interior sample is alpha 255. Native Swift/Core Graphics produced the final dark-background contact sheet, visually reviewed at [CUTOUTS-A-CONTACT.png](CUTOUTS-A-CONTACT.png). White screens, papers and box interiors were also reviewed individually against dark backgrounds.

| File | Dimensions | Fully transparent | Fully opaque | Bytes |
|---|---:|---:|---:|---:|
| `composition/assets/cutouts/object-atlas.png` | 1536×1024 | 68.7325% | 29.6511% | 976731 |
| `composition/assets/cutouts/local-llm.png` | 1254×1254 | 58.7436% | 40.0415% | 987641 |
| `composition/assets/cutouts/datacenter.png` | 1254×1254 | 44.5494% | 53.5607% | 1652265 |
| `composition/assets/cutouts/model-package.png` | 1254×1254 | 53.0892% | 44.3905% | 1240047 |
| `composition/assets/cutouts/web-chat.png` | 1254×1254 | 57.5455% | 40.8039% | 825533 |

## Reproduction and exact evidence

Native preparation used separate extraction, source-mask repair and visual-review scripts on macOS 26.2 / Swift 6.3.1. The reusable macOS 14+ equivalent is documented in [the optional native cutout helper](NATIVE-CUTOUTS.md); asset-specific protection paths are not applied to unrelated images.

Official API: https://developer.apple.com/documentation/vision/vngenerateforegroundinstancemaskrequest and https://developer.apple.com/documentation/vision/vninstancemaskobservation .

```json
[
  {
    "name": "object-atlas",
    "source": "composition/assets/object-atlas.png",
    "output": "composition/assets/cutouts/object-atlas.png",
    "size": [
      1536,
      1024
    ],
    "mode": "RGBA",
    "bytes": 976731,
    "source_sha256": "7d503698d3efa1ef5c343a1ef3ddf2ab52ae921e4680c0c22b732cc456ac7632",
    "output_sha256": "d0101f0e0c3021b55ad951881b7cd1819103d2be94a3522945ebfeb8af23c79a",
    "corners_alpha": [
      0,
      0,
      0,
      0
    ],
    "alpha_zero_percent": 68.7325,
    "alpha_255_percent": 29.6511,
    "samples": {
      "brain": {
        "xy": [
          250,
          240
        ],
        "alpha": 255,
        "rgb": [
          173,
          172,
          170
        ],
        "source_rgb": [
          173,
          172,
          170
        ]
      },
      "front_bubble": {
        "xy": [
          680,
          240
        ],
        "alpha": 255,
        "rgb": [
          232,
          231,
          230
        ],
        "source_rgb": [
          232,
          231,
          230
        ]
      },
      "USB_metal": {
        "xy": [
          1130,
          240
        ],
        "alpha": 255,
        "rgb": [
          224,
          223,
          223
        ],
        "source_rgb": [
          224,
          223,
          223
        ]
      },
      "standalone_paper": {
        "xy": [
          390,
          740
        ],
        "alpha": 255,
        "rgb": [
          224,
          224,
          224
        ],
        "source_rgb": [
          224,
          224,
          224
        ]
      },
      "monitor_screen": {
        "xy": [
          610,
          610
        ],
        "alpha": 255,
        "rgb": [
          244,
          244,
          244
        ],
        "source_rgb": [
          244,
          244,
          244
        ]
      },
      "paper_stack": {
        "xy": [
          1190,
          680
        ],
        "alpha": 255,
        "rgb": [
          248,
          248,
          248
        ],
        "source_rgb": [
          248,
          248,
          248
        ]
      },
      "checkmark": {
        "xy": [
          1430,
          775
        ],
        "alpha": 255,
        "rgb": [
          63,
          187,
          54
        ],
        "source_rgb": [
          63,
          187,
          54
        ]
      },
      "keyboard": {
        "xy": [
          780,
          880
        ],
        "alpha": 255,
        "rgb": [
          240,
          241,
          240
        ],
        "source_rgb": [
          240,
          241,
          240
        ]
      }
    },
    "tile_alpha_zero_percent": [
      65.348,
      68.96,
      85.534,
      63.916,
      56.773,
      71.865
    ]
  },
  {
    "name": "local-llm",
    "source": "composition/assets/local-llm.png",
    "output": "composition/assets/cutouts/local-llm.png",
    "size": [
      1254,
      1254
    ],
    "mode": "RGBA",
    "bytes": 987641,
    "source_sha256": "bd89d38a5445a3f1f005e9f138d712df77d8fb650f38044ccbda1f57be13190c",
    "output_sha256": "d8c975058ca865be09e59f46a8d431d9b21f6810946ca70f235a81f6b7e9dd6c",
    "corners_alpha": [
      0,
      0,
      0,
      0
    ],
    "alpha_zero_percent": 58.7436,
    "alpha_255_percent": 40.0415,
    "samples": {
      "white_screen": {
        "xy": [
          275,
          350
        ],
        "alpha": 255,
        "rgb": [
          254,
          254,
          254
        ],
        "source_rgb": [
          254,
          254,
          254
        ]
      },
      "black_frame": {
        "xy": [
          600,
          266
        ],
        "alpha": 255,
        "rgb": [
          33,
          34,
          33
        ],
        "source_rgb": [
          33,
          34,
          33
        ]
      },
      "keyboard": {
        "xy": [
          600,
          865
        ],
        "alpha": 255,
        "rgb": [
          119,
          127,
          117
        ],
        "source_rgb": [
          119,
          127,
          117
        ]
      },
      "brain": {
        "xy": [
          600,
          600
        ],
        "alpha": 255,
        "rgb": [
          167,
          169,
          166
        ],
        "source_rgb": [
          167,
          169,
          166
        ]
      }
    }
  },
  {
    "name": "datacenter",
    "source": "composition/assets/datacenter.png",
    "output": "composition/assets/cutouts/datacenter.png",
    "size": [
      1254,
      1254
    ],
    "mode": "RGBA",
    "bytes": 1652265,
    "source_sha256": "ff4f6f259ba29d6ef9f76b5fbacccd41191e5a4298b6675c774efe92d0b09583",
    "output_sha256": "03aa19e50983fcf9c77ac233d639361570b2aac33b1483800fa530b0c255b64f",
    "corners_alpha": [
      0,
      0,
      0,
      0
    ],
    "alpha_zero_percent": 44.5494,
    "alpha_255_percent": 53.5607,
    "samples": {
      "left_rack": {
        "xy": [
          280,
          600
        ],
        "alpha": 255,
        "rgb": [
          37,
          35,
          35
        ],
        "source_rgb": [
          37,
          35,
          35
        ]
      },
      "middle_rack": {
        "xy": [
          650,
          600
        ],
        "alpha": 255,
        "rgb": [
          104,
          105,
          105
        ],
        "source_rgb": [
          104,
          105,
          105
        ]
      },
      "right_rack": {
        "xy": [
          1000,
          600
        ],
        "alpha": 255,
        "rgb": [
          65,
          65,
          65
        ],
        "source_rgb": [
          65,
          65,
          65
        ]
      },
      "left_metal_edge": {
        "xy": [
          143,
          525
        ],
        "alpha": 255,
        "rgb": [
          180,
          182,
          183
        ],
        "source_rgb": [
          180,
          182,
          183
        ]
      },
      "brain": {
        "xy": [
          620,
          150
        ],
        "alpha": 255,
        "rgb": [
          254,
          254,
          255
        ],
        "source_rgb": [
          254,
          254,
          255
        ]
      }
    }
  },
  {
    "name": "model-package",
    "source": "composition/assets/model-package.png",
    "output": "composition/assets/cutouts/model-package.png",
    "size": [
      1254,
      1254
    ],
    "mode": "RGBA",
    "bytes": 1240047,
    "source_sha256": "1adf3d46a785dcb84266139296e1f46711d3d6968b7fa4438c92e1627ac9a688",
    "output_sha256": "c423fcecdfca069ee4d51aed73a1b678bd6957d166b532f63d00921cfd260841",
    "corners_alpha": [
      0,
      0,
      0,
      0
    ],
    "alpha_zero_percent": 53.0892,
    "alpha_255_percent": 44.3905,
    "samples": {
      "white_box": {
        "xy": [
          450,
          830
        ],
        "alpha": 255,
        "rgb": [
          232,
          231,
          232
        ],
        "source_rgb": [
          232,
          231,
          232
        ]
      },
      "brain": {
        "xy": [
          600,
          530
        ],
        "alpha": 255,
        "rgb": [
          159,
          157,
          156
        ],
        "source_rgb": [
          159,
          157,
          156
        ]
      }
    }
  },
  {
    "name": "web-chat",
    "source": "composition/assets/web-chat.png",
    "output": "composition/assets/cutouts/web-chat.png",
    "size": [
      1254,
      1254
    ],
    "mode": "RGBA",
    "bytes": 825533,
    "source_sha256": "2618c63c8f4c4737bf28c036f7fc6967ec8c564ec5c13757604d24890eef7ee7",
    "output_sha256": "881faf29166a6839261229ac5e30dc8d0cc080a7a8be376d9df8a88e9f27ac47",
    "corners_alpha": [
      0,
      0,
      0,
      0
    ],
    "alpha_zero_percent": 57.5455,
    "alpha_255_percent": 40.8039,
    "samples": {
      "white_interior": {
        "xy": [
          500,
          550
        ],
        "alpha": 255,
        "rgb": [
          246,
          246,
          245
        ],
        "source_rgb": [
          246,
          246,
          245
        ]
      },
      "bubble": {
        "xy": [
          850,
          530
        ],
        "alpha": 255,
        "rgb": [
          96,
          198,
          100
        ],
        "source_rgb": [
          96,
          198,
          100
        ]
      },
      "frame": {
        "xy": [
          200,
          500
        ],
        "alpha": 255,
        "rgb": [
          129,
          129,
          129
        ],
        "source_rgb": [
          129,
          129,
          129
        ]
      }
    }
  }
]
```
