const express = require('express');
const { 
  addToCart, 
  updateCart, 
  removeFromCart, 
  getCart, 
  clearCart 
} = require('../controllers/cartController');

const router = express.Router();

router.post('/add', addToCart);
router.put('/update', updateCart);
router.delete('/remove', removeFromCart);
router.get('/', getCart);
router.delete('/clear', clearCart);

module.exports = router;