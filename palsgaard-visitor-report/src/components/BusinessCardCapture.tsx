import React, { useRef, useState } from "react";
import { qrScanFromImage } from "../utils/qr";
import { parseVCardOrMeCard } from "../utils/vcard";
import { runOcr } from "../utils/ocr";
import LiveQrScanner from "./LiveQrScanner";
import { drawImageToCanvas, preprocessForQR } from "../utils/image";
type Props = {
  onExtract: (fields: Partial<{ company: string; contact: string; title: string; email: string; phone: string; country: string; }>, meta: { method: "qr" | "ocr"; raw: string }) => void;
  onStatus: (s: string) => void;
};
export default function BusinessCardCapture({ onExtract, onStatus }: Props) {
  const [busy, setBusy] = useState<"idle" | "scanning" | "ocr">("idle");
  const [liveOpen, setLiveOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  async function handleFile(file: File) {
    setBusy("scanning"); onStatus("Scanning business card…");
    const bitmap = await createImageBitmap(file);
    const { canvas, ctx, width, height } = drawImageToCanvas(bitmap, 1280);
    preprocessForQR(ctx, width, height);
    const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
    const qrRaw = await qrScanFromImage(new File([blob], "preprocessed.png")).catch(() => null);
    if (qrRaw) {
      const parsed = parseVCardOrMeCard(qrRaw);
      onExtract({ company: parsed.company ?? "", contact: parsed.name ?? "", title: parsed.title ?? "", email: parsed.email ?? "", phone: parsed.phone ?? "", country: parsed.country ?? "" }, { method: "qr", raw: qrRaw });
      onStatus("QR detected ✓"); setBusy("idle"); return;
    }
    setBusy("ocr"); onStatus("No QR found. Running OCR…");
    const res = await runOcr(file);
    onExtract({ company: res.fields.company ?? "", contact: res.fields.name ?? "", title: res.fields.title ?? "", email: res.fields.email ?? "", phone: res.fields.phone ?? "", country: res.fields.country ?? "" }, { method: "ocr", raw: res.text });
    onStatus("OCR complete ✓"); setBusy("idle");
  }
  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept="image/*;capture=camera" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <button className="px-3 py-2 border rounded bg-white" onClick={() => inputRef.current?.click()}>
        {busy === "scanning" ? "Scanning…" : busy === "ocr" ? "OCR…" : "Scan/Upload Card"}
      </button>
      <button className="px-3 py-2 border rounded bg-white" onClick={() => setLiveOpen(true)}>Live Scan</button>
      <p className="text-sm text-palsgaard-pine opacity-80 hidden md:block">QR → vCard/MECARD. Fallback OCR (EN/DE/DA/FR/IT).</p>
      <LiveQrScanner open={liveOpen} onClose={() => setLiveOpen(false)} onExtract={onExtract} onStatus={onStatus} />
    </div>
  );
}
