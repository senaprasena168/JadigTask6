export interface ProductInput {
  name: string;
  price: string;
  description?: string;
  image?: string;
}

export function validateProduct(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!data.price || isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0) {
    errors.push('Valid price is required');
  }

  if (data.name && data.name.length > 255) {
    errors.push('Product name must be less than 255 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}