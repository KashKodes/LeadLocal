import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LeadLocal',
  description: 'Lead generation for Santa Barbara local service businesses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
