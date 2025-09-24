import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { ThemeProvider } from '@/components/theme-provider';
import { ApiProvider } from '@/contexts/ApiContext';
import { ErrorBoundary } from '@/components/error-boundary';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Modelz',
  description: 'AI model performance and news dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className={`${inter.className} antialiased bg-background min-h-screen flex flex-col justify-start`} suppressHydrationWarning>
        <ThemeProvider
          defaultTheme="light"
          storageKey="ui-theme"
        >
          <ErrorBoundary>
            <ApiProvider>
              <AppHeader />
              {children}
              <Toaster />
              <AppFooter />
            </ApiProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
