import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, Space_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';
import { Toaster } from 'react-hot-toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AzVolunteer — Azərbaycan Milli Könüllülük Platforması',
  description:
    "Azerbaijan's national volunteer and technical STEM platform. Join 5,000+ volunteers shaping our nation's future.",
  keywords: 'Azerbaijan, volunteer, STEM, chemical engineering, könüllü',
  openGraph: {
    title: 'AzVolunteer',
    description: 'Azerbaijan National Volunteer Platform',
    locale: 'az_AZ',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className={`${playfair.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="antialiased selection:bg-green-500/30">
        <div className="noise-overlay" />
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f2318',
                color: '#e8f5e9',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                borderRadius: '16px',
              },
              success: { iconTheme: { primary: '#4caf50', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
