import jsQR from "jsqr";
export async function qrScanFromImage(file: File): Promise<string | null> {
  const img = await fileToImage(file);
  const { canvas, ctx } = imageToCanvas(img);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "attemptBoth" as any });
  return result?.data ?? null;
}
function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
function imageToCanvas(image: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1024 / Math.max(image.width, image.height));
  canvas.width = Math.floor(image.width * scale);
  canvas.height = Math.floor(image.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return { canvas, ctx };
}
