#!/bin/sh

set -x

wasm32-clang \
  --target=wasm32-unknown-unknown \
  -O3 -ffast-math \
  -msimd128 -mrelaxed-simd \
  -nostdlib \
  -Wl,--no-entry,--export=noise2d \
  ./c/2d.c \
  -I ./c/ \
  -o wasm/noise.wasm
