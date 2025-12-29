function check_num(n) {
  return !isNaN(n) &&
         Number.NEGATIVE_INFINITY != n &&
         Number.POSITIVE_INFINITY != n;
}

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

class Colours {
  constructor() {
    this.samples = new Array();
    this.light_green = new RGB(194, 175, 110);
    this.dark_blue = new RGB(102, 112, 103);
    this.light_blue = new RGB(146, 176, 179);
    this.dark_olive = new RGB(133, 118, 88);
    this.light_olive = new RGB(168, 157, 117);
    this.green_brown = new RGB(122, 99, 50);
    this.light_brown = new RGB(169, 140, 94);
    this.reddish_brown = new RGB(160, 121, 87);
    this.green = new RGB(177, 157, 88);
    this.taupe = new RGB(206, 191, 159);
    this.sand = new RGB(237, 221, 175);
    this.white = new RGB(243, 238, 218);
  }

  add_sample(n) {
    this.samples.push(n);
  }

  get_percent_value(pc) {
    const count = this.samples.length;
    const index = Math.floor(count * pc);
    return this.samples[index];
  };

  choose(n) {
    const water = 0.15;
    const sand = 0.20;
    const trees = 0.60;
    const grass = 0.70;
    const rock = 0.80;
    const snow = 0.95;
  
    if (n < this.get_percent_value(water)) {
      return this.light_blue;
    } else if (n < this.get_percent_value(sand)) {
      return this.sand;
    } else if (n < this.get_percent_value(trees)) {
      return this.green;
    } else if (n < this.get_percent_value(rock)) {
      return this.light_green;
    } else if (n < this.get_percent_value(snow)) {
      return this.taupe;
    } else {
      return this.white;
    }
  }

  finish() {
    // stackoverflow.com/questions/36266895/simple-histogram-algorithm-in-javascript
    const histogram = function(data, bin_size, min, max) {
      const bins = Math.ceil((max - min + 1) / bin_size);
      const histogram = new Array(bins).fill(0);

      for (const item of data) {
        histogram[Math.floor((item - min) / bin_size)]++;
      }

      return histogram;
    }

    this.samples.sort(function(a, b) { return a - b; });
    const min = this.samples[0];
    const max = this.samples[this.samples.length - 1];
    const count = this.samples.length;
    console.log('min:', min);
    console.log('max:', max);
    console.log(JSON.stringify(histogram(this.samples, 0.1, min, max)));
  }
}

function fbm(x, y, offset_x, offset_y, freq, G, octaves) {
  console.assert(freq);
  console.assert(octaves);
  console.assert(x + offset_x >= 1);
  console.assert(y + offset_y >= 1);

  let a = 1.0;
  let t = 0.0;
  let total_square_a = 0.0;
  const lac = Math.pow(Math.LOG2E, 2);
  for (let i = 0; i < octaves; i++) {
    const px = freq * x + offset_x;
    const py = freq * y + offset_y;
    const n = noise2d(px, py);
    if (!check_num(n)) {
      console.log('n:', n);
      console.log('octave:', i);
      console.log('px:', px);
      console.log('py:', py);
      throw new Error('noise NaN!');
    }
    t += a * n;
    freq *= lac;
    total_square_a += Math.pow(a, 2);
    a *= G;
  }
  console.assert(total_square_a);
  return t /= Math.sqrt(total_square_a);
}

function fbm_multi(x, y, offset_x, offset_y, freq, G, octaves) {

  let a = 1.0;
  let t = 0.0;
  let total_square_a = 0.0;
  const lac = Math.pow(Math.LOG2E, 2);
  for (let i = 0; i < octaves; i++) {
    const px = freq * x + offset_x;
    const py = freq * y + offset_y;
    let n = noise2d(px, py);
    if (i > 1) {
      const factor = Math.min(1.0, Math.max(n, 0.0));
      n *= factor;
    }
    t += a * n;
    freq *= lac;
    total_square_a += Math.pow(a, 2);
    a *= G;
  }
  console.assert(total_square_a);
  return t /= Math.sqrt(total_square_a);
}

function ridged(x, y, offset_x, offset_y, freq, G, octaves) {
  let a = 1.0;
  let t = 0.0;
  const lac = Math.pow(Math.LOG2E, 2);
  for (let i = 0; i < octaves; i++) {
    t += 1 - a * Math.abs(noise2d(freq * x + offset_x, freq * y + offset_y));
    freq *= lac;
    a *= G;
  }
  return t;
}

