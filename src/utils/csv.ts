import { ResaleTransaction } from '../types.ts';

/**
 * Exports resale transactions to a downloadable CSV file.
 */
export function exportTransactionsToCsv(
  transactions: ResaleTransaction[],
  townName: string
): void {
  if (!transactions || transactions.length === 0) {
    return;
  }

  const headers = [
    'Month',
    'Town',
    'Flat Type',
    'Block',
    'Street Name',
    'Storey Range',
    'Floor Area (sqm)',
    'Flat Model',
    'Lease Commence Date',
    'Remaining Lease',
    'Resale Price (SGD)',
  ];

  const escapeCell = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '""';
    }
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = transactions.map((t) => [
    escapeCell(t.month),
    escapeCell(t.town),
    escapeCell(t.flat_type),
    escapeCell(t.block),
    escapeCell(t.street_name),
    escapeCell(t.storey_range),
    escapeCell(t.floor_area_sqm_num),
    escapeCell(t.flat_model),
    escapeCell(t.lease_commence_date),
    escapeCell(t.remaining_lease),
    escapeCell(t.resale_price_num),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\r\n');

  // Prepend UTF-8 BOM so Excel opens accented/special characters correctly
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const safeTown = (townName || 'hdb').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `flatradar_${safeTown}_transactions_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
