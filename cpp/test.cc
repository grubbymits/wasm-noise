#include <cmath>
#include <iostream>
#include <numbers>

// clang++ -O2 test.cc tileable.cc -std=c++2c -o test

typedef double (*NoiseFunc)(double, double);

double noise16x16_none(double fx, double fy);
double noise16x16_hermite(double fx, double fy);
double noise16x16_quintic(double fx, double fy);
double noise32x32_none(double fx, double fy);
double noise32x32_hermite(double fx, double fy);
double noise32x32_quintic(double fx, double fy);
double noise64x64_none(double fx, double fy);
double noise64x64_hermite(double fx, double fy);
double noise64x64_quintic(double fx, double fy);

double fbm(unsigned x, unsigned y, float freq, float G, unsigned octaves,
           NoiseFunc noise_func) {
  float a = 1.0f;
  float t = 0.0f;
  float total_square_a = 0.0f;
  float lac = std::pow(std::numbers::log2e, 2);

  for (unsigned i = 0; i < octaves; i++) {
    float px = freq * x;
    float py = freq * y;
    float n = noise_func(px, py);
    if (n !=n ) {
      std::cout << "FAIL" << std::endl;
      std::cout << "px: " << px << std::endl;
      std::cout << "py: " << py << std::endl;
      return n;
    }
    t += a * n;
    freq *= lac;
    total_square_a += std::pow(a, 2);
    a *= G;
  }
  return t /= std::sqrt(total_square_a);
}

bool test_fbm(NoiseFunc noise, unsigned N, const std::string& name) {
  std::cout << "fBm test: " << name << " x " << N << std::endl;
  const float freq = 0.005;
  const float H = 0.5;
  const float G = pow(2, -H);
  const unsigned octaves = 5;

  for (unsigned y = 1; y < N + 1; ++y) {
    for (unsigned x = 1; x < N + 1; ++x) {
      double result = fbm(x, y, freq, G, octaves, noise);
      if (result != result) {
        return false;
      }
    }
  }
  std::cout << " - Passed" << std::endl;
  return true;
}

bool test_noise(unsigned x, unsigned y, float freq, NoiseFunc noise,
                unsigned N, const std::string& name) {
  std::cout << "Tileable: " << name << " x " << N << std::endl;
  float px = freq * x;
  float py = freq * y;
  double pos_x_y = noise(x, y);
  double pos_n_y = noise(x + N, y);
  double pos_x_n = noise(x, y + N);

  if (pos_x_y != pos_n_y) {
    std::cout << "Fail (x): " << pos_x_y << " != " << pos_n_y << std::endl;
    return false;
  }
  if (pos_x_y != pos_x_n) {
    std::cout << "Fail (y): " << pos_x_y << " != " << pos_x_n << std::endl;
    return false;
  }
  std::cout << " - Passed" << std::endl;
  return true;
}

int main(int argc, char* argv[]) {
  using config = std::tuple<NoiseFunc, std::string, unsigned>;
  auto configs = std::to_array<config>({
      {&noise16x16_none, "none", 16},
      {&noise16x16_hermite, "hermite", 16},
      {&noise16x16_quintic, "quintic", 16},
      {&noise32x32_none, "none", 32},
      {&noise32x32_hermite, "hermite", 32},
      {&noise32x32_quintic, "quintic", 32},
      {&noise64x64_none, "none", 64},
      {&noise64x64_hermite, "hermite", 64},
      {&noise64x64_quintic, "quintic", 64},
  });
  constexpr float freq = 0.005;
  for (const auto &[noise_func, name, N] : configs) {
    if (!test_fbm(noise_func, N, name)) {
      return 0;
    }
    if (!test_noise(1, 1, freq, noise_func, N, name)) {
      return 0;
    }
  }
  return 0;
}
