# Auth Core

Core authentication system with Zustand store, JWT token management with auto-refresh. No pages included - use separate page modules (login-page, register-page, etc.) for UI.

## Exports

**Components:** useAuth, useAuthStore

**Types:** AuthTokens, User

## Usage

```tsx
import { useAuth, useAuthStore } from '@/modules/auth-core';

// Use the hook for auth operations
const {
  user,
  tokens,
  isAuthenticated,
  login,
  register,
  confirmEmail,
  forgotPassword,
  resetPassword,
  logout,
  api,
} = useAuth();

// Auth operations
await login(username, password);
await register(username, email, password);
await confirmEmail(username, code);
await forgotPassword(username);
await resetPassword(username, code, newPassword);
logout();

// Direct store access for state management
const setAuth = useAuthStore((state) => state.setAuth);
const clearAuth = useAuthStore((state) => state.clearAuth);

• Installed at: src/modules/auth-core/
• Provides: useAuth hook, useAuthStore
• Auto token refresh before expiry
• 401 interceptor with automatic retry
• Uses customerClient from api module internally
```

## Dependencies

- api

