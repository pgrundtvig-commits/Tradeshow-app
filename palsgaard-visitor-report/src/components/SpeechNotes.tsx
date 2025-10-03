import React, { useEffect, useRef, useState } from "react";
type Props = { value: string; onChange: (s: string) => void; onStatus: (s: string) => void; };
export default function SpeechNotes({ value, onChange, onStatus }: Props) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);
  useEffect(() => {
    const w: any = window;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition || w.mozSpeechRecognition || w.msSpeechRecognition;
    if (SR) {
      const rec: any = new SR();
      rec.lang = "en-US"; rec.continuous = true; rec.interimResults = true;
      rec.onstart = () => onStatus("Listening…");
      rec.onend = () => { setListening(false); onStatus("Stopped listening."); };
      rec.onresult = (e: any) => {
        let final = "";
        for (let i = e.resultIndex; i < e.results.length; i++) { const res = e.results[i]; if (res.isFinal) final += res[0].transcript; }
        if (final) onChange((value + " " + final).trim());
      };
      recRef.current = rec;
    } else { onStatus("Speech recognition not available on this device."); }
  }, []);
  const toggle = () => { const rec = recRef.current; if (!rec) return; if (listening) rec.stop(); else { try { rec.start(); setListening(true); } catch {} } };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button className="px-3 py-2 border rounded bg-white" onClick={toggle}>{listening ? "Stop" : "Dictate"}</button>
        <span className="text-sm opacity-80">{listening ? "Listening…" : "Tap to dictate (EN)"}</span>
      </div>
      <textarea className="w-full h-28 p-3 border rounded bg-white" placeholder="Meeting notes (editable)…" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
