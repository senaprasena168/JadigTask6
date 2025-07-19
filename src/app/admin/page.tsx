'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProducts } from '@/lib/features/products/productsSlice';
import Image from 'next/image';
import clsx from 'clsx';

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const { products = [], loading, error } = useAppSelector((state) => state.products);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        dispatch(fetchProducts()); // Refresh the list
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleAddProduct = async (formData: FormData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          price: formData.get('price'),
          description: formData.get('description'),
          image: formData.get('image'),
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        dispatch(fetchProducts()); // Refresh the list
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      alert('Error adding product');
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
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors'
        >
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
          Error: {error}
        </div>
      )}

      {showAddForm && (
        <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Add New Product</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddProduct(formData);
            }}
            className='space-y-4'
          >
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Product Name
              </label>
              <input
                type='text'
                name='name'
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Price
              </label>
              <input
                type='number'
                name='price'
                step='0.01'
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description
              </label>
              <textarea
                name='description'
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Image URL
              </label>
              <input
                type='url'
                name='image'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Add Product
            </button>
          </form>
        </div>
      )}

      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-800'>Products ({products.length})</h2>
        </div>
        
        {products.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            No products found. Add some products to get started!
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Price
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Description
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <Image
                            src={`/api/images/${product.id}`}
                            alt={product.name}
                            width={40}
                            height={40}
                            className='h-10 w-10 rounded-full object-cover'
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      ${product.price}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900 max-w-xs truncate'>
                      {product.description || 'No description'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className='text-red-600 hover:text-red-900 transition-colors'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
