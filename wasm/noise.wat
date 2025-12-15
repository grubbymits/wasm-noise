(module $noise.wasm
  (type (;0;) (func (param f32) (result f32)))
  (type (;1;) (func (param f64 f64) (result f64)))
  (type (;2;) (func (param f64 f64 i32) (result f64)))
  (func $noise2d (type 1) (param f64 f64) (result f64)
    local.get 0
    local.get 1
    i32.const 1
    call $noise_fade)
  (func $no_fade (type 0) (param f32) (result f32)
    local.get 0)
  (func $noise_fade (type 2) (param f64 f64 i32) (result f64)
    (local v128 v128 f32 v128 i32 i32 v128 v128 v128 v128 v128 f32 v128 v128)
    local.get 0
    f32.demote_f64
    f32x4.splat
    local.get 1
    f32.demote_f64
    f32x4.replace_lane 1
    local.tee 3
    local.get 3
    f32x4.trunc
    f32x4.sub
    local.tee 4
    f32x4.extract_lane 0
    local.tee 5
    local.get 2
    call_indirect (type 0)
    f32x4.splat
    v128.const i32x4 0x40000000 0x40000000 0x40000000 0x40000000
    local.tee 6
    local.get 1
    i32.trunc_sat_f64_u
    local.tee 7
    i32.const 1
    i32.add
    local.tee 8
    i32.const 16
    i32.shr_u
    local.get 8
    i32.xor
    i32x4.splat
    local.get 7
    i32.const 16
    i32.shr_u
    local.get 7
    i32.xor
    i32x4.replace_lane 1
    v128.const i32x4 0x21f0aaad 0x21f0aaad 0x21f0aaad 0x21f0aaad
    local.tee 3
    i32x4.mul
    local.tee 9
    i32.const 15
    i32x4.shr_u
    local.get 9
    v128.xor
    v128.const i32x4 0x735a2d97 0x735a2d97 0x735a2d97 0x735a2d97
    local.tee 9
    i32x4.mul
    local.tee 10
    i32.const 15
    i32x4.shr_u
    local.get 10
    v128.xor
    local.tee 10
    local.get 0
    i32.trunc_sat_f64_u
    local.tee 7
    i32.const 1
    i32.add
    i32x4.splat
    v128.xor
    local.tee 11
    i32.const 16
    i32x4.shr_u
    local.get 11
    v128.xor
    local.get 3
    i32x4.mul
    local.tee 11
    i32.const 15
    i32x4.shr_u
    local.get 11
    v128.xor
    local.get 9
    i32x4.mul
    local.tee 11
    i32.const 15
    i32x4.shr_u
    local.get 11
    v128.xor
    local.tee 11
    i32.const 16
    i32x4.shr_u
    local.get 11
    v128.xor
    local.get 3
    i32x4.mul
    local.tee 3
    i32.const 15
    i32x4.shr_u
    local.get 3
    v128.xor
    local.get 9
    i32x4.mul
    local.tee 3
    i32.const 15
    i32x4.shr_u
    local.get 3
    v128.xor
    f32x4.convert_i32x4_u
    local.tee 12
    local.get 12
    local.get 11
    f32x4.convert_i32x4_u
    local.tee 11
    local.get 11
    f32x4.mul
    f32x4.relaxed_madd
    f32x4.sqrt
    f32x4.div
    local.tee 13
    local.get 12
    v128.const i32x4 0xbf800000 0xbf800000 0xbf800000 0xbf800000
    local.tee 3
    f32x4.relaxed_madd
    local.tee 12
    local.get 4
    f32x4.extract_lane 1
    local.tee 14
    f32.const -0x1p+0 (;=-1;)
    f32.add
    f32x4.splat
    local.get 4
    i8x16.shuffle 0 1 2 3 16 17 18 19 0 1 2 3 0 1 2 3
    local.tee 15
    local.get 4
    i8x16.shuffle 0 1 2 3 20 21 22 23 0 1 2 3 0 1 2 3
    local.get 13
    local.get 11
    local.get 3
    f32x4.relaxed_madd
    local.tee 11
    local.get 5
    f32.const -0x1p+0 (;=-1;)
    f32.add
    f32x4.splat
    f32x4.mul
    f32x4.relaxed_madd
    local.get 12
    local.get 12
    local.get 11
    local.get 11
    f32x4.mul
    f32x4.relaxed_madd
    f32x4.sqrt
    f32x4.div
    local.get 6
    local.get 10
    i32x4.extract_lane 0
    local.get 7
    i32.xor
    local.tee 8
    i32.const 16
    i32.shr_u
    local.get 8
    i32.xor
    i32.const 569420461
    i32.mul
    local.tee 8
    i32.const 15
    i32.shr_u
    local.get 8
    i32.xor
    i32x4.splat
    local.get 10
    i32x4.extract_lane 1
    local.get 7
    i32.xor
    local.tee 7
    i32.const 16
    i32.shr_u
    local.get 7
    i32.xor
    i32.const 569420461
    i32.mul
    local.tee 7
    i32.const 15
    i32.shr_u
    local.get 7
    i32.xor
    i32.const 1935289751
    i32.mul
    local.tee 7
    i32.const 15
    i32.shr_u
    local.get 7
    i32.xor
    local.tee 7
    i32.const 16
    i32.shr_u
    local.get 7
    i32.xor
    i32.const 569420461
    i32.mul
    local.tee 8
    i32.const 15
    i32.shr_u
    local.get 8
    i32.xor
    i32x4.replace_lane 1
    local.get 9
    i32x4.mul
    local.tee 9
    i32.const 15
    i32x4.shr_u
    local.tee 10
    local.get 10
    local.get 9
    v128.xor
    local.tee 10
    i32x4.extract_lane 0
    local.tee 8
    i32.const 16
    i32.shr_u
    local.get 8
    i32.xor
    i32.const 569420461
    i32.mul
    local.tee 8
    i32.const 15
    i32.shr_u
    local.get 8
    i32.xor
    i32.const 1935289751
    i32.mul
    local.tee 8
    i32.const 15
    i32.shr_u
    i32x4.replace_lane 0
    local.get 9
    local.get 8
    i32x4.replace_lane 0
    v128.xor
    local.tee 13
    local.get 7
    i32x4.replace_lane 1
    f32x4.convert_i32x4_u
    local.tee 11
    local.get 10
    f32x4.convert_i32x4_u
    local.tee 12
    i8x16.shuffle 0 1 2 3 20 21 22 23 0 1 2 3 0 1 2 3
    local.tee 9
    local.get 9
    local.get 12
    local.get 11
    i8x16.shuffle 0 1 2 3 20 21 22 23 0 1 2 3 0 1 2 3
    local.tee 16
    local.get 16
    f32x4.mul
    f32x4.relaxed_madd
    f32x4.sqrt
    f32x4.div
    local.tee 9
    local.get 12
    local.get 3
    f32x4.relaxed_madd
    local.tee 12
    local.get 4
    local.get 9
    local.get 11
    local.get 3
    f32x4.relaxed_madd
    local.tee 11
    local.get 15
    f32x4.mul
    f32x4.relaxed_madd
    local.get 9
    local.get 13
    f32x4.convert_i32x4_u
    local.get 3
    f32x4.relaxed_madd
    local.get 11
    local.get 12
    i8x16.shuffle 0 1 2 3 20 21 22 23 0 1 2 3 0 1 2 3
    local.get 9
    local.get 10
    local.get 7
    i32x4.replace_lane 1
    f32x4.convert_i32x4_u
    local.get 3
    f32x4.relaxed_madd
    local.get 12
    local.get 11
    i8x16.shuffle 0 1 2 3 20 21 22 23 0 1 2 3 0 1 2 3
    f32x4.mul
    f32x4.relaxed_madd
    f32x4.sqrt
    f32x4.div
    local.tee 3
    f32x4.sub
    local.get 3
    f32x4.relaxed_madd
    local.tee 3
    f32x4.extract_lane 0
    local.get 3
    f32x4.extract_lane 1
    local.tee 5
    f32.sub
    local.get 14
    local.get 2
    call_indirect (type 0)
    f32.mul
    local.get 5
    f32.add
    f64.promote_f32)
  (func $noise2d_hermite (type 1) (param f64 f64) (result f64)
    local.get 0
    local.get 1
    i32.const 2
    call $noise_fade)
  (func $fade_hermite (type 0) (param f32) (result f32)
    (local f64)
    local.get 0
    f64.promote_f32
    local.tee 1
    local.get 1
    f64.mul
    f64.const 0x1.8p+1 (;=3;)
    local.get 1
    local.get 1
    f64.add
    f64.sub
    f64.mul
    f32.demote_f64)
  (func $noise2d_quintic (type 1) (param f64 f64) (result f64)
    local.get 0
    local.get 1
    i32.const 3
    call $noise_fade)
  (func $fade_quintic (type 0) (param f32) (result f32)
    (local f64)
    local.get 0
    f64.promote_f32
    local.tee 1
    local.get 1
    f64.mul
    local.get 1
    f64.mul
    local.get 1
    f64.const 0x1.8p+2 (;=6;)
    f64.mul
    f64.const -0x1.ep+3 (;=-15;)
    f64.add
    local.get 1
    f64.mul
    f64.const 0x1.4p+3 (;=10;)
    f64.add
    f64.mul
    f32.demote_f64)
  (table (;0;) 4 4 funcref)
  (memory (;0;) 1)
  (global $__stack_pointer (mut i32) (i32.const 65536))
  (export "memory" (memory 0))
  (export "noise2d" (func $noise2d))
  (export "noise2d_hermite" (func $noise2d_hermite))
  (export "noise2d_quintic" (func $noise2d_quintic))
  (elem (;0;) (i32.const 1) func $no_fade $fade_hermite $fade_quintic)
  (@custom "name" "\00\0b\0anoise.wasm\01]\07\00\07noise2d\01\07no_fade\02\0anoise_fade\03\0fnoise2d_hermite\04\0cfade_hermite\05\0fnoise2d_quintic\06\0cfade_quintic\07\12\01\00\0f__stack_pointer")
  (@custom "producers" "\01\0cprocessed-by\01\05clang\0922.0.0git")
  (@custom "target_features" "\0a+\0bbulk-memory+\0fbulk-memory-opt+\16call-indirect-overlong+\0amultivalue+\0fmutable-globals+\13nontrapping-fptoint+\0freference-types+\0crelaxed-simd+\08sign-ext+\07simd128"))
