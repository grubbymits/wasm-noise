#!/bin/sh

set -x

clang \
  --target=wasm32-unknown-unknown \
  -I /opt/wasi-sdk/share/wasi-sysroot/include/wasm32-wasi \
  -O3 -ffast-math \
  -msimd128 -relaxed-simd \
  -nostdlib \
  -Wl,--no-entry,--export=noise2d \
  ./c/2d.c \
  -I ./c/ \
  -o wasm/noise.wasm
