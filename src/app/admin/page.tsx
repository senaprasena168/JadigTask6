'use client';

import { useState, useEffect, useRef } from 'react';

interface Product {
  id: string;
  name: string;
  price: string;
  image?: string;
}

// Fallback images for existing products
const productDetails = [
  {
    id: '1',
    image: '/products/mic.jpg',
  },
  {
    id: '2',
    image: '/products/roll.jpg',
  },
  {
    id: '3',
    image: '/products/tail.jpg',
  },
];

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        alert('Image size must be less than 1MB');
        // Reset file input to placeholder state
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setImageFile(null);
        setImagePreview('');
        setNewProduct({ ...newProduct, image: '' });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        // Reset file input to placeholder state
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setImageFile(null);
        setImagePreview('');
        setNewProduct({ ...newProduct, image: '' });
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewProduct({ ...newProduct, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (value: string) => {
    // Remove $ sign and any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Validate it's a valid number
    if (numericValue === '' || !isNaN(parseFloat(numericValue))) {
      setNewProduct({ ...newProduct, price: numericValue ? `$${numericValue}` : '' });
    }
  };

  const handleEditPriceChange = (value: string) => {
    // Remove $ sign and any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Validate it's a valid number
    if (numericValue === '' || !isNaN(parseFloat(numericValue))) {
      setEditingProduct({ 
        ...editingProduct!, 
        price: numericValue ? `$${numericValue}` : '' 
      });
    }
  };

  const clearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageFile(null);
    setImagePreview('');
    setNewProduct({ ...newProduct, image: '' });
  };

  // CREATE
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!newProduct.name.trim()) {
      alert('Product name is required');
      return;
    }
    
    if (!newProduct.price.trim()) {
      alert('Product price is required');
      return;
    }
    
    if (!newProduct.image.trim()) {
      alert('Product image is required');
      return;
    }
    
    // Validate image file size before submission
    if (imageFile && imageFile.size > 1024 * 1024) {
      alert('Cannot create product: Image size must be less than 1MB');
      return;
    }
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        setNewProduct({ name: '', price: '', image: '' });
        setImageFile(null);
        setImagePreview('');
        fetchProducts();
        alert('Product created successfully!');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    }
  };

  // UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Validate image file size before submission if there's a new image
    if (imageFile && imageFile.size > 1024 * 1024) {
      alert('Cannot update product: Image size must be less than 1MB');
      return;
    }

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        setEditingProduct(null);
        setImageFile(null);
        setImagePreview('');
        fetchProducts();
        alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchProducts();
          alert('Product deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Product Management</h1>

        {/* CREATE FORM */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Product</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="border border-gray-300 p-3 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                placeholder="Price (e.g., 99.99)"
                value={newProduct.price.replace('$', '')}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="border border-gray-300 p-3 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Product Image (Max 1MB)
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 text-xl font-bold"
                    title="Clear image"
                  >
                    ×
                  </button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 transition-colors"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* PRODUCTS LIST */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b text-gray-800">Current Products</h2>
          
          {products.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No products available. Add your first product above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const fallbackImage = productDetails.find(d => d.id === product.id)?.image;
                    const imageSource = product.image || fallbackImage;
                    
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {imageSource ? (
                            <img 
                              src={imageSource} 
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="text"
                  value={editingProduct.price.replace('$', '')}
                  onChange={(e) => handleEditPriceChange(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                  >
 
                   Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}






















