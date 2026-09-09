#!/bin/zsh
cd -- "${0:A:h}"
node scripts/build-wrapper.mjs
node scripts/serve.mjs --start
open http://127.0.0.1:8767/
