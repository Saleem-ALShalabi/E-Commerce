const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** Prices are stored in cents in the database: formatPrice(1999) -> "$19.99" */
export function formatPrice(cents: number): string {
  return currency.format(cents / 100);
}
