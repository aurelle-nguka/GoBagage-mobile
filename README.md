# GoBagage Mobile

A modern React Native mobile application for managing parcel delivery and travel cargo services using Expo. Connect travelers with individuals needing to ship parcels across different corridors.

## Features

### User Features

- **Authentication**: Secure login, registration, and OTP verification
- **Onboarding**: Guided user setup and profile configuration
- **Trip Management**: Create, publish, and manage delivery trips
- **Bookings**: Book parcels for shipment with real-time tracking
- **Messaging**: In-app communication between travelers and senders
- **Reviews & Ratings**: Rate and review completed transactions
- **Profile Management**: Manage user account and preferences
- **Payments**: Secure payment processing and transaction history
- **Search & Discovery**: Find available trips and parcels

### Admin Features

- **Dashboard**: Real-time analytics and KPI monitoring
- **Corridor Management**: Manage delivery corridors and routes
- **KYC Queue**: Manage Know Your Customer verification process
- **Revenue Analytics**: Track revenue and performance metrics
- **Trip Management**: Oversee all platform trips

## Tech Stack

- **Framework**: [Expo](https://docs.expo.dev/versions/v56.0.0/) (React Native)
- **Language**: TypeScript
- **Routing**: Expo Router
- **State Management**: Zustand
- **Styling**: Expo theme system
- **API Client**: Custom axios-based client with interceptors
- **Storage**: Secure async storage
- **Notifications**: Push notifications via Expo

## Project Structure

```
GoBagage-mobile/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                  # Tab-based navigation screens
│   ├── (auth)/                  # Authentication flow screens
│   ├── (admin)/                 # Admin dashboard screens
│   ├── (modals)/                # Modal overlays
│   └── _layout.tsx              # Root navigation layout
├── features/                     # Feature modules
│   ├── admin/                   # Admin dashboard feature
│   ├── auth/                    # Authentication feature
│   ├── bookings/                # Booking management
│   ├── corridors/               # Corridor management
│   ├── messaging/               # In-app messaging
│   ├── payments/                # Payment processing
│   ├── parcels/                 # Parcel management
│   ├── profile/                 # User profile
│   ├── reviews/                 # Reviews & ratings
│   └── trips/                   # Trip management
├── shared/                       # Shared resources
│   ├── components/              # Reusable UI components
│   ├── constants/               # App constants and routes
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API clients & services
│   └── utils/                   # Utility functions
├── store/                        # Global state (Zustand)
├── theme/                        # Design system
├── types/                        # TypeScript type definitions
├── app.json                      # Expo configuration
├── babel.config.js              # Babel configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies

```

## Getting Started

### Prerequisites

- Node.js (16.x or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd GoBagage-mobile
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
   Create a `.env` file in the root directory with required API endpoints and configuration:

```
EXPO_PUBLIC_API_BASE_URL=<your-api-url>
```

4. **Start the development server**

```bash
npm start
# or
yarn start
```

5. **Run on device or emulator**

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## Feature Modules

### Authentication (`features/auth/`)

Handles user authentication, registration, password recovery, and KYC verification.

### Trips (`features/trips/`)

Manage available trips, create new trips, and track active deliveries.

### Bookings (`features/bookings/`)

Book parcels on available trips with end-to-end tracking.

### Messaging (`features/messaging/`)

Real-time in-app messaging between travelers and senders.

### Admin Dashboard (`features/admin/`)

Comprehensive admin interface for platform management, analytics, and user verification.

### Payments (`features/payments/`)

Integrated payment processing and transaction management.

## API Integration

The application uses a centralized API client in [`shared/services/api.client.ts`](shared/services/api.client.ts) with:

- Automatic token management
- Request/response interceptors
- Error handling and logging
- API constants defined in [`shared/constants/api.constants.ts`](shared/constants/api.constants.ts)

## State Management

Global state is managed using Zustand stores located in the [`store/`](store/) directory:

- `auth.store.ts` - Authentication state
- `booking.store.ts` - Booking state
- `ui.store.ts` - UI state

## Styling & Theme

The application uses a centralized design system in [`theme/`](theme/):

- Color palette
- Spacing scale
- Typography
- Custom components

## Development Guidelines

### Code Organization

- Keep features self-contained within their modules
- Use custom hooks in `shared/hooks/` for cross-feature logic
- Place reusable components in `shared/components/`

### TypeScript

- All files should be typed
- Define shared types in `types/` directory
- Use feature-specific types within feature modules

### Component Structure

- Functional components with hooks
- Separate containers from presentational components
- Use composition over prop drilling

## Building & Deployment

### Generate Build

```bash
eas build --platform ios
eas build --platform android
```

### Submit to App Stores

```bash
eas submit --platform ios
eas submit --platform android
```

For more information, see [Expo documentation](https://docs.expo.dev/versions/v56.0.0/).

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open an issue in the repository.

---

**Last Updated**: July 2026
