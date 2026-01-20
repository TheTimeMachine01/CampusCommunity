# Campus Community App

A modern React Native Expo application for college campus community management with 3D elements, authentication, and beautiful UI/UX.

## Features

- 🎨 **Modern UI/UX** - Beautiful glassmorphism design with smooth animations
- 🎮 **3D Elements** - Three.js integration with animated campus models
- 🔐 **Authentication** - JWT with refresh tokens and OAuth support
- 📱 **Cross-Platform** - Works on iOS, Android, and Web
- 🏛️ **Dashboard** - Latest campus news and updates
- 👥 **Clubs** - Manage subscribed clubs and communities
- ⚙️ **Settings** - User profile and app preferences

## Tech Stack

- **Framework**: Expo SDK ~53 with Expo Router
- **UI Library**: Tamagui
- **3D Graphics**: Three.js + @react-three/fiber
- **Authentication**: JWT + OAuth (Google, Facebook, GitHub)
- **State Management**: React Context API
- **Animations**: React Native Reanimated

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
cd /home/ashish/Code/React-Native/CampusCommunity
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on specific platforms:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
CampusCommunity/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── 3d/               # Three.js components
│   └── ui/               # UI components
├── context/              # React Context providers
├── services/             # API services and mock data
├── constants/            # Constants and types
└── hooks/               # Custom hooks
```

## Authentication

The app includes a complete authentication system with:

- JWT access and refresh tokens
- Secure token storage using Expo SecureStore
- Automatic token refresh on API calls
- OAuth integration (Google, Facebook, GitHub)
- Protected routes with automatic redirection

### Demo Credentials

- Email: `test@example.com`
- Password: `password`

## 3D Features

The app includes Three.js integration for:

- Animated campus building models
- Interactive 3D elements
- Platform-specific rendering (mobile vs web)
- Performance-optimized 3D scenes

## API Integration

Currently uses mock data with realistic delays. Easy to replace with real backend:

- Mock endpoints for authentication
- Mock news feed data
- Mock clubs and updates
- Simulated network latency

## Development

### Adding New Features

1. Create components in `components/`
2. Add screens in `app/(tabs)/`
3. Update navigation in `app/(tabs)/_layout.tsx`
4. Add API endpoints in `services/`

### Styling

The app uses Tamagui for consistent styling:

- Theme-based colors
- Responsive design
- Dark/light mode support
- Custom components

## Deployment

### Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for Web
npm run build:web
```

### Environment Variables

Create a `.env` file for production:

```
API_BASE_URL=your_api_url
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id
GITHUB_CLIENT_ID=your_github_client_id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@campuscommunity.com or create an issue on GitHub.
