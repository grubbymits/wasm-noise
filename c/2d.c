#include "util.h"

// https://blog.pkh.me/p/42-sharing-everything-i-could-understand-about-gradient-noise.html
// https://iquilezles.org/articles/fbm/

static uint32_t hash_2d(uint32_t x, uint32_t y) {
  return hash(x ^ hash(y));
}

static struct Vec2D grad(uint32_t x, uint32_t y) {
  uint32_t h1 = hash_2d(x, y);
  uint32_t h2 = hash(h1);
  struct Vec2D v = { h1, h2 };
  struct Vec2D norm = normalise(v);
  return normalise(sub_2d_scalar(mul_2d_scalar(norm, 2.0f), 1.0f));;
}

static float lerp(float f0, float f1, float t) {
  return (1.0f - t) * f0 + t * f1;
}

// bilinear interpolation
static float bilerp(float f0, float f1, float f2, float f3, float x, float y) {
  return lerp(lerp(f0, f1, x), lerp(f2, f3, x), y);
}

static float fade_hermite(float t) { return (3.0-2.0*t)*t*t; }

static float fade_quintic(float t) { return ((6.0*t-15.0)*t+10.0)*t*t*t; }

static float fade(float t) { return t; }

double noise2d(double fx, double fy) {
  uint32_t ix = fx;
  uint32_t iy = fy;
  struct Vec2D ga = grad(ix, iy);
  struct Vec2D gb = grad(ix + 1, iy);
  struct Vec2D gc = grad(ix, iy + 1);
  struct Vec2D gd = grad(ix + 1, iy + 1);

  struct Vec2D a0 = { 1.0f, 0.0f };
  struct Vec2D a1 = { 0.0f, 1.0f };
  struct Vec2D a2 = { 1.0f, 1.0f };

  struct Vec2D f = { fraction(fx), fraction(fy) };
  float va = dot(ga, f);
  float vb = dot(gb, sub_2d(f, a0));
  float vc = dot(gc, sub_2d(f, a1));
  float vd = dot(gd, sub_2d(f, a2));

  struct Vec2D u = { fade(f.x), fade(f.y) };
  float v = bilerp(va, vb, vc, vd, u.x, u.y);
  return v;
}
