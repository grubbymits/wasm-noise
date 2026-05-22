//  filter[] = { 1/16,  2/16, 1/16, 2/16, 4/16, 2/16, 1/16, 2/16, 1/16};
//  filter[] = { f0,    f1,   f2,   f3,   f4,   f5,   f6,   f7,   f8 };
//  
//  img[][] = {
//    { i0,   i1, i2,   i3 },
//    { i4,   i5, i6,   i7 },
//    { i8,   i9, i10, i11 },
//    { i12, i13, i14, i15 },
//  };
//  
//  out[][] = {
//    { o0, o1 },
//    { o2, o3 },
//  };
//  
//  o0 = 
//  i0 * f0,  i1 * f1,  i2 * f2,
//  i4 * f3,  i5 * f4,  i6 * f5,
//  i8 * f6,  i9 * f7,  i10 * f8
//  
//  o1 =
//  i1 * f0,  i2 * f1,  i3 * f2,
//  i5 * f3,  i6 * f4,  i7 * f5,
//  i9 * f6,  i10 * f7, i11 * f8,
//  
//  o2 =
//  i4 * f0,  i5 * f1,  i6 * f2,
//  i8 * f3,  i9 * f4,  i10 * f5,
//  i12 * f6, i13 * f7, i14 * f8,
//  
//  o3 = 
//  i5 * f0,  i6 * f1,  i7 * f2,
//  i9 * f3,  i10 * f4, i11 * f5,
//  i13 * f6, i14 * f7, i15 * f8,
//
//  But:
//  f0 == f2 == f6 == f8
//  f1 == f3 == f5 == f7
//
//  So:
//
//  o0 = 
//  i0 * f0,  i1 * f1,  i2 * f0,
//  i4 * f1,  i5 * f4,  i6 * f1,
//  i8 * f0,  i9 * f1,  i10 * f0
//
//  o1 =
//  i1 * f0,  i2 * f1,  i3 * f0,
//  i5 * f1,  i6 * f4,  i7 * f1,
//  i9 * f0,  i10 * f1, i11 * f0,
//
//  o2 =
//  i4 * f0,  i5 * f1,  i6 * f0,
//  i8 * f1,  i9 * f4,  i10 * f1,
//  i12 * f0, i13 * f1, i14 * f0,
//
//  o3 = 
//  i5 * f0,  i6 * f1,  i7 * f0,
//  i9 * f1,  i10 * f4, i11 * f1,
//  i13 * f0, i14 * f1, i15 * f0,

#include <string.h>

#ifdef SLP
// Store to temporary global as a hack to trigger the SLP vectorizer.
float temp[4];
#endif

void gaussian_4x(float** in, float** __restrict__ out) {
  float f0 = 1.0f/16.0f;
  float f1 = 2.0f/16.0f;
  float f2 = 4.0f/16.0f;

  float i0 = in[0][0];
  float i1 = in[0][1];
  float i2 = in[0][2];
  float i3 = in[0][3];

  float i4 = in[1][0];
  float i5 = in[1][1];
  float i6 = in[1][2];
  float i7 = in[1][3];

  float i8 = in[2][0];
  float i9 = in[2][1];
  float i10 = in[2][2];
  float i11 = in[2][3];

  float i12 = in[3][0];
  float i13 = in[3][1];
  float i14 = in[3][2];
  float i15 = in[3][3];

#ifndef SLP
  float temp[4];
#endif
  temp[0] = 
    i0 * f0 + i1 * f1 + i2 * f0 +
    i4 * f1 + i5 * f2 + i6 * f1 +
    i8 * f0 + i9 * f1 + i10 * f0;
  temp[1] =
    i1 * f0 + i2 * f1  + i3 * f0 +
    i5 * f1 + i6 * f2  + i7 * f1 +
    i9 * f0 + i10 * f1 + i11 * f0;
  temp[2] =
    i4 * f0 + i5 * f1 + i6 * f0 +
    i8 * f1 + i9 * f2 + i10 * f1 +
    i12 * f0 + i13 * f1 + i14 * f0;
  temp[3] =
    i5 * f0 + i6 * f1 + i7 * f0 +
    i9 * f1 + i10 * f2 + i11 * f1 +
    i13 * f0 + i14 * f1 + i15 * f0;

  memcpy(out[0], &temp[0], sizeof(double));
  memcpy(out[1], &temp[2], sizeof(double));

  // i5 * f0 = i5f0
  // i5 * f1 = i5f1
  // i6 * f0 = i6f0
  // i6 * f1 = i6f1
  // i9 * f1 = i9f1
  // i10 * f1 = i10f1

  //temp[0] = 
  //  i0*f0 + i1*f1 + i2*f0 +
  //  i4*f1 + i5*f2 + i6f1 +
  //  i8*f0 + i9f1 + i10*f0;
  //temp[1] =
  //  i1*f0 + i2*f1  + i3*f0 +
  //  i5f1 + i6*f2  + i7*f1 +
  //  i9*f0 + i10f1 + i11*f0;
  //temp[2] =
  //  i4*f0 + i5f1 + i6f0 +
  //  i8*f1 + i9*f2 + i10f1 +
  //  i12*f0 + i13*f1 + i14*f0;
  //temp[3] =
  //  i5*f0 + i6f1 + i7*f0 +
  //  i9f1 + i10*f2 + i11*f1 +
  //  i13*f0 + i14*f1 + i15*f0;
}
