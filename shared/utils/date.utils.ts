export const formatDate = (dateStr: string, locale = 'fr-CA'): string =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(dateStr),
  );

export const formatShortDate = (dateStr: string): string =>
  new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'short' }).format(
    new Date(dateStr),
  );

export const isDateInPast = (dateStr: string): boolean =>
  new Date(dateStr) < new Date();
