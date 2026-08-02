import React from 'react';

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Add context providers (ThemeProvider, AuthProvider, etc.) here
  return <>{children}</>;
}
