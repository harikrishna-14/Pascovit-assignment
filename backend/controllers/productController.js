// backend/controllers/productController.js
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products with filters, search, and pagination
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { search, category, size, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    // Build query
    let query = {};

    // Search in name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by size
    if (size) {
      query.sizes = size;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Fetch products
    const products = await Product.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};