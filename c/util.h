#include "math.h"
#include <stdint.h>

struct Vec2D {
  float x;
  float y;
};

inline float fraction(float p) {
  return p - (int)p;
}

inline float dot(struct Vec2D v0, struct Vec2D v1) {
  float x = v0.x * v1.x;
  float y = v0.y * v1.y;
  return x + y;
}

inline struct Vec2D add_2d(struct Vec2D v0, struct Vec2D v1) {
  struct Vec2D res = { v0.x + v1.x, v0.y + v1.y };
  return res;
}

inline struct Vec2D sub_2d(struct Vec2D v0, struct Vec2D v1) {
  struct Vec2D res = { v0.x - v1.x, v0.y - v1.y };
  return res;
}

inline struct Vec2D sub_2d_scalar(struct Vec2D v, float f) {
  struct Vec2D res = { v.x - f, v.y - f };
  return res;
}

inline struct Vec2D mul_2d_scalar(struct Vec2D v, float f) {
  struct Vec2D res = { v.x * f, v.y * f };
  return res;
}

inline float mag(struct Vec2D v) {
  return sqrt(dot(v, v));
}

inline struct Vec2D normalise(struct Vec2D v) {
  float magDiv = 1.0f / mag(v);
  struct Vec2D res = { v.x * magDiv, v.y * magDiv };
  return res;
}

inline int32_t hash(int32_t h) {
  h = (h ^ (h >> 16)) * 0x21f0aaadU;
  h = (h ^ (h >> 15)) * 0x735a2d97U;
  return h ^ (h >> 15);
}
