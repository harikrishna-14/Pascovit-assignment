const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    category: {
      type: String,
      enum: ['Men', 'Women', 'Kids', 'Accessories'],
      required: [true, 'Please select a category'],
    },
    sizes: {
      type: [String],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 10,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);