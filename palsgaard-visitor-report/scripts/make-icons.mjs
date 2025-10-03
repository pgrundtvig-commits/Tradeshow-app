// Writes placeholder PNG icons so PWA installs; replace later with branded assets.
import { mkdirSync, writeFileSync } from "node:fs";
const tinyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAoMBgQm3Ir4AAAAASUVORK5CYII="; // 1x1 PNG
mkdirSync("public/icons", { recursive: true });
writeFileSync("public/icons/icon-192.png", Buffer.from(tinyPngBase64, "base64"));
writeFileSync("public/icons/icon-512.png", Buffer.from(tinyPngBase64, "base64"));
console.log("Placeholder icons created in public/icons/. Replace with real PNGs when ready.");
