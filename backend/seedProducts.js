require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const products = [
  // Men's T-Shirts
  {
    name: 'Classic Black T-Shirt',
    description: 'Premium quality black t-shirt perfect for everyday wear',
    price: 399,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 50,
  },
  {
    name: 'White Cotton Tee',
    description: 'Comfortable and breathable white t-shirt',
    price: 349,
    image: 'https://images.unsplash.com/photo-1618886673297-fbe74e64fef5?w=400',
    category: 'Men',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 45,
  },
  {
    name: 'Navy Blue Crew Neck',
    description: 'Stylish navy blue crew neck t-shirt',
    price: 429,
    image: 'https://images.unsplash.com/photo-1512084102812-8b93161801d1?w=400',
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 55,
  },
  {
    name: 'Casual Gray Shirt',
    description: 'Versatile gray shirt for casual occasions',
    price: 379,
    image: 'https://images.unsplash.com/photo-1607621519227-dbb6eaf34fbb?w=400',
    category: 'Men',
    sizes: ['M', 'L', 'XL'],
    stock: 40,
  },
  {
    name: 'Blue Striped Shirt',
    description: 'Classic blue striped button-up shirt',
    price: 599,
    image: 'https://images.unsplash.com/photo-1596618343408-e52df9c4d570?w=400',
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 35,
  },
  {
    name: 'Black Denim Jeans',
    description: 'Comfortable and durable black denim jeans',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400',
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 60,
  },
  {
    name: 'Blue Slim Fit Jeans',
    description: 'Modern slim fit blue jeans',
    price: 1399,
    image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400',
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 50,
  },
  {
    name: 'Casual Hoodie',
    description: 'Cozy black hoodie for comfort',
    price: 899,
    image: 'https://images.unsplash.com/photo-1556821552-5ff63b1446e7?w=400',
    category: 'Men',
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 30,
  },

  // Women's T-Shirts
  {
    name: 'Women\'s Pink Crop Top',
    description: 'Trendy pink crop top for summer',
    price: 449,
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffff0ba04?w=400',
    category: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 40,
  },
  {
    name: 'White Summer Tee',
    description: 'Perfect white t-shirt for summer',
    price: 399,
    image: 'https://images.unsplash.com/photo-1506629082632-22dab77e0a10?w=400',
    category: 'Women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 45,
  },
  {
    name: 'Black Fitted Dress',
    description: 'Elegant black fitted dress',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1595777707802-e826d60791cb?w=400',
    category: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 25,
  },
  {
    name: 'Blue Floral Dress',
    description: 'Beautiful blue floral pattern dress',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1589554415514-56c742b50c5a?w=400',
    category: 'Women',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 35,
  },
  {
    name: 'Women\'s Denim Jacket',
    description: 'Classic denim jacket for any season',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400',
    category: 'Women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 30,
  },
  {
    name: 'Black Leggings',
    description: 'Comfortable black leggings',
    price: 699,
    image: 'https://images.unsplash.com/photo-1506629082632-22dab77e0a10?w=400',
    category: 'Women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 50,
  },

  // Kids
  {
    name: 'Kids Red T-Shirt',
    description: 'Cute red t-shirt for kids',
    price: 299,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
    category: 'Kids',
    sizes: ['S', 'M', 'L'],
    stock: 60,
  },
  {
    name: 'Kids Blue Shirt',
    description: 'Comfortable blue shirt for children',
    price: 349,
    image: 'https://images.unsplash.com/photo-1587836374828-4dbafa186ae0?w=400',
    category: 'Kids',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 55,
  },
  {
    name: 'Kids Denim Jacket',
    description: 'Stylish denim jacket for kids',
    price: 799,
    image: 'https://images.unsplash.com/photo-1552252917-50ff12ee6900?w=400',
    category: 'Kids',
    sizes: ['S', 'M', 'L'],
    stock: 40,
  },

  // Accessories
  {
    name: 'Cotton Socks Pack',
    description: 'Comfortable cotton socks (pack of 5)',
    price: 199,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'Accessories',
    sizes: ['M', 'L'],
    stock: 100,
  },
  {
    name: 'Baseball Cap',
    description: 'Classic black baseball cap',
    price: 399,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'Accessories',
    sizes: ['M'],
    stock: 50,
  },
  {
    name: 'Canvas Belt',
    description: 'Durable canvas belt with metal buckle',
    price: 299,
    image: 'https://images.unsplash.com/photo-1635148064528-8c61024a29fe?w=400',
    category: 'Accessories',
    sizes: ['M', 'L', 'XL'],
    stock: 70,
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✓ Successfully seeded ${insertedProducts.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();