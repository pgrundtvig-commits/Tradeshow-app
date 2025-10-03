export type ParsedCard = { name?: string; company?: string; title?: string; email?: string; phone?: string; country?: string; };
export function parseVCardOrMeCard(text: string): ParsedCard {
  const t = text.trim();
  if (/^MECARD:/i.test(t)) return parseMeCard(t);
  if (/^BEGIN:VCARD/i.test(t)) return parseVCard(t);
  return {};
}
function parseMeCard(text: string): ParsedCard {
  const out: ParsedCard = {};
  const body = text.replace(/^MECARD:/i, "").replace(/;;$/, "");
  const parts = body.split(";").map((p) => p.trim());
  for (const p of parts) {
    const [k, vRaw] = p.split(":");
    const v = decode(vRaw ?? "");
    switch (k.toUpperCase()) {
      case "N": {
        const [surname, given] = v.split(",");
        out.name = [given, surname].filter(Boolean).join(" ").trim(); break;
      }
      case "TEL": out.phone = v; break;
      case "EMAIL": out.email = v; break;
      case "ORG": out.company = v; break;
      case "ADR": out.country = v.split(",").pop()?.trim(); break;
      case "TITLE": out.title = v; break;
    }
  }
  return out;
}
function parseVCard(text: string): ParsedCard {
  const out: ParsedCard = {};
  const lines = text.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || /^BEGIN|END/i.test(line)) continue;
    const [k, ...rest] = line.split(":");
    const v = decode(rest.join(":"));
    const key = k.split(";")[0].toUpperCase();
    switch (key) {
      case "FN": out.name = v; break;
      case "N": out.name = v.split(";").filter(Boolean).reverse().join(" ").trim(); break;
      case "ORG": out.company = v; break;
      case "TITLE": out.title = v; break;
      case "EMAIL": out.email = v; break;
      case "TEL": out.phone = v.replace(/^[^:]*:/, ""); break;
      case "ADR": out.country = v.split(";").pop()?.trim(); break;
    }
  }
  return out;
}
function decode(s: string) { try { return decodeURIComponent(s); } catch { return s; } }
