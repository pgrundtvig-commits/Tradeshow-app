import React from "react";
import { FollowUpChannel, VisitorType } from "../types";
type Props = {
  values: {
    company?: string; contact?: string; title?: string; email?: string; phone?: string; country?: string;
    visitorType?: typeof VisitorType[number];
    interests: string[];
    followUp: { channel?: typeof FollowUpChannel[number]; timeline?: string; responsible?: string; };
  };
  onChange: (patch: Partial<Props["values"]>) => void;
};
const COUNTRIES = ["Denmark","Germany","France","Italy","Thailand","United Kingdom","United States","Other"];
export default function VisitorForm({ values, onChange }: Props) {
  const set = (k: string, v: any) => onChange({ ...values, [k]: v });
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <input className="px-3 py-2 border rounded bg-white" placeholder="Company" value={values.company ?? ""} onChange={(e)=>set("company", e.target.value)} />
      <input className="px-3 py-2 border rounded bg-white" placeholder="Contact name" value={values.contact ?? ""} onChange={(e)=>set("contact", e.target.value)} />
      <input className="px-3 py-2 border rounded bg-white" placeholder="Title" value={values.title ?? ""} onChange={(e)=>set("title", e.target.value)} />
      <input className="px-3 py-2 border rounded bg-white" placeholder="Email" inputMode="email" value={values.email ?? ""} onChange={(e)=>set("email", e.target.value)} />
      <input className="px-3 py-2 border rounded bg-white" placeholder="Phone" inputMode="tel" value={values.phone ?? ""} onChange={(e)=>set("phone", e.target.value)} />
      <select className="px-3 py-2 border rounded bg-white" value={values.country ?? ""} onChange={(e)=>set("country", e.target.value)}>
        <option value="">Country</option>{COUNTRIES.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="px-3 py-2 border rounded bg-white" value={values.visitorType ?? ""} onChange={(e)=>set("visitorType", e.target.value)}>
        <option value="">Visitor type</option>{VisitorType.map(v=> <option key={v} value={v}>{v}</option>)}
      </select>
      <input className="px-3 py-2 border rounded bg-white md:col-span-1" placeholder="Areas of interest (comma-separated)" value={values.interests.join(", ")} onChange={(e)=>set("interests", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} />
      <div className="md:col-span-2 grid md:grid-cols-3 gap-3">
        <select className="px-3 py-2 border rounded bg-white" value={values.followUp.channel ?? ""} onChange={(e)=>set("followUp", { ...values.followUp, channel: e.target.value })}>
          <option value="">Follow-up channel</option>{FollowUpChannel.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="px-3 py-2 border rounded bg-white" placeholder="Timeline (e.g. 2 weeks)" value={values.followUp.timeline ?? ""} onChange={(e)=>set("followUp", { ...values.followUp, timeline: e.target.value })} />
        <input className="px-3 py-2 border rounded bg-white" placeholder="Responsible" value={values.followUp.responsible ?? ""} onChange={(e)=>set("followUp", { ...values.followUp, responsible: e.target.value })} />
      </div>
    </div>
  );
}
