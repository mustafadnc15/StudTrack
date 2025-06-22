# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StudTrack is a student coaching mobile application built with React Native and Expo Router. The app supports both students and coaches with features for study tracking, goal setting, and communication.

## Tech Stack

- **Framework**: React Native with Expo (~53.0.12)
- **Router**: Expo Router (~5.1.0) with file-based routing
- **UI Library**: React Native Paper (~5.14.5) for Material Design components
- **State Management**: Zustand (~5.0.5) for global state
- **Data Fetching**: TanStack React Query (~5.80.10)
- **Backend**: Supabase (~2.50.0)
- **Forms**: React Hook Form (~7.58.1)
- **Language**: TypeScript with strict mode enabled

## Common Commands

### Development
```bash
# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run android    # Android emulator
npm run ios        # iOS simulator  
npm run web        # Web browser

# Linting
npm run lint       # Uses expo lint

# Reset project structure
npm run reset-project
```

### Dependencies
```bash
npm install        # Install all dependencies
```

## Architecture

### Directory Structure
- `app/` - Expo Router file-based routing (main app navigation)
  - `auth/` - Authentication screens (login, signup)
  - `student/(tabs)/` - Student dashboard with tab navigation
  - `coach/{tabs}/` - Coach interface (under development)
- `src/` - Core application logic
  - `components/` - Role-specific components (coach/, student/, common/)
  - `services/` - External service integrations (api/, notifications/, storage/)
  - `store/` - Zustand state management stores
  - `types/` - TypeScript type definitions
  - `hooks/` - Custom React hooks and business logic
  - `constants/` - App constants (colors, translations)
  - `utils/` - Utility functions
- `components/` - Expo template UI components (themed, reusable)
- `hooks/` - Platform-specific hooks (color scheme, theming)

### Key Types
The app uses role-based authentication with `User` type having `role: 'student' | 'coach'`. Core entities include:
- `StudySession` - Individual study tracking sessions
- `Subject` - Study subjects with color coding
- `Streak` - Student streak tracking with freeze functionality
- `Goal` - Coach-assigned student goals
- `Message` - Communication between coaches and students

### State Management
- **Authentication**: `src/store/authStore.ts` using Zustand
- **User State**: Managed through `useAuthStore` with user, loading, and authentication status

### Navigation
- Uses Expo Router with TypeScript typed routes enabled
- Stack navigation with hidden headers by default
- Tab-based navigation for student dashboard
- Screen configurations in `app/_layout.tsx`

### Styling
- React Native Paper for consistent Material Design
- Theme support with automatic UI style switching
- Custom themed components in `components/` directory

## Development Notes

### Path Aliases
- `@/*` maps to project root for clean imports

### Key Dependencies
- **AsyncStorage**: For local data persistence
- **React Query**: For server state management and caching
- **Expo modules**: Image, blur, haptics, linear gradient, linking, etc.
- **Navigation**: Bottom tabs and stack navigation

### Platform Support
- iOS (supports tablets)
- Android (edge-to-edge enabled, adaptive icons)
- Web (Metro bundler, static output)

### Configuration
- New Architecture enabled in Expo config
- Typed routes experimental feature enabled
- Strict TypeScript compilation