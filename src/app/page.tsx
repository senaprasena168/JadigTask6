import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-4'>
      <div className='text-center'>
        <h1 className='text-3xl md:text-4xl font-bold mb-4 text-blue-600'>
          Jabar Istimewa Digital Academy Fullstack - Task 2
        </h1>
        <p className='text-base md:text-lg mb-6 text-gray-700'>
          A Next.js application with routing and navigation
        </p>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
          <Link
            href='/about'
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm'
          >
            About Page
          </Link>
          <Link
            href='/profile'
            className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm'
          >
            Profile Page
          </Link>
          <Link
            href='/products'
            className='bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm'
          >
            Products Page
          </Link>
          <Link
            href='/nonexistent'
            className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm'
          >
            404 Page Demo
          </Link>
        </div>

        <div className='bg-blue-100 p-4 rounded-lg'>
          <h2 className='text-lg md:text-xl font-semibold mb-3 text-blue-800'>
            Features Implemented:
          </h2>
          <ul className='text-sm text-left max-w-sm mx-auto space-y-1 text-gray-800'>
            <li>✅ Static Pages (About, Profile, Products)</li>
            <li>✅ Dynamic Routes (/products/[id])</li>
            <li>✅ Custom 404 Page</li>
            <li>✅ Navigation with Next.js Link</li>
            <li>✅ Responsive Design</li>
            <li>✅ API Endpoints for CRUD Operations</li>
            <li>✅ Product Management Interface</li>
            <li>✅ Image Upload Support</li>
            <li>✅ Price Formatting with $ Sign</li>
            <li>✅ Edit/Delete Product Features</li>
            <li>✅ Admin Dashboard</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
