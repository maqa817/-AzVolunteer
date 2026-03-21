import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';
import { Toaster } from 'react-hot-toast';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="az" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="antialiased selection:bg-green-500/20 text-slate-800 bg-slate-50">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#1e293b',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '24px',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: '600',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

