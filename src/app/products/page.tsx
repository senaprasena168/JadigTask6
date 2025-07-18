import Link from 'next/link';
import Image from 'next/image';

// Extended product data for display (keeping images and descriptions)
const productDetails = [
  {
    id: '1',
    image: '/products/mic.jpg',
    description: 'High-quality microphone for professional recording',
  },
  {
    id: '2',
    image: '/products/roll.jpg',
    description: 'Durable and high-quality roll product for various uses',
  },
  {
    id: '3',
    image: '/products/tail.jpg',
    description: 'Premium tail product with elegant design',
  },
];

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default async function Products() {
  const products = await getProducts();

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">Our Products</h1>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available</p>
            <Link 
              href="/admin"
              className="inline-block mt-4 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add Products
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {products.map((product: any) => {
              const details = productDetails.find(d => d.id === product.id);
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200'
                >
                  <div className='relative h-48 w-full'>
                    <Image
                      src={product.image || details?.image || '/products/default.jpg'}
                      alt={product.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='p-4'>
                    <h2 className='text-lg font-bold mb-2 text-gray-800'>
                      {product.name}
                    </h2>
                    <p className='text-sm text-gray-700 mb-3'>
                      {details?.description || 'No description available'}
                    </p>
                    <p className='text-lg font-semibold text-purple-600 mb-3'>
                      {product.price}
                    </p>
                    <div className='bg-purple-500 text-white px-4 py-2 rounded text-center hover:bg-purple-600 transition-colors'>
                      View Details →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-blue-800">
              ⭐ Discover our amazing product collection! Quality guaranteed with excellent customer service.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
