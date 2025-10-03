import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { VisitorReport } from "../types";
export function exportJson(report: VisitorReport) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `visitor-report-${report.id}.json`);
}
export async function exportPdf(targetEl: HTMLElement, report: VisitorReport) {
  const canvas = await html2canvas(targetEl, { scale: window.devicePixelRatio || 2, backgroundColor: "#ffffff" });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const w = canvas.width * ratio, h = canvas.height * ratio;
  const x = (pageWidth - w) / 2, y = 24;
  pdf.addImage(imgData, "PNG", x, y, w, h, undefined, "FAST");
  pdf.setFontSize(10);
  pdf.text(`Palsgaard Visitor Report • ${new Date(report.createdAt).toLocaleString()}`, 24, pageHeight - 18);
  pdf.save(`visitor-report-${report.id}.pdf`);
}
function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
