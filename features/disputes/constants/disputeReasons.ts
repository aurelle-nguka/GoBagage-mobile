/**
 * Codes de motif de litige — volontairement courts (colonne DB limitée à 30 caractères).
 * Le détail libre va dans `description`, pas ici.
 */
export const DISPUTE_REASONS = [
  'PARCEL_DAMAGED',
  'PARCEL_LOST',
  'NOT_DELIVERED',
  'WRONG_ITEM',
  'TRAVELER_UNRESPONSIVE',
  'OTHER',
] as const;

export type DisputeReasonCode = (typeof DISPUTE_REASONS)[number];
