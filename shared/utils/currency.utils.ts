export const formatCAD = (amount: number): string =>
  new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);

export const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);

export const calculateCommission = (
  amount: number,
  rate = 0.12,
): { subtotal: number; commission: number; total: number } => ({
  subtotal: amount,
  commission: Math.round(amount * rate * 100) / 100,
  total: Math.round(amount * (1 + rate) * 100) / 100,
});
