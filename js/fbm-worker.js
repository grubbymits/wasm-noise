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

class Counters {
  constructor() {
    this.min = Infinity;
    this.max = -Infinity;
    this.data = new Array();
    this.sample_freq = 37;
    this.sample_counter = 0;
  }

  add_sample(n) {
    if (n < this.min) {
      this.min = n;
    }
    if (n > this.max) {
      this.max = n;
    }
    if (this.sample_counter >= this.sample_freq) {
      this.data.push(n);
      this.sample_counter = 0;
    } else {
      this.sample_counter++;
    }
  }

  finish() {
    console.log('min:', this.min);
    console.log('max:', this.max);
    console.log(JSON.stringify(histogram(this.data, 0.2, this.min, this.max)));
  }
}

let counters = new Counters();

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
    return green;
  } else if (n < 0.35) {
    return light_green;
  } else if (n < 0.5) {
    return taupe;
  } else {
    return white;
  }
}

function fbm(x, y, offset_x, offset_y, freq, G, octaves, noise2d) {
  let a = 1.0;
  let t = 0.0;
  for (let i = 0; i < octaves; i++) {
    t += a * noise2d(freq * x + offset_x, freq * y + offset_y);
    freq *= 1.98;
    a *= G;
  }
  counters.add_sample(t);
  return get_colour(t);
}

function get_ridged_colour(n) {
  // 0 - 4 ?

  if (n < 2.1) {
    return light_blue;
  } else if (n < 2.5) {
    return sand;
  } else if (n < 2.8) {
    return green;
  } else if (n < 3.0) {
    return light_green;
  } else if (n < 3.3) {
    return taupe;
  } else {
    return white;
  }
}

function ridged_multi_fbm(x, y, offset_x, offset_y, freq, G, octaves,
                          baseline, gain, noise2d) {
  let a = 1.0;
  let t = 0.0;
  let weight = 1.0;

  for (let i = 0; i < octaves; i++) {
    let signal = Math.abs(noise2d(freq * x + offset_x, freq * y + offset_y));
    signal = baseline - signal;
    signal *= signal;
    signal *= weight;
    t += signal * a;
    freq *= 1.98;
    a *= G;

    weight = signal * gain;
    // clamp.
    weight = Math.min(1.0, Math.max(weight, 0.0));
  }
  counters.add_sample(t);
  return get_ridged_colour(t);
}

// https://stackoverflow.com/questions/36266895/simple-histogram-algorithm-in-javascript
function histogram(data, bin_size, min, max) {

  const bins = Math.ceil((max - min + 1) / bin_size);
  const histogram = new Array(bins).fill(0);

  for (const item of data) {
    histogram[Math.floor((item - min) / bin_size)]++;
  }

  return histogram;
}

self.wasm_instance;
self.onmessage = async function(e) {
  const {
    shared_buffer,
    start_y,
    height,
    width,
    scale,
    G,
    num_octaves,
    fbm_type,
    fade,
    offset_x,
    offset_y,
  } = e.data;

  if (!self.wasm_instance) {
    console.log('instaniate module for first run');
    const obj = await WebAssembly.instantiateStreaming(fetch("../wasm/noise.wasm"), {});
    self.wasm_instance = obj.instance;
  }

  const noise = (function () {
    switch (fade) {
    default:
      return self.wasm_instance.exports.noise2d;
    case 'hermite':
      return self.wasm_instance.exports.noise2d_hermite;
    case 'quintic':
      return self.wasm_instance.exports.noise2d_quintic;
    }
  })();

  const channels = 4;
  const clamped_array = new Uint8ClampedArray(shared_buffer);
  const baseline = 1.0;
  const gain = 2.0;

  counters = new Counters(); 

  for (let y = start_y; y < start_y + height; ++y) {
    for (let x = 0; x < width; ++x) {
      let pixel = (y * width * channels) + x * channels;
      const colour  = (function () {
        switch (fbm_type) {
        default:
          return fbm(x, y, offset_x, offset_y, scale, G, num_octaves, noise);
        case 'ridged':
          return ridged_multi_fbm(x, y, offset_x, offset_y, scale, G,
                                    num_octaves, baseline, gain, noise);
        }
      })();
      clamped_array[pixel] =  colour.r;
      clamped_array[pixel+1] = colour.g;
      clamped_array[pixel+2] = colour.b;
      clamped_array[pixel+3] = 255;
    }
  }
  counters.finish();
  postMessage('done');
}
