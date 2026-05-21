import { CatalogItem } from './types';

export const CATALOG: CatalogItem[] = [
  { sku: '2920-1295 L-1',  price: 1200 },
  { sku: '2920-1285 L2-3', price: 1150 },
  { sku: '2920-1285 L2-1', price: 1150 },
  { sku: '2920-1285 L2-2', price: 1160 },
  { sku: '2920-1300 L2',   price: 1180 },
  { sku: '2920-1280 L3-3', price: 1150 },
  { sku: '2920-1280 L3-1', price: 1140 },
  { sku: '3030-1255 L1-1', price: 1400 },
  { sku: '3030-1250 L1-3', price: 1380 },
  { sku: '3030-1250 L1-1', price: 1400 },
  { sku: '3030-1250 L2-2', price: 1410 },
  { sku: '3030-1260 L1-2', price: 1390 },
  { sku: '870-1250 L1-3',  price: 620  },
  { sku: '870-1250 L1-1',  price: 610  },
  { sku: '870-1200 L2',    price: 580  },
  { sku: '1000-1400 L1',   price: 1600 },
  { sku: '1200-1500 L2-1', price: 1850 },
  { sku: '1200-1500 L2-2', price: 1870 },
  { sku: '1500-1800 L1',   price: 2400 },
  { sku: '600-900 L1-1',   price: 480  },
];

export function searchCatalog(query: string, limit = 5): CatalogItem[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return CATALOG.filter(item => item.sku.toLowerCase().includes(q)).slice(0, limit);
}
