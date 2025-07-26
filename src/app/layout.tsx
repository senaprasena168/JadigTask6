import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import SessionProvider from '@/components/SessionProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cat Food Store',
  description: 'Premium cat food and accessories for your feline friends',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={null}>
          <Providers>
            <Navbar />
            <main>{children}</main>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
