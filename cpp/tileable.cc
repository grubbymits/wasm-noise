#include <array>
#include <cmath>
#include <numbers>

#ifdef DEBUG
#include <iostream>
#endif // DEBUG

namespace {

template<unsigned N>
struct U {
  float data[N];

  U() : data() {
    for(int i = 0; i < N; i++) {
      data[i] = std::cos(i * 2.0f * std::numbers::pi / N);
    }
  }
  float operator[](int i) const {
#ifdef DEBUG
    if (data[i] != data[i]) {
      std::cout << "U data at " << i << " = " << data[i] << std::endl;
    }
#endif // DEBUG
    return data[i];
  }
};

template<unsigned N>
struct V {
  float data[N];

  V() : data() {
    for(int i = 0; i < N; i++) {
      data[i] = std::sin(i * 2.0f * std::numbers::pi / N);
    }
  }
  float operator[](int i) const {
#ifdef DEBUG
    if (data[i] != data[i]) {
      std::cout << "V data at " << i << " = " << data[i] << std::endl;
    }
#endif // DEBUG
    return data[i];
  }
};

class Vec2D {
 public:
  Vec2D(float u, float v): u_(u), v_(v) {
#ifdef DEBUG
    std::cout << "u: " << u << std::endl;
    std::cout << "v: " << v << std::endl;
#endif // DEBUG
  }

  float dot(Vec2D other) const {
    return u() * other.u() + v() * other.v();
  }

  Vec2D add(Vec2D other) const {
#ifdef DEBUG
    std::cout << "add" << std::endl;
#endif // DEBUG
    return Vec2D(u() + other.u(), v() + other.v());
  }
  Vec2D sub(Vec2D other) const {
#ifdef DEBUG
    std::cout << "sub" << std::endl;
#endif // DEBUG
    return Vec2D(u() - other.u(), v() - other.v());
  }
  Vec2D sub(float f) const {
#ifdef DEBUG
    std::cout << "sub" << std::endl;
#endif // DEBUG
    return Vec2D(u() - f, v() - f);
  }
  Vec2D mul(float f) const {
#ifdef DEBUG
    std::cout << "mul" << std::endl;
#endif // DEBUG
    return Vec2D(u() * f, v() * f);
  }
  float mag() const {
#ifdef DEBUG
    std::cout << "mag" << std::endl;
#endif // DEBUG
    return std::sqrt(dot(*this));
  }
  Vec2D normalise() const {
#ifdef DEBUG
    std::cout << "normalise" << std::endl;
#endif // DEBUG
    return mul(1.0f / mag());
  }

  float u() const { return u_; }
  float v() const { return v_; }

 private:
  float u_;
  float v_;
};

inline float fraction(float p) {
  return p - (int)p;
}

inline int32_t hash(int32_t h) {
  h = (h ^ (h >> 16)) * 0x21f0aaadU;
  h = (h ^ (h >> 15)) * 0x735a2d97U;
  return h ^ (h >> 15);
}

template<unsigned N>
int32_t hash_2d(int32_t x, int32_t y) {
  x %= N;
  y %= N;
  return hash(x ^ hash(y));
}

template<unsigned N>
Vec2D grad(int32_t x, int32_t y) {
  static auto u = U<N>();
  static auto v = V<N>();

  uint32_t h1 = hash_2d<N>(x, y);
  uint32_t h2 = hash(h1);
  Vec2D dirs(u[h1 % N], v[h2 % N]);
  return dirs.normalise().mul(2.0f).sub(1.0f).normalise();
}

float lerp(float f0, float f1, float t) {
  return (1.0f - t) * f0 + t * f1;
}

// bilinear interpolation
float bilerp(float f0, float f1, float f2, float f3, float x, float y) {
  return lerp(lerp(f0, f1, x), lerp(f2, f3, x), y);
}

typedef float (*FadeFunc)(float);

float no_fade(float t) { return t; }

float fade_hermite(float t) { return (3.0f-2.0f*t)*t*t; }

float fade_quintic(float t) { return ((6.0f*t-15.0f)*t+10.0f)*t*t*t; }

template<unsigned N>
double noise_fade(double fx, double fy, FadeFunc fade) {
  int32_t ix = fx;
  int32_t iy = fy;
  Vec2D ga = grad<N>(ix, iy);
  Vec2D gb = grad<N>(ix + 1, iy);
  Vec2D gc = grad<N>(ix, iy + 1);
  Vec2D gd = grad<N>(ix + 1, iy + 1);

  Vec2D a0 = { 1.0f, 0.0f };
  Vec2D a1 = { 0.0f, 1.0f };
  Vec2D a2 = { 1.0f, 1.0f };

  Vec2D f = { fraction(fx), fraction(fy) };
  float va = ga.dot(f);
  float vb = gb.dot(f.sub(a0));
  float vc = gc.dot(f.sub(a1));
  float vd = gd.dot(f.sub(a2));
#ifdef DEBUG
  if (va != va) {
    std::cout << "va: " << va << std::endl;
  }
  if (vb != vb) {
    std::cout << "vb: " << vb << std::endl;
  }
  if (vc != vc) {
    std::cout << "vc: " << vc << std::endl;
  }
  if (vd != vd) {
    std::cout << "vd: " << vd << std::endl;
  }
#endif // DEBUG

  Vec2D faded(fade(f.u()), fade(f.v()));
  return bilerp(va, vb, vc, vd, faded.u(), faded.v());
}

} // end namespace

__attribute__((export_name("noise8x8")))
double noise8x8_none(double fx, double fy) {
  return noise_fade<8>(fx, fy, &no_fade);
}

__attribute__((export_name("noise16x16")))
double noise16x16_none(double fx, double fy) {
  return noise_fade<16>(fx, fy, &no_fade);
}

__attribute__((export_name("noise32x32")))
double noise32x32_none(double fx, double fy) {
  return noise_fade<32>(fx, fy, &no_fade);
}

__attribute__((export_name("noise64x64")))
double noise64x64_none(double fx, double fy) {
  return noise_fade<64>(fx, fy, &no_fade);
}

__attribute__((export_name("noise8x8_hermite")))
double noise8x8_hermite(double fx, double fy) {
  return noise_fade<8>(fx, fy, &fade_hermite);
}

__attribute__((export_name("noise16x16_hermite")))
double noise16x16_hermite(double fx, double fy) {
  return noise_fade<16>(fx, fy, &fade_hermite);
}

__attribute__((export_name("noise32x32_hermite")))
double noise32x32_hermite(double fx, double fy) {
  return noise_fade<32>(fx, fy, &fade_hermite);
}

__attribute__((export_name("noise64x64_hermite")))
double noise64x64_hermite(double fx, double fy) {
  return noise_fade<64>(fx, fy, &fade_hermite);
}

__attribute__((export_name("noise8x8_quintic")))
double noise8x8_quintic(double fx, double fy) {
  return noise_fade<8>(fx, fy, &fade_quintic);
}

__attribute__((export_name("noise16x16_quintic")))
double noise16x16_quintic(double fx, double fy) {
  return noise_fade<16>(fx, fy, &fade_quintic);
}

__attribute__((export_name("noise32x32_quintic")))
double noise32x32_quintic(double fx, double fy) {
  return noise_fade<32>(fx, fy, &fade_quintic);
}

__attribute__((export_name("noise64x64_quintic")))
double noise64x64_quintic(double fx, double fy) {
  return noise_fade<64>(fx, fy, &fade_quintic);
}
