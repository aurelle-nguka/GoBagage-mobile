export const formatCAD = (amount: number = 0): string => {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(safeAmount);
};

export const formatCurrency = (amount: number = 0, currency = 'CAD'): string => {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(safeAmount);
};

export const calculateCommission = (
  amount: number = 0,
  rate = 0.12,
): { subtotal: number; commission: number; total: number } => {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return {
    subtotal: safeAmount,
    commission: Math.round(safeAmount * rate * 100) / 100,
    total: Math.round(safeAmount * (1 + rate) * 100) / 100,
  };
};
