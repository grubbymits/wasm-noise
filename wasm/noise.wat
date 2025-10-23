(module $noise.wasm
  (type (;0;) (func (param f64 f64) (result f64)))
  (func $noise2d (type 0) (param f64 f64) (result f64)
    (local v128 i32 i32 v128 v128 v128 v128 v128 v128 v128 f32 v128 v128 f32)
    v128.const i32x4 0x40000000 0x40000000 0x40000000 0x40000000
    local.tee 2
    local.get 1
    i32.trunc_sat_f64_u
    local.tee 3
    i32.const 1
    i32.add
    local.tee 4
    i32.const 16
    i32.shr_u
    local.get 4
    i32.xor
    i32x4.splat
    local.get 3
    i32.const 16
    i32.shr_u
    local.get 3
    i32.xor
    i32x4.replace_lane 1
    v128.const i32x4 0x21f0aaad 0x21f0aaad 0x21f0aaad 0x21f0aaad
    local.tee 5
    i32x4.mul
    local.tee 6
    i32.const 15
    i32x4.shr_u
    local.get 6
    v128.xor
    v128.const i32x4 0x735a2d97 0x735a2d97 0x735a2d97 0x735a2d97
    local.tee 7
    i32x4.mul
    local.tee 6
    i32.const 15
    i32x4.shr_u
    local.get 6
    v128.xor
    local.tee 8
    local.get 0
    i32.trunc_sat_f64_u
    local.tee 3
    i32.const 1
    i32.add
    i32x4.splat
    v128.xor
    local.tee 6
    i32.const 16
    i32x4.shr_u
    local.get 6
    v128.xor
    local.get 5
    i32x4.mul
    local.tee 6
    i32.const 15
    i32x4.shr_u
    local.get 6
    v128.xor
    local.get 7
    i32x4.mul
    local.tee 6
    i32.const 15
    i32x4.shr_u
    local.get 6
    v128.xor
    local.tee 6
    i32.const 16
    i32x4.shr_u
    local.get 6
    v128.xor
    local.get 5
    i32x4.mul
    local.tee 5
    i32.const 15
    i32x4.shr_u
    local.get 5
    v128.xor
    local.get 7
    i32x4.mul
    local.tee 5
    i32.const 15
    i32x4.shr_u
    local.get 5
    v128.xor
    f32x4.convert_i32x4_u
    local.tee 9
    local.get 9
    local.get 6
    f32x4.convert_i32x4_u
    local.tee 10
    local.get 10
    f32x4.mul
    f32x4.relaxed_madd
    f32x4.sqrt
    f32x4.div
    local.tee 11
    local.get 9
    v128.const i32x4 0xbf800000 0xbf800000 0xbf800000 0xbf800000
    local.tee 5
    f32x4.relaxed_madd
    local.tee 9
    local.get 0
    f32.demote_f64
    f32x4.splat
    local.get 1
    f32.demote_f64
    f32x4.replace_lane 1
    local.tee 6
    local.get 6
    f32x4.trunc
    f32x4.sub
    local.tee 6
    f32x4.extract_lane 1
    local.tee 12
    f32.const -0x1p+0 (;=-1;)
    f32.add
    f32x4.splat
    local.get 6
    i8x16.shuffle 0 1 2 3 16 17 18 19 0 1 2 3 0 1 2 3
    local.tee 13
    local.get 6
    i8x16.shuffle 0 1 2 3 20 21 22 23 0 1 2 3 0 1 2 3
    local.get 11
    local.get 10
    local.get 5
    f32x4.relaxed_madd
    local.tee 10
    local.get 6
    f32x4.extract_lane 0
    f32.const -0x1p+0 (;=-1;)
    f32.add
    f32x4.splat
    f32x4.mul
    f32x4.relaxed_madd
    local.get 9
    local.get 9
    local.get 10
    local.get 10
    f32x4.mul
    f32x4.relaxed_madd
    f32x4.sqrt
    f32x4.div
    local.get 2
    local.get 8
    i32x4.extract_lane 0
    local.get 3
    i32.xor
    local.tee 4
    i32.const 16
    i32.shr_u
    local.get 4
    i32.xor
    i32.const 569420461
    i32.mul
    local.tee 4
    i32.const 15
    i32.shr_u
    local.get 4
    i32.xor
    i32x4.splat
    local.get 8
    i32x4.extract_lane 1
    local.get 3
    i32.xor
    local.tee 3
    i32.const 16
    i32.shr_u
    local.get 3
    i32.xor
    i32.const 569420461
    i32.mul
    local.tee 3
    i32.const 15
    i32.shr_u
    local.get 3
    i32.xor
    i32.const 1935289751
    i32.mul
    local.tee 3
    i32.const 15
    i32.shr_u
    local.get 3
    i32.xor
    local.tee 3
    i32.const 16
    i32.shr_u
    local.get 3
    i32.xor
    i32.const 569420461
    i32.mul
    local.tee 4
    i32.const 15
    i32.shr_u
    local.get 4
    i32.xor
    i32x4.replace_lane 1
    local.get 7
    i32x4.mul
    local.tee 7
    i32.const 15
    i32x4.shr_u
    local.tee 8
    local.get 8
    local.get 7
    v128.xor
    local.tee 8
    i32x4.extract_lane 0
    local.tee 4
    i32.const 16
    i32.shr_u
    local.get 4
    i32.xor
    i32.const 569420461
    i32.mul
    local.tee 4
    i32.const 15
    i32.shr_u
    local.get 4
    i32.xor
    i32.const 1935289751
    i32.mul
    local.tee 4
    i32.const 15
    i32.shr_u
    i32x4.replace_lane 0
    local.get 7
    local.get 4
    i32x4.replace_lane 0
    v128.xor
    local.tee 11
    local.get 3
    i32x4.replace_lane 1
    f32x4.convert_i32x4_u
    local.tee 9
    local.get 8
    f32x4.convert_i32x4_u
    local.tee 10
    i8x16.shuffle 0 1 2 3 20 21 22 23 0 1 2 3 0 1 2 3
    local.tee 7
    local.get 7
    local.get 10
    local.get 9
    i8x16.shuffle 0 1 2 3 20 21 22 23 0 1 2 3 0 1 2 3
    local.tee 14
    local.get 14
    f32x4.mul
    f32x4.relaxed_madd
    f32x4.sqrt
    f32x4.div
    local.tee 7
    local.get 10
    local.get 5
    f32x4.relaxed_madd
    local.tee 10
    local.get 6
    local.get 7
    local.get 9
    local.get 5
    f32x4.relaxed_madd
    local.tee 9
    local.get 13
    f32x4.mul
    f32x4.relaxed_madd
    local.get 7
    local.get 11
    f32x4.convert_i32x4_u
    local.get 5
    f32x4.relaxed_madd
    local.get 9
    local.get 10
    i8x16.shuffle 0 1 2 3 20 21 22 23 0 1 2 3 0 1 2 3
    local.get 7
    local.get 8
    local.get 3
    i32x4.replace_lane 1
    f32x4.convert_i32x4_u
    local.get 5
    f32x4.relaxed_madd
    local.get 10
    local.get 9
    i8x16.shuffle 0 1 2 3 20 21 22 23 0 1 2 3 0 1 2 3
    f32x4.mul
    f32x4.relaxed_madd
    f32x4.sqrt
    f32x4.div
    local.tee 5
    f32x4.sub
    local.get 6
    local.get 5
    i8x16.shuffle 0 1 2 3 0 1 2 3 0 1 2 3 0 1 2 3
    local.get 5
    f32x4.relaxed_madd
    local.tee 5
    f32x4.extract_lane 0
    local.get 5
    f32x4.extract_lane 1
    local.tee 15
    f32.sub
    local.get 12
    f32.mul
    local.get 15
    f32.add
    f64.promote_f32)
  (memory (;0;) 2)
  (global $__stack_pointer (mut i32) (i32.const 66560))
  (export "memory" (memory 0))
  (export "noise2d" (func $noise2d))
  (@custom "name" "\00\0b\0anoise.wasm\01\0a\01\00\07noise2d\07\12\01\00\0f__stack_pointer")
  (@custom "producers" "\01\0cprocessed-by\01\05clang\0922.0.0git")
  (@custom "target_features" "\0a+\0bbulk-memory+\0fbulk-memory-opt+\16call-indirect-overlong+\0amultivalue+\0fmutable-globals+\13nontrapping-fptoint+\0freference-types+\0crelaxed-simd+\08sign-ext+\07simd128"))
