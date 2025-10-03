import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { parseVCardOrMeCard } from "../utils/vcard";
import { drawImageToCanvas, preprocessForQR } from "../utils/image";
type Props = {
  open: boolean;
  onClose: () => void;
  onExtract: (fields: Partial<{ company: string; contact: string; title: string; email: string; phone: string; country: string; }>, meta: { method: "qr"; raw: string }) => void;
  onStatus: (s: string) => void;
};
export default function LiveQrScanner({ open, onClose, onExtract, onStatus }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const [err, setErr] = useState<string>("");
  useEffect(() => {
    if (!open) return;
    if (location.protocol !== "https:") { setErr("Camera requires HTTPS. Please use a secure origin."); return; }
    let stream: MediaStream;
    const start = async () => {
      try {
        onStatus("Requesting camera…");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false
        });
        const v = videoRef.current!; v.srcObject = stream; await v.play(); onStatus("Scanning…"); loop();
      } catch (e: any) { setErr(e?.message || "Failed to access camera."); }
    };
    const loop = () => {
      const v = videoRef.current;
      if (!v || v.readyState < 2) { rafRef.current = requestAnimationFrame(loop); return; }
      const { ctx, width, height } = drawImageToCanvas(v, 960);
      preprocessForQR(ctx, width, height);
      const image = ctx.getImageData(0, 0, width, height);
      const hit = jsQR(image.data, image.width, image.height, { inversionAttempts: "attemptBoth" as any });
      if (hit?.data) {
        const parsed = parseVCardOrMeCard(hit.data); cleanup();
        onExtract({
          company: parsed.company ?? "", contact: parsed.name ?? "", title: parsed.title ?? "",
          email: parsed.email ?? "", phone: parsed.phone ?? "", country: parsed.country ?? ""
        }, { method: "qr", raw: hit.data });
        onStatus("QR detected ✓"); onClose(); return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    const cleanup = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
    start(); return cleanup;
  }, [open, onClose, onExtract, onStatus]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-md w-[min(92vw,840px)] p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Live QR Scan</div>
          <button className="px-2 py-1 border rounded bg-white" onClick={onClose}>Close</button>
        </div>
        {err ? (
          <div className="text-red-700 text-sm">{err}</div>
        ) : (
          <div className="relative">
            <video ref={videoRef} playsInline muted className="w-full rounded bg-black" />
            <div className="absolute inset-0 pointer-events-none border-2 border-white/60 rounded" />
          </div>
        )}
        <p className="text-xs opacity-70 mt-2">Tip: hold steady, fill the frame, good light. Uses back camera when available.</p>
      </div>
    </div>
  );
}
