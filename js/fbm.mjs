export async function draw_fbm(canvas) {
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const scale = 0.005;
  const H = 1;
  const G = Math.pow(2, -H);
  const num_octaves = 7;

  const workers = [];
  const channels = 4;
  const num_bytes = width * height * channels;
  const shared_buffer = new SharedArrayBuffer(num_bytes);

  const start = performance.now();
  const num_workers = 4;

  const promises = [];
  // Create and start workers
  for (let i = 0; i < num_workers; i++) {
    promises.push(new Promise(function(resolve) {
      const worker = new Worker(new URL("fbm-worker.js", import.meta.url));
      worker.postMessage({
        shared_buffer,
        start_y: i * (height / num_workers),
        height: height / num_workers,
        width,
        scale,
        G,
        num_octaves,
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
    console.log('pixels/msec:', width * height/ end - start);

    // Clean up workers
    workers.forEach(worker => worker.terminate());
  });
}
