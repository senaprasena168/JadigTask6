'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProducts, deleteProduct } from '@/lib/features/products/productsSlice';
import clsx from 'clsx';

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const { items: products, loading, error } = useAppSelector((state) => state.products);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (deleteConfirm === id) {
      setDeleting(id);
      try {
        await dispatch(deleteProduct(id));
      } catch (error) {
        console.error('Failed to delete product:', error);
      } finally {
        setDeleting(null);
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
        <Link
          href='/admin/add'
          className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors'
        >
          Add New Product
        </Link>
      </div>

      {error && (
        <div className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6'>
          <div className='flex items-center gap-2'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
            </svg>
            <span>Unable to load products from server. Showing offline view.</span>
          </div>
        </div>
      )}

      {/* Show empty state when there are no valid products OR when there's an error */}
      {(products.length === 0 || error || products.every(p => !p.name || p.name === '')) ? (
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
              Much Empty. Very Sad. Wow.
            </h2>
            <p className='text-gray-700'>
              Such no products. Very lonely admin panel.
            </p>
          </div>
          
          <Link
            href='/admin/add'
            className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Add First Product
          </Link>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Price
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Created
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {products.filter(p => p.name && p.name.trim() !== '').map((product) => (
                  <tr key={product.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-16 w-16'>
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={64}
                              height={64}
                              className='h-16 w-16 rounded-lg object-cover'
                            />
                          ) : (
                            <div className='h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center'>
                              <svg className='w-8 h-8 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>{product.name}</div>
                          {product.description && (
                            <div className='text-sm text-gray-500 line-clamp-2'>{product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      ${product.price}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                      <Link
                        href={`/products/${product.id}`}
                        className='text-blue-600 hover:text-blue-900'
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/edit/${product.id}`}
                        className='text-indigo-600 hover:text-indigo-900'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className='text-red-600 hover:text-red-900 disabled:opacity-50'
                      >
                        {deleting === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
