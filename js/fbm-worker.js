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

  choose_colour(n) {
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

function fbm(x, y, offset_x, offset_y, freq, G, octaves, noise2d) {
  let a = 1.0;
  let t = 0.0;
  let total_square_a = 0.0;
  const lac = Math.pow(Math.LOG2E, 2);
  for (let i = 0; i < octaves; i++) {
    t += a * noise2d(freq * x + offset_x, freq * y + offset_y);
    freq *= lac;
    total_square_a += Math.pow(a, 2);
    a *= G;
  }
  return t /= Math.sqrt(total_square_a);
}

function ridged_multi_fbm(x, y, offset_x, offset_y, freq, G, octaves,
                          baseline, gain, noise2d) {
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

  const baseline = 1.0;
  const gain = 2.0;

  // Calibrate
  const colours = new Colours();
  const num_samples = 10000;
  const inc = 10;
  for (let y = 1; y < num_samples / inc; y += inc) {
    for (let x = 1; x < num_samples / inc; x += inc) {
      const n  = (function () {
        switch (fbm_type) {
        default:
          return fbm(x, y, offset_x, offset_y, scale, G, 1, noise);
        case 'ridged':
          return ridged_multi_fbm(x, y, offset_x, offset_y, scale, G,
                                  num_octaves, baseline, gain, noise);
        }
      })();
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
      const n = (function () {
        switch (fbm_type) {
        default:
          return fbm(x, y, offset_x, offset_y, scale, G, num_octaves, noise);
        case 'ridged':
          return ridged_multi_fbm(x, y, offset_x, offset_y, scale, G,
                                  num_octaves, baseline, gain, noise);
        }
      })();
      const colour = colours.choose(n);
      clamped_array[pixel] =  colour.r;
      clamped_array[pixel+1] = colour.g;
      clamped_array[pixel+2] = colour.b;
      clamped_array[pixel+3] = 255;
    }
  }
  postMessage('done');
}
