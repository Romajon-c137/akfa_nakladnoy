import { z } from 'zod';

export const InvoiceStatusSchema = z.enum(['draft', 'sent', 'paid', 'deleted']);

export const InvoiceItemSchema = z.object({
  id:  z.string().trim().min(1).max(20),
  sku: z.string().trim().min(1).max(80),
  qty: z.number().int().min(1).max(9999),
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD');
const isoDateTime = z.string().datetime({ offset: true }).or(z.string().datetime());

export const InvoiceSchema = z.object({
  id:         z.string().trim().min(1).max(50),
  number:     z.string().trim().min(1).max(10),
  date:       isoDate,
  fromPerson: z.string().trim().max(100).optional().default(''),
  vehicle:    z.string().trim().max(30).optional().default(''),
  driver:     z.string().trim().max(60).optional().default(''),
  items:      z.array(InvoiceItemSchema).max(100),
  status:     InvoiceStatusSchema.default('draft'),
  createdAt:  isoDateTime,
  updatedAt:  isoDateTime,
});

export const InvoicePatchSchema = z.object({
  fromPerson: z.string().trim().max(100).optional(),
  vehicle:    z.string().trim().max(30).optional(),
  driver:     z.string().trim().max(60).optional(),
  status:     InvoiceStatusSchema.optional(),
  items:      z.array(InvoiceItemSchema).max(100).optional(),
});

export const InvoiceIdSchema = z.string().trim().min(1).max(50);

export const PinSchema = z.string().min(1).max(30);

export type ParsedInvoice = z.infer<typeof InvoiceSchema>;
export type ParsedInvoicePatch = z.infer<typeof InvoicePatchSchema>;
