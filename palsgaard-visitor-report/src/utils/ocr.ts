import Tesseract from "tesseract.js";
import type { ParsedCard } from "./vcard";
import { drawImageToCanvas, preprocessForOCR } from "./image";
export async function runOcr(file: File, langs = "eng+deu+dan+fra+ita"): Promise<{ text: string; fields: Partial<ParsedCard> }> {
  const bitmap = await createImageBitmap(file);
  const { ctx, width, height } = drawImageToCanvas(bitmap, 1600);
  const dataUrl = preprocessForOCR(ctx, width, height);
  const { data } = await Tesseract.recognize(dataUrl, langs);
  const text = data.text || "";
  const fields = extractFields(text);
  return { text, fields };
}
function extractFields(text: string): Partial<ParsedCard> {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const s = lines.join("\n");
  const email = s.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phone = s.match(/(\+?\d[\d\s().-]{6,}\d)/)?.[0];
  const country = lines.find((l) => isLikelyCountry(l));
  const name = lines[0];
  let company = lines.find((l) => /Ltd|A\/S|Inc|GmbH|SARL|S\.p\.A|PLC|LLC|Co\.|Company/i.test(l));
  if (!company) company = lines[1];
  const title = lines.find((l) => /(Manager|Director|Engineer|Sales|CEO|CTO|CFO|Owner|Partner|Procurement|R&D)/i.test(l));
  return { email, phone, country, name, company, title };
}
function isLikelyCountry(s: string) {
  return /Denmark|Danmark|Germany|Deutschland|France|Italy|United Kingdom|Thailand|USA|United States|Singapore|China|Japan|Korea/i.test(s);
}
