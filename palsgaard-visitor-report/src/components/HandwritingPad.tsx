import React, { useEffect, useRef, useState } from "react";
type Props = { value?: string; onChange: (dataUrl: string | undefined) => void; };
export default function HandwritingPad({ value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [stack, setStack] = useState<ImageData[]>([]);
  useEffect(() => {
    const canvas = canvasRef.current!; const dpr = window.devicePixelRatio || 2; const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d")!; ctx.scale(dpr, dpr);
    ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#1e2a2f"; ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);
  function getPos(e: PointerEvent, el: HTMLCanvasElement) { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!; c.setPointerCapture(e.pointerId); const ctx = c.getContext("2d")!;
    setStack((prev) => [...prev, ctx.getImageData(0, 0, c.width, c.height)]); setDrawing(true);
    const p = getPos(e.nativeEvent, c); ctx.beginPath(); ctx.moveTo(p.x, p.y);
  }
  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing) return; const c = canvasRef.current!; const ctx = c.getContext("2d")!;
    const p = getPos(e.nativeEvent, c); ctx.lineTo(p.x, p.y); ctx.stroke();
  }
  function onPointerUp() { setDrawing(false); const c = canvasRef.current!; onChange(c.toDataURL("image/png")); }
  function handleClear() { const c = canvasRef.current!; const ctx = c.getContext("2d")!; ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, c.width, c.height); onChange(undefined); setStack([]); }
  function handleUndo() { const c = canvasRef.current!; const ctx = c.getContext("2d")!;
    setStack((prev) => { const last = prev.pop(); if (last) ctx.putImageData(last, 0, 0); onChange(c.toDataURL("image/png")); return [...prev]; });
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded bg-white" onClick={handleUndo}>Undo</button>
        <button className="px-3 py-2 border rounded bg-white" onClick={handleClear}>Clear</button>
      </div>
      <div className="border rounded bg-white">
        <canvas ref={canvasRef} className="w-full h-64 touch-none" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      </div>
    </div>
  );
}
