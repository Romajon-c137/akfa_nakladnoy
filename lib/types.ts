export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'deleted';

export type Department = 'glass' | 'aluminum';

/** Per-department starting number for new invoices */
export const DEPARTMENT_START: Record<Department, number> = {
  glass: 60,
  aluminum: 6,
};

/** Human-readable labels */
export const DEPARTMENT_LABEL: Record<Department, string> = {
  glass: 'Стекло',
  aluminum: 'Алюминь',
};

export type InvoiceItem = {
  id: string;
  sku: string;
  qty: number;
};

export type Invoice = {
  id: string;
  number: string;
  date: string;
  department: Department;
  fromPerson?: string;
  vehicle?: string;
  driver?: string;
  /** SVG path data for "Передал" signature, drawn in 400×150 viewBox */
  signatureFrom?: string;
  /** SVG path data for "Водитель" signature, drawn in 400×150 viewBox */
  signatureDriver?: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
};

/** Logical canvas dimensions for signature SVG paths */
export const SIGNATURE_VIEWBOX = { w: 400, h: 150 } as const;

export type CatalogItem = {
  sku: string;
  price: number;
};
