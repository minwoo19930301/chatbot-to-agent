# Local slideshow runtime

Run `npm run dev`, then open `http://127.0.0.1:8767/`. The server binds to localhost and stays available after the launching shell exits. `DECK_PORT` selects another port; `npm run status` and `npm run stop` manage this project only.

`scripts/build-composition.py` generates the authored scenes and inline motion runtime in `composition/index.html`. `npm run build` reads the manifest and synchronizes the JSON metadata island in both HTML files. Scene IDs and positive continuous time ranges come from the manifest; notes stay verbatim. The current lesson contains 49 scenes with six-second seek slots. These coordinates do not limit speaking time.

The standalone wrapper uses local vendor bundles and HyperFrames' built-in arrow navigation, P/Present, notes and audience synchronization. There is no automatic slide advance or extra presenter control.

## Composition contract

- Load `vendor/gsap.min.js` relative to the raw composition and local assets without parent traversal.
- Register a paused `window.__timelines.root` clock with a matching root carrier element and the full manifest duration.
- Implement `window.__hfSetTime(t)` for immediate scene visibility and connect the clock's onUpdate.
- Post the timeline metadata to the parent after load.
- The wrapper enables `__hfCameraTransitionsEnabled`. Only manual scene changes animate shared image poses or directional camera travel, finishing within 0.92 seconds. First load, reduced motion and direct composition validation show static poses.
- Keep one cancellable GSAP context, clean up overlays on rapid navigation and resize, and preserve original object-fit/object-position. Do not add resting loops or competing parent/child transforms.

`npm run check` targets raw `composition/`, not the web-component wrapper. Vendor hashes and licenses live in `vendor/`; CLI 0.8.33 checks are separate from browser player/slideshow 0.8.31.
