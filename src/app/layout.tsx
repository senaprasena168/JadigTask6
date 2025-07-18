import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Cat Food Store',
  description: 'A premium cat food store with the best products for your feline friends',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <Providers>
          <Navbar />
          <main className='min-h-screen bg-gray-50'>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
