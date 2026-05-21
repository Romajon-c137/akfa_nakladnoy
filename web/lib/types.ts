export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'deleted';

export type InvoiceItem = {
  id: string;
  sku: string;
  qty: number;
};

export type Invoice = {
  id: string;
  number: string;
  date: string;
  fromPerson?: string;
  vehicle?: string;
  driver?: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
};

export type CatalogItem = {
  sku: string;
  price: number;
};
