import React from "react";
import { exportJson, exportPdf } from "../utils/exporters";
import type { VisitorReport } from "../types";
export default function ExportControls({ report, sheetRef }: { report: VisitorReport; sheetRef: React.RefObject<HTMLDivElement>; }) {
  return (
    <div className="flex gap-3">
      <button className="px-3 py-2 border rounded bg-white" onClick={() => exportJson(report)}>Download JSON</button>
      <button className="px-3 py-2 border rounded bg-white" onClick={() => { if (sheetRef.current) exportPdf(sheetRef.current, report); }}>Save as PDF</button>
    </div>
  );
}