function turbulence(x, y, offset_x, offset_y, freq, G, octaves) {
  let a = 1.0;
  let t = 0.0;
  const lac = Math.pow(Math.LOG2E, 2);
  for (let i = 0; i < octaves; i++) {
    t += a * Math.abs(noise2d(freq * x + offset_x, freq * y + offset_y));
    freq *= lac;
    a *= G;
  }
  return t;
}

function ridged_multi(x, y, offset_x, offset_y, freq, G, octaves) {
  const baseline = 1.0;
  const gain = 2.0;
  let a = 1.0;
  let t = 0.0;
  let weight = 1.0;
  const lac = Math.pow(Math.LOG2E, 2);

  for (let i = 0; i < octaves; i++) {
    let signal = Math.abs(noise2d(freq * x + offset_x, freq * y + offset_y));
    signal = baseline - signal;
    signal *= signal;
    signal *= weight;
    t += signal * a;
    freq *= lac;
    a *= G;

    weight = signal * gain;
    // clamp.
    weight = Math.min(1.0, Math.max(weight, 0.0));
  }
  return t;
}

function domain_warp(x, y, offset_x, offset_y, freq, G, octaves, gen_func) {
  // https://iquilezles.org/articles/warp/
  const nx = fbm(x, y, offset_x, offset_y, freq, G, octaves);
  const ny = fbm(x + 5.2, y + 1.3, offset_x, offset_y, freq, G, octaves);
  return gen_func(x + nx * 4.0, y + ny * 4.0, offset_x, offset_y, freq, G,
                  octaves);
}

self.wasm_instance;
self.noise2d;

self.onmessage = async function(e) {
  const {
    shared_buffer,
    start_y,
    height,
    width,
    scale,
    G,
    num_octaves,
    noise_type,
    fade,
    warp,
    offset_x,
    offset_y,
  } = e.data;

  if (!self.wasm_instance) {
    console.log('instaniate module for first run');
    const obj = await WebAssembly.instantiateStreaming(fetch("../wasm/noise.wasm"), {});
    self.wasm_instance = obj.instance;
  }

  noise2d = (function () {
    switch (fade) {
    default:
      return self.wasm_instance.exports.noise2d;
    case 'hermite':
      return self.wasm_instance.exports.noise2d_hermite;
    case 'quintic':
      return self.wasm_instance.exports.noise2d_quintic;
    }
  })();

  const noise_generator = (function() {
    switch (noise_type) {
    default:
      console.log(noise_type);
      throw new Error('Unsupported fbm type!');
    case 'fbm':
      return fbm;
    case 'fbm-multi':
      return fbm_multi;
    case 'turbulence':
      return turbulence;
    case 'ridged':
      return ridged;
    case 'ridged-multi':
      return ridged_multi;
    }
  })();

  // Calibrate
  const colours = new Colours();
  const num_samples = 10000;
  const inc = 10;
  for (let y = 1; y < num_samples / inc; y += inc) {
    for (let x = 1; x < num_samples / inc; x += inc) {
      const n = warp ?
        domain_warp(x, y, offset_x, offset_y, scale, G,
                    num_octaves, noise_generator)
        : noise_generator(x, y, offset_x, offset_y, scale, G,
                          num_octaves);
      colours.add_sample(n);
    }
  }
  console.assert(colours.samples.length == num_samples);
  colours.finish();

  const channels = 4;
  const clamped_array = new Uint8ClampedArray(shared_buffer);
  for (let y = start_y; y < start_y + height; ++y) {
    for (let x = 0; x < width; ++x) {
      let pixel = (y * width * channels) + x * channels;
      const n = warp ?
        domain_warp(x, y, offset_x, offset_y, scale, G,
                    num_octaves, noise_generator)
        : noise_generator(x, y, offset_x, offset_y, scale, G,
                          num_octaves);
      const colour = colours.choose(n);
      clamped_array[pixel] =  colour.r;
      clamped_array[pixel+1] = colour.g;
      clamped_array[pixel+2] = colour.b;
      clamped_array[pixel+3] = 255;
    }
  }
  postMessage('done');
}
