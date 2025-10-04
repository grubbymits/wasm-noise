class RGB {
  constructor(r, g, b) {
    this._r = r;
    this._g = g;
    this._b = b;
    Object.freeze(this);
  }
  get r() { return this._r; }
  get g() { return this._g; }
  get b() { return this._b; }
}

const light_green = new RGB(194, 175, 110);
const dark_blue = new RGB(102, 112, 103);
const light_blue = new RGB(146, 176, 179);
const dark_olive = new RGB(133, 118, 88);
const light_olive = new RGB(168, 157, 117);
const green_brown = new RGB(122, 99, 50);
const light_brown = new RGB(169, 140, 94);
const reddish_brown = new RGB(160, 121, 87);
const green = new RGB(177, 157, 88);
const taupe = new RGB(206, 191, 159);
const sand = new RGB(237, 221, 175);
const white = new RGB(243, 238, 218);

function get_colour(n) {
  if (n < -0.2) {
    return light_blue;
  } else if (n < -0.15) {
    return sand;
  } else if (n < 0.1) {
    return light_green;
  } else if (n < 0.35) {
    return green;
  } else if (n < 0.5) {
    return taupe;
  } else {
    return white;
  }
}

function fbm(x, y, freq, G, octaves, noise2d) {
  const offset_x = 1;
  const offset_y = 1;
  let a = 1.0;
  let t = 0.0;
  for (let i = 0; i < octaves; i++) {
    t += a * noise2d(freq * x + offset_x, freq * y + offset_y);
    freq *= 1.98;
    a *= G;
  }
  return t;
}

self.onmessage = function(e) {
  const { shared_buffer, start_y, height, width, scale, G, num_octaves } = e.data;
  const channels = 4;
  const clamped_array = new Uint8ClampedArray(shared_buffer);
  WebAssembly.instantiateStreaming(fetch("../wasm/noise.wasm"), {}).then(
    (obj) => {
    const noise = obj.instance.exports.noise2d;
    for (let y = start_y; y < start_y + height; ++y) {
      for (let x = 0; x < width; ++x) {
        let pixel = (y * width * channels) + x * channels;
        let n = fbm(x, y, scale, G, num_octaves, noise);
        const colour = get_colour(n);
        clamped_array[pixel] =  colour.r;
        clamped_array[pixel+1] = colour.g;
        clamped_array[pixel+2] = colour.b;
        clamped_array[pixel+3] = 255;
      }
    }
    postMessage('done');
  });
}
