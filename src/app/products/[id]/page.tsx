import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Extended product details for display
const productDetails: Record<string, any> = {
  '1': {
    image: '/products/mic.jpg',
    description: 'High-quality microphone for professional recording',
    features: [
      'High-quality audio recording',
      'Noise cancellation technology',
      'USB connectivity',
      'Compatible with all devices',
    ],
  },
  '2': {
    image: '/products/roll.jpg',
    description: 'Durable and high-quality roll product for various uses',
    features: [
      'Durable material construction',
      'Easy to use interface',
      'Compact and portable design',
      'Long-lasting performance',
    ],
  },
  '3': {
    image: '/products/tail.jpg',
    description: 'Premium tail product with elegant design',
    features: [
      'Premium quality materials',
      'Ergonomic design',
      'Multiple color options',
      'Satisfaction guaranteed',
    ],
  },
};

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  // If product doesn't exist in API, show 404
  if (!product) {
    notFound();
  }

  const details = productDetails[id];

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/products" 
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2 transition-colors"
          >
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-96">
                <Image
                  src={details?.image || '/products/default.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
              <p className="text-2xl font-bold text-purple-600 mb-6">{product.price}</p>
              
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {details?.description || 'No description available for this product.'}
                </p>
              </div>

              {details?.features && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Features:</h3>
                  <ul className="space-y-2">
                    {details.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/products"
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-center font-medium"
                >
                  Back to Products
                </Link>
                <Link 
                  href="/admin"
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors text-center font-medium"
                >
                  Go to Admin
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Product Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Product ID:</strong> {product.id}
            </div>
            <div>
              <strong>Price:</strong> {product.price}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
