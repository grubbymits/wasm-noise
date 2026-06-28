#!/bin/sh

set -x

wasm32-clang \
  --target=wasm32-unknown-unknown \
  -O3 -ffast-math \
  -msimd128 \
  -nostdlib \
  ./c/2d.c \
  -I ./c/ \
  -c \
  -o wasm/2d.o

emcc \
  --target=wasm32-unknown-emscripten \
  -O1 -g -ffast-math -std=c++2c \
  -msimd128 \
  ./cpp/tileable.cc \
  -c \
  -o wasm/tileable.o

emcc \
  -s STANDALONE_WASM \
  -s IMPORTED_MEMORY=1 \
  -s INITIAL_MEMORY=128KB \
  -Wl,--no-entry \
  wasm/2d.o \
  wasm/tileable.o \
  -o wasm/noise.wasm
