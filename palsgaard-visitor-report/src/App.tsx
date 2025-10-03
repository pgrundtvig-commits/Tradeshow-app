import React, { useMemo, useRef, useState } from "react";
import BusinessCardCapture from "./components/BusinessCardCapture";
import SpeechNotes from "./components/SpeechNotes";
import HandwritingPad from "./components/HandwritingPad";
import VisitorForm from "./components/VisitorForm";
import ExportControls from "./components/ExportControls";
import { ReportSchema, type VisitorReport } from "./types";
import { saveReport, listReports } from "./storage";
function newId() { return Math.random().toString(36).slice(2, 10); }
export default function App() {
  const [status, setStatus] = useState<string>("");
  const [reports, setReports] = useState<VisitorReport[]>(listReports());
  const [draft, setDraft] = useState<VisitorReport>(() => ({ id: newId(), createdAt: Date.now(), interests: [], followUp: {} } as VisitorReport));
  const sheetRef = useRef<HTMLDivElement>(null);
  const brandLogo = useMemo(() =>
    "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='32'><text x='0' y='22' font-family='Georgia,serif' font-size='24' fill='#2d4a4f'>Palsgaard</text></svg>`), []);
  function applyExtract(fields: any, meta: { method: "qr" | "ocr"; raw: string }) {
    setDraft((d) => ({ ...d, ...fields, scanMeta: { method: meta.method, raw: meta.raw } }));
  }
  function setValues(patch: Partial<VisitorReport>) { setDraft((d) => ({ ...d, ...patch })); }
  function save() {
    const safe = ReportSchema.safeParse(draft);
    if (!safe.success) { setStatus("Please complete required fields (at least one contact field)."); return; }
    saveReport(safe.data); setReports(listReports()); setStatus("Saved locally ✓");
  }
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 backdrop-blur bg-palsgaard-sand/80 border-b">
        <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={brandLogo} alt="Palsgaard" className="h-7" />
            <h1 className="font-serif text-xl">Visitor Report</h1>
          </div>
          <div className="flex items-center gap-2">
            <BusinessCardCapture onExtract={applyExtract} onStatus={setStatus} />
            <button className="px-3 py-2 border rounded bg-white" onClick={save}>Save</button>
          </div>
        </div>
      </header>
      <main className="max-w-screen-lg mx-auto px-4 py-6">
        <div ref={sheetRef} className="mx-auto bg-white shadow-sheet rounded-md p-6 border" style={{ width: "var(--sheet-width)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-serif">Trade show visitor report</h2>
              <p className="text-sm text-palsgaard-pine opacity-80">Peace of mind in every meeting.</p>
            </div>
            <img src={brandLogo} className="h-8" />
          </div>
          <section className="space-y-3">
            <VisitorForm values={{
              company: draft.company, contact: draft.contact, title: draft.title, email: draft.email, phone: draft.phone, country: draft.country,
              visitorType: draft.visitorType, interests: draft.interests ?? [], followUp: draft.followUp ?? {}
            }} onChange={(v: any) => setValues(v)} />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice notes</label>
                <SpeechNotes value={draft.notes ?? ""} onChange={(s) => setValues({ notes: s })} onStatus={setStatus} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Handwritten notes</label>
                <HandwritingPad value={draft.handwritingPng} onChange={(png) => setValues({ handwritingPng: png })} />
              </div>
            </div>
            {draft.handwritingPng && (<div className="mt-2"><img src={draft.handwritingPng} alt="Handwriting" className="max-h-40 border rounded" /></div>)}
            <div className="flex items-center justify-between pt-3">
              <ExportControls report={draft} sheetRef={sheetRef} />
              <div className="text-sm text-palsgaard-pine opacity-80">Status: {status || "Ready."}</div>
            </div>
          </section>
        </div>
        <section className="mt-8">
          <h3 className="font-medium mb-2">Recent reports (local)</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {reports.map((r) => (
              <div key={r.id} className="border rounded bg-white p-3">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{r.company || r.contact || "(untitled)"}</div>
                    <div className="text-xs opacity-70">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                  <button className="px-2 py-1 border rounded bg-white" onClick={() => setDraft(r)}>Load</button>
                </div>
                {r.email && <div className="text-sm mt-1">{r.email}</div>}
                {r.phone && <div className="text-sm">{r.phone}</div>}
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="py-10 text-center text-xs opacity-60">© Palsgaard — demo only. Replace fonts/colors per brand book.</footer>
    </div>
  );
}
