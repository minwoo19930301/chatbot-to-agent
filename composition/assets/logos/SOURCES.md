# Official AI logos — Codex lecture

Retrieved 2026-09-09. All artwork was fetched anew from official product sites, their explicitly linked CDNs, or official GitHub repositories. No existing lecture/crawl assets were read or reused. No logo was generated, traced, redrawn, recolored, or cropped.

## Recommended deck assets

| File | Size / viewBox | Identity and source |
|---|---|---|
| `chatgpt.svg` | SVG 716×716; 2,415 bytes | Black ChatGPT/OpenAI Blossom, official OpenAI Cookbook [source](https://github.com/openai/openai-cookbook/blob/main/examples/voice_solutions/realtime_translation_guide/livekit-translation-demo/public/brand/chatgpt-blossom-black.svg), [raw](https://raw.githubusercontent.com/openai/openai-cookbook/main/examples/voice_solutions/realtime_translation_guide/livekit-translation-demo/public/brand/chatgpt-blossom-black.svg) |
| `chatgpt-white.svg` | SVG 716×716; 2,415 bytes | Official white counterpart for dark backgrounds. [Raw](https://raw.githubusercontent.com/openai/openai-cookbook/main/examples/voice_solutions/realtime_translation_guide/livekit-translation-demo/public/brand/chatgpt-blossom-white.svg) |
| `codex-provider.svg` | SVG 716×716; 2,415 bytes | Byte-identical copy of `chatgpt.svg`. **Provider-mark fallback, NOT a Codex-specific app icon.** Pair with the separate text “Codex / OpenAI”. A bounded check of official Codex repository and official app documentation found no standalone Codex product logo. Direct fetches of openai.com/codex and chatgpt.com/codex returned HTTP 403; no claim is made that a product icon does not exist. |
| `gemini.png` | PNG 512×512; 61,823 bytes | Official Google Gemini multicolor sparkle, linked by [Gemini](https://gemini.google.com/). [Raw Google CDN](https://www.gstatic.com/lamda/images/gemini_sparkle_4g_512_lt_f94943af3be039176192d.png) |
| `gemini.svg` | SVG 192×192; 27,794 bytes | Official alternative Aurora sparkle, linked by Gemini homepage. Includes an embedded JPEG data URI, not an external image. [Raw Google CDN](https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg) |
| `claude-wordmark.svg` | SVG 573×125; 8,034 bytes | Original Claude wordmark SVG extracted intact from [claude.com](https://claude.com/) navbar/footer (`ClaudeWordmark`, `aria-label="Claude"`). Uses `fill="currentColor"`, which renders black when loaded as a standalone img; use on white/light background. It is a wordmark, not the star icon. |
| `claude-code.svg` | SVG 254×28; 14,399 bytes | Official Claude Code wordmark from [Claude Code documentation](https://code.claude.com/docs/en/overview). Light-background original [raw CDN](https://mintcdn.com/claude-code/c5r9_6tjPMzFdDDT/logo/light.svg). |
| `claude-code-dark.svg` | SVG 254×28; 14,399 bytes | Official dark-background counterpart [raw CDN](https://mintcdn.com/claude-code/c5r9_6tjPMzFdDDT/logo/dark.svg). |
| `gemini-cli.png` | PNG 1645×1645; 46,696 bytes | Official Gemini CLI **VS Code IDE companion icon** (terminal mark); not the general Gemini product sparkle. [Repo source](https://github.com/google-gemini/gemini-cli/blob/main/packages/vscode-ide-companion/assets/icon.png), [raw](https://raw.githubusercontent.com/google-gemini/gemini-cli/main/packages/vscode-ide-companion/assets/icon.png). |
| `antigravity.png` | PNG 200×184; 16,849 bytes | Official Antigravity logo, declared as site icon in [antigravity.google](https://antigravity.google/). [Raw](https://antigravity.google/assets/image/antigravity-logo.png). |

## Additional originals

- `openai.svg`: SVG viewBox 721×721, 2,961 bytes. [Official OpenAI Agents SDK repository logo](https://raw.githubusercontent.com/openai/openai-agents-python/main/docs/assets/logo.svg). Provider symbol; no Codex-specific claim.
- `openai.png`: PNG 48×48, 1,841 bytes. [Official developer-site favicon](https://developers.openai.com/favicon.png). Small fallback, avoid enlarging.
- `claude.png`: PNG 192×192, 18,001 bytes. [Official Claude Code documentation favicon](https://code.claude.com/docs/_mintlify/favicons/claude-code/pLsy-mRpNksna2sx/_generated/favicon/android-chrome-192x192.png). Orange Claude star on dark rounded square. Source image is visually soft despite its 192px dimensions; prefer the vector wordmark for large placements.
- `claude-favicon.png`: PNG 32×32, 1,198 bytes. Official Claude site favicon linked by claude.com. [Raw official site CDN](https://cdn.sanity.io/images/4zrzovbb/claude-com/369b14e80ac643cc09dccd581ccb91f82b559190-32x32.png). Tiny fallback only.

## Validation and use

- All SVG files parse as XML and contain no scripts, event-handler attributes, foreignObject/iframe nodes, or external href resources. Gemini's original embedded JPEG is retained. Internal fragment references are allowed.
- All PNG files have valid PNG signatures and recorded IHDR dimensions. Claude/Antigravity/Gemini CLI images were visually inspected.
- `CHECKSUMS.sha256` records each unchanged original or exact-byte alias. SVG extraction for Claude removes the surrounding HTML only; the SVG itself is untouched.
- Trademarks remain owned by OpenAI, Google, and Anthropic. This is an educational comparison, not a partnership or endorsement. Keep original proportions/colors and adequate clear space. OpenAI's [official brand guidelines](https://openai.com/brand/) apply; no logo alteration is implied by downloading the files.
