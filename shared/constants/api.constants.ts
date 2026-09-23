console.log('=== Go BAGAGE API CONFIG ===');
console.log('process.env.EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL )
console.log('typeof', typeof process.env.EXPO_PUBLIC_API_URL)


export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.86.1:8080/api/v1';

console.log('API_BASE_URL final', API_BASE_URL);
console.log('===============================')

export const API_TIMEOUT = 15_000; // 15s

export const Endpoints = {
  AUTH_REGISTER:        '/auth/register',
  AUTH_LOGIN:           '/auth/login',
  AUTH_OTP_SEND:        '/auth/otp/send',
  AUTH_OTP_VERIFY:      '/auth/otp/verify',
  AUTH_TOKEN_REFRESH:   '/auth/token/refresh',
  AUTH_LOGOUT:          '/auth/logout',
  AUTH_PASSWORD_FORGOT: '/auth/password/forgot',
  AUTH_PASSWORD_RESET:  '/auth/password/reset',

  USERS_ME:             '/users/me',
  USERS_ME_AVATAR:      '/users/me/avatar',
  USERS_ME_KYC:         '/users/me/kyc',
  USERS_PUBLIC:         (id: string) => `/users/${id}/public`,

  CORRIDORS:            '/corridors',
  CORRIDOR_INFO:        (id: string) => `/corridors/${id}/info`,

  TRIPS:                '/trips',
  TRIPS_MINE:           '/trips/mine',
  TRIP_BY_ID:           (id: string) => `/trips/${id}`,

  PARCELS:              '/parcels',
  PARCEL_BY_ID:         (id: string) => `/parcels/${id}`,
  PARCEL_PHOTOS:        (id: string) => `/parcels/${id}/photos`,

  BOOKINGS:             '/bookings',
  BOOKING_ACCEPT:       (id: string) => `/bookings/${id}/accept`,
  BOOKING_REJECT:       (id: string) => `/bookings/${id}/reject`,
  BOOKING_PICKED_UP:    (id: string) => `/bookings/${id}/picked-up`,
  BOOKING_DELIVERED:    (id: string) => `/bookings/${id}/delivered`,
  BOOKING_CONFIRM:      (id: string) => `/bookings/${id}/confirm`,
  BOOKING_CANCEL:       (id: string) => `/bookings/${id}/cancel`,

  PAYMENTS_INITIATE:    '/payments/initiate',
  PAYMENTS_HISTORY:     '/payments/history',

  CONVERSATIONS:        '/conversations',
  MESSAGES:             (convId: string) => `/conversations/${convId}/messages`,

  REVIEWS:              '/reviews',
  REVIEWS_USER:         (userId: string) => `/reviews/user/${userId}`,

  REPORTS:              '/reports',

  ADMIN_KYC_QUEUE:      '/admin/kyc-queue',
  ADMIN_KYC_VALIDATE:   (id: string) => `/admin/kyc/${id}`,
  ADMIN_CORRIDORS:      '/admin/corridors',
  ADMIN_STATS:          '/admin/stats',

  NOTIFICATIONS:        '/notifications',
  NOTIFICATIONS_UNREAD: '/notifications/unread-count',
  NOTIFICATION_READ:    (id: string | number) => `/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: '/notifications/read-all',
} as const;
