'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProducts } from '@/lib/features/products/productsSlice';
import clsx from 'clsx';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cat Food Products | Cat Food Store',
  description: 'Browse our premium selection of cat food and accessories for your feline friends.',
};

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items: products, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
        </div>
      </div>
    );
  }

  // Show empty state for both no products AND errors
  if (products.length === 0 || error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-8'>Our Cat Food Products</h1>
        
        {error && (
          <div className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6'>
            <div className='flex items-center gap-2'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
              </svg>
              <span>Unable to load products from server</span>
            </div>
          </div>
        )}

        <div className='text-center py-12'>
          {/* Doge image */}
          <div className='relative w-48 h-48 md:w-64 md:h-64 mb-6 mx-auto'>
            <Image
              src='/not-found/doge.jpg'
              alt='Sad doge'
              fill
              className='object-cover rounded-lg'
            />
          </div>
          
          <div className='bg-yellow-100 p-6 rounded-lg mb-6 max-w-md mx-auto'>
            <h2 className='text-xl md:text-2xl font-semibold text-yellow-800 mb-2'>
              {error ? 'Much Error. Very Sad. Wow.' : 'Much Empty. Very Store. Wow.'}
            </h2>
            <p className='text-gray-700'>
              {error ? 'Such server problems. Very try again later.' : 'Such no products. Very coming soon.'}
            </p>
          </div>
          
          {!error && (
            <p className='text-gray-500 text-lg mb-4'>
              Our products are being prepared with much care!
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Cat Food Products</h1>
        <Link
          href='/admin'
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
        >
          Manage Products
        </Link>
      </div>

      {products.length === 0 ? (
        <div className='text-center py-12'>
          {/* Doge image */}
          <div className='relative w-48 h-48 md:w-64 md:h-64 mb-6 mx-auto'>
            <Image
              src='/not-found/doge.jpg'
              alt='Sad doge'
              fill
              className='object-cover rounded-lg'
            />
          </div>
          
          <div className='bg-yellow-100 p-6 rounded-lg mb-6 max-w-md mx-auto'>
            <h2 className='text-xl md:text-2xl font-semibold text-yellow-800 mb-2'>
              Much Empty. Very Store. Wow.
            </h2>
            <p className='text-gray-700'>
              Such no products. Very coming soon.
            </p>
          </div>
          
          <p className='text-gray-500 text-lg mb-4'>
            Our products are being prepared with much care!
          </p>
        </div>
      ) : (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className={clsx(
                'bg-white rounded-lg shadow-md overflow-hidden',
                'hover:shadow-lg transition-shadow duration-200',
                'border border-gray-200'
              )}
            >
              <div className='aspect-square relative bg-gray-100'>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full text-gray-400'>
                    <svg className='w-12 h-12' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' />
                    </svg>
                  </div>
                )}
              </div>
              <div className='p-4'>
                <h3 className='font-semibold text-gray-800 mb-2 line-clamp-2'>
                  {product.name}
                </h3>
                <p className='text-blue-600 font-bold text-lg'>
                  ${product.price}
                </p>
                {product.description && (
                  <p className='text-gray-600 text-sm mt-2 line-clamp-2'>
                    {product.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
