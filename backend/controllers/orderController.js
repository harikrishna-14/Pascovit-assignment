const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendOrderEmail } = require('../utils/sendEmail');


exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice, shippingAddress, sessionId } = req.body;
    const userId = req.user?.id || null;

    if (!items || items.length === 0 || !totalPrice) {
      return res.status(400).json({ message: 'Invalid order data' });
    }


    const order = await Order.create({
      user: userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod: 'mock',
      status: 'pending',
    });

    if (userId) {
      await Cart.findOneAndUpdate({ user: userId }, { items: [] });
    } else if (sessionId) {
      await Cart.findOneAndUpdate({ sessionId }, { items: [] });
    }


    if (userId) {
      const user = await require('../models/User').findById(userId);
      if (user) {
        try {
          await sendOrderEmail(order, user);
        } catch (emailError) {
          console.error('Email error:', emailError);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ orderDate: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};