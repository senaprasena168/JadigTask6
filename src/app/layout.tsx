import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Jabar Istimewa Digital Academy Fullstack - Task 2',
  description: 'A Next.js application with routing and navigation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
