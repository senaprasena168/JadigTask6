'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/profile', label: 'Profile' },
    { href: '/products', label: 'Products' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <nav className='bg-blue-600 text-white shadow-lg'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <Link 
            href='/' 
            className='text-xl font-bold hover:text-blue-200 transition-colors'
          >
            Cat Food Store
          </Link>
          
          <div className='hidden md:flex space-x-8'>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'px-3 py-2 text-sm font-medium transition-colors relative',
                  'hover:text-blue-200',
                  pathname === href 
                    ? 'text-blue-200 border-b-2 border-blue-200' 
                    : 'text-white'
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button className='text-white hover:text-blue-200'>
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
