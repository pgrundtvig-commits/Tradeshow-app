import type { VisitorReport } from "./types";
const KEY = "palsgaard-reports";
export function saveReport(r: VisitorReport) {
  const list = listReports().filter((x) => x.id !== r.id);
  list.unshift(r);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)));
}
export function listReports(): VisitorReport[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as VisitorReport[];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}
