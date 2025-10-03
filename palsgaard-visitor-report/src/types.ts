import { z } from "zod";
export const VisitorType = ["Customer","Distributor","Supplier","Prospect","Other"] as const;
export const FollowUpChannel = ["Email","Phone","Teams","In-person"] as const;
export const ReportSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  company: z.string().min(1).optional(),
  contact: z.string().optional(),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  visitorType: z.enum(VisitorType).optional(),
  interests: z.array(z.string()).default([]),
  followUp: z.object({ channel: z.enum(FollowUpChannel).optional(), timeline: z.string().optional(), responsible: z.string().optional() }).optional(),
  notes: z.string().optional(),
  handwritingPng: z.string().optional(),
  scanMeta: z.object({ method: z.enum(["qr","ocr","manual"]).optional(), raw: z.string().optional() }).optional()
});
export type VisitorReport = z.infer<typeof ReportSchema>;
