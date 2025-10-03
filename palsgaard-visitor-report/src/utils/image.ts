export function grayscale(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const y = (r * 0.299 + g * 0.587 + b * 0.114) | 0;
    data[i] = data[i + 1] = data[i + 2] = y;
  }
}
export function autoContrast(data: Uint8ClampedArray) {
  let lo = 255, hi = 0;
  for (let i = 0; i < data.length; i += 4) { const v = data[i]; if (v < lo) lo = v; if (v > hi) hi = v; }
  const range = Math.max(1, hi - lo);
  for (let i = 0; i < data.length; i += 4) {
    const v = ((data[i] - lo) * 255) / range; const n = v | 0;
    data[i] = data[i + 1] = data[i + 2] = n;
  }
}
export function adaptiveThreshold(img: ImageData, tile = 16, bias = 0) {
  const { width, height, data } = img;
  const tilesX = Math.ceil(width / tile), tilesY = Math.ceil(height / tile);
  const means: number[] = new Array(tilesX * tilesY).fill(127);
  for (let ty = 0; ty < tilesY; ty++) for (let tx = 0; tx < tilesX; tx++) {
    let sum = 0, cnt = 0;
    for (let y = ty * tile; y < Math.min((ty + 1) * tile, height); y++)
      for (let x = tx * tile; x < Math.min((tx + 1) * tile, width); x++) {
        const i = (y * width + x) * 4; sum += data[i]; cnt++;
      }
    means[ty * tilesX + tx] = sum / Math.max(1, cnt);
  }
  for (let y = 0; y < height; y++) {
    const ty = Math.floor(y / tile);
    for (let x = 0; x < width; x++) {
      const tx = Math.floor(x / tile); const m = means[ty * tilesX + tx] + bias;
      const i = (y * width + x) * 4; const v = data[i] > m ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = v;
    }
  }
}
export function preprocessForQR(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const img = ctx.getImageData(0, 0, width, height);
  grayscale(img.data); autoContrast(img.data); adaptiveThreshold(img, 12, -6);
  ctx.putImageData(img, 0, 0);
}
export function preprocessForOCR(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const img = ctx.getImageData(0, 0, width, height);
  grayscale(img.data); autoContrast(img.data);
  ctx.putImageData(img, 0, 0);
  return ctx.canvas.toDataURL("image/png");
}
export function drawImageToCanvas(source: CanvasImageSource, maxSide = 1280) {
  const canvas = document.createElement("canvas");
  // @ts-ignore
  const sw = source.videoWidth ?? source.width;
  // @ts-ignore
  const sh = source.videoHeight ?? source.height;
  const scale = Math.min(1, maxSide / Math.max(sw, sh));
  const width = Math.round(sw * scale), height = Math.round(sh * scale);
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d")!; ctx.drawImage(source, 0, 0, width, height);
  return { canvas, ctx, width, height };
}
