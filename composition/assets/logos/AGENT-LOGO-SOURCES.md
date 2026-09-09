# Agent and company logo sources

Acquired anew on 2026-09-09. No existing lecture image was reused; no symbol was generated, traced, redrawn, recolored, or cropped. Shared SOURCES.md was not edited.

## Agent identities and originals

### OpenClaw
- Official project: https://github.com/openclaw/openclaw (repository homepage field points to https://openclaw.ai).
- `openclaw.svg`: https://openclaw.ai/favicon.svg — the original red lobster symbol used as the official homepage favicon and visible logo.
- Repository inspected at `a3fa9fc3bef4208c525231d82dc7a56dc24fb6b1`.

### Pi coding agent / toolkit
- This is the terminal coding harness in https://github.com/badlogic/pi-mono, **not Inflection's Pi chatbot**.
- The old requested path `mariozechner/pi-mono` returned 404; the current official repository is `badlogic/pi-mono`.
- Official coding-agent README https://github.com/badlogic/pi-mono/blob/6160683a4a8012f0d1cd30c145df18b4ca6f5176/packages/coding-agent/README.md directly links the site and labels its image “pi logo”.
- `pi-agent.svg`: https://pi.dev/logo-auto.svg — original geometric Pi mark. Its original CSS is black in light mode and white in dark mode (`prefers-color-scheme`). Keep original CSS or use a light page color scheme when placing on a white card.

### Hermes Agent / Nous Research
- Official project: https://github.com/NousResearch/hermes-agent; official site https://hermes-agent.nousresearch.com/.
- `hermes-agent.png`: original **Hermes Desktop app icon**, https://raw.githubusercontent.com/NousResearch/hermes-agent/c32e0acb0ec59d53ac964007c75630e098bcd045/apps/desktop/assets/icon.png. Black/white Nous-style portrait in a rounded app tile; visually inspected. This is the app's shipped asset, not a separately invented Hermes pictogram.
- `hermes-agent.svg`: original docs favicon, https://raw.githubusercontent.com/NousResearch/hermes-agent/c32e0acb0ec59d53ac964007c75630e098bcd045/website/static/img/favicon.svg. **A text-based medical/caduceus-style Unicode symbol (⚕), not a path-based logo.** Rendering depends on fonts; prefer the shipped PNG or plain “Hermes Agent” text for predictable rendering.
- The repository's website/static/img/logo.png contains a larger Nous portrait; it was inspected during discovery, but the final PNG above is the actual desktop icon.

## Company marks (not model/product labels)

- `google-company.png`: official Google corporate wordmark from https://www.google.com/images/branding/google_wordmark/v1/1x/googlelogo_color_white_background_272x92dp.png. Exact image src observed on https://www.google.com/ on retrieval. Light/white-background original, 272×92 pixels; no Gemini mark substitution.
- `anthropic-company.svg`: original Anthropic company monogram extracted from https://www.anthropic.com/ navigation (`nav_logo_wrap`). Original path geometry and currentColor fills preserved. Only the standard SVG xmlns attribute was added so the inline original can be loaded as a standalone image. This is the company monogram, not the Claude star or wordmark; use with separate “Anthropic” text.
- `openai-company.svg`: official OpenAI corporate Blossom from https://raw.githubusercontent.com/openai/openai-agents-python/main/docs/assets/logo.svg. A provider/company symbol, not a model-specific icon or wordmark. Direct openai.com/brand HTML fetch returned 403; no unverified third-party wordmark was substituted. Use with separate “OpenAI” text.

## Validation

All SVGs parse as XML; no script, foreignObject, iframe, event attributes, or external href resources. Pi retains its original local CSS; Hermes SVG retains its original text glyph. PNG signatures and dimensions checked. Art is unchanged except the XML namespace addition noted above. Marks remain owned by their respective projects/companies; their appearance in a comparison does not imply endorsement.

| File | ViewBox / pixels | Bytes | SHA-256 |
|---|---|---:|---|
| `openclaw.svg` | 0 0 120 120 | 1,194 | `fa7e2ec07ebfa696bcc8c27d7e36425cbb7b1772f6f7f04ce390cf5f1c35cf0e` |
| `pi-agent.svg` | 0 0 800 800 | 618 | `03d509c104b9570063fa268fd3235ed7e0e41dafd93124ca94cae3726f58f117` |
| `hermes-agent.png` | 1024×1024 | 574,273 | `d60d164e24fdcf6532133b8ea43c77a201e4b9e9dbc396187b58d51d8590ef52` |
| `hermes-agent.svg` | 0 0 100 100 | 113 | `c4d55805bda8e16072ed77c0725176ab2218a9e628d1ba776a6048a39c28f751` |
| `google-company.png` | 272×92 | 2,478 | `7700adbd25c8c9775c660116b7447384e6f676209739b8a303a9c4852ff6436e` |
| `anthropic-company.svg` | 0 0 35 24 | 357 | `e722a7c2f51ecd0282d194813b8c83b2448dd309552749fe7feb925b99d424b5` |
| `openai-company.svg` | 0 0 721 721 | 2,961 | `b94ea61d860fae6f82f43571f36f17111fcf5d348e8e9cc22ae4b441c7560011` |
