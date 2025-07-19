import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import Link from 'next/link';

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
        <Providers>
          <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                Cat Food Store
              </Link>
              <div className="space-x-4">
                <Link href="/" className="hover:text-blue-200">Home</Link>
                <Link href="/about" className="hover:text-blue-200">About</Link>
                <Link href="/profile" className="hover:text-blue-200">Profile</Link>
                <Link href="/products" className="hover:text-blue-200">Products</Link>
                <Link href="/admin" className="hover:text-blue-200">Admin</Link>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
