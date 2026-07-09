
export const Routes = {
  ONBOARDING:   '/(auth)/onboarding',
  REGISTER:     '/(auth)/register',
  OTP:          '/(auth)/otp',
  KYC:          '/(auth)/kyc',
  KYC_PENDING:  '/(auth)/kyc-pending',

  HOME:         '/(tabs)/',
  PUBLISH:      '/(tabs)/publish',
  SEARCH:       '/(tabs)/search',
  PROFILE:      '/(tabs)/profile',

  DECLARE_PARCEL: '/(modals)/parcel-declare',
  PAYMENT:        '/(modals)/payment',
  TRACKING:       (bookingId: string) => `/(modals)/tracking/${bookingId}` as const,
  CHAT:           (bookingId: string) => `/(modals)/chat/${bookingId}` as const,
  REVIEW:         (bookingId: string) => `/(modals)/review/${bookingId}` as const,

  DASHBOARD: '/(admin)/dashboard',
} as const;
