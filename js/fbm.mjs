export async function draw_fbm(workers, canvas, scale, num_octaves, H, x, y) {
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  console.log('scale:', scale);
  console.log('octaves:', num_octaves);
  console.log('hurst exponent:', H);
  const fade = 'none';
  const fbm_type = 'ridged';
  console.log('fade:', fade);
  console.log('fbm:', fbm_type);
  const G = Math.pow(2, -H);

  const channels = 4;
  const num_bytes = width * height * channels;
  const shared_buffer = new SharedArrayBuffer(num_bytes);
  const offset_x = Math.max(x, 1);
  const offset_y = Math.max(y, 1);
  console.log('x:', offset_x);
  console.log('y:', offset_y);

  const start = performance.now();
  const num_workers = workers.length;

  const promises = [];
  // Create and start workers
  for (let i = 0; i < num_workers; i++) {
    const worker = workers[i];
    promises.push(new Promise(function(resolve) {
      worker.postMessage({
        shared_buffer,
        start_y: i * (height / num_workers),
        height: height / num_workers,
        width,
        scale,
        G,
        num_octaves,
        fbm_type,
        fade,
        offset_x,
        offset_y,
      });
      worker.onmessage = function(event){
        resolve(event.data);
      };
    }));
  }

  // Wait for all workers to complete
  Promise.all(promises).then( () => {
    const clamped_array = new Uint8ClampedArray(shared_buffer);
    const image_data = context.getImageData(0, 0, width, height);
    image_data.data.set(clamped_array);
    context.putImageData(image_data, 0, 0);

    const end = performance.now();
    console.log('time (msec):', end - start);
    console.log('pixels/msec:', width * height / (end - start));

    // Clean up workers
    //workers.forEach(worker => worker.terminate());
  });
}
