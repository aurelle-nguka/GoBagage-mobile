export const FontSize = {
  xs:   11,
  sm:   12,
  base: 14,
  md:   15,
  lg:   16,
  xl:   18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
} as const;

export const FontWeight = {
  normal:   '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
};

export const LineHeight = {
  tight:  1.25,
  normal: 1.5,
  loose:  1.75,
} as const;
