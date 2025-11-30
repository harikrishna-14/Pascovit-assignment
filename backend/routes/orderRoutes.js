const express = require('express');
const { 
  createOrder, 
  getOrder, 
  getOrders, 
  getAllOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createOrder);
router.get('/:id', getOrder);
router.get('/', protect, getOrders);
router.get('/admin/all', protect, getAllOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;