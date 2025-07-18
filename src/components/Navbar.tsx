import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='bg-blue-600 text-white p-4'>
      <div className='max-w-6xl mx-auto flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <Link href='/' className='text-xl font-bold hover:text-blue-200'>
            JADIG Task 2
          </Link>
        </div>
        <div className='space-x-6'>
          <Link href='/' className='hover:text-blue-200'>
            Home
          </Link>
          <Link href='/about' className='hover:text-blue-200'>
            About
          </Link>
          <Link href='/profile' className='hover:text-blue-200'>
            Profile
          </Link>
          <Link href='/products' className='hover:text-blue-200'>
            Products
          </Link>
          <Link href='/admin' className='hover:text-blue-200'>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
