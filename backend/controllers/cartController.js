const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (userId = null, sessionId = null) => {
  let cart;
  if (userId) {
    cart = await Cart.findOne({ user: userId }).populate('items.product');
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId }).populate('items.product');
  }
  return cart;
};


exports.addToCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const userId = req.user?.id || null;
    const sessionId = req.body.sessionId;

    if (!productId || !size || !quantity) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await getCart(userId, sessionId);

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        sessionId: sessionId || null,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        quantity: parseInt(quantity),
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const userId = req.user?.id || null;
    const sessionId = req.body.sessionId;

    const cart = await getCart(userId, sessionId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = parseInt(quantity);
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.user?.id || null;
    const sessionId = req.body.sessionId;

    const cart = await getCart(userId, sessionId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId && item.size === size)
    );

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.query.sessionId;

    const cart = await getCart(userId, sessionId);

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.body.sessionId;

    const cart = await getCart(userId, sessionId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};