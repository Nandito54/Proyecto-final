// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const { users } = require('../models/user');

// Carrito en memoria: array de objetos { userId, courseId }
let cart = [];

// POST /api/cart/add  -> { userId, courseId }
router.post('/add', (req, res) => {
  const { userId, courseId } = req.body;
  if (!userId || !courseId) return res.status(400).json({ message: 'userId y courseId son requeridos' });

  const user = users.find(u => u.id === parseInt(userId));
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  cart.push({ userId: user.id, courseId: parseInt(courseId) });
  res.json({ message: 'Curso añadido al carrito', cart });
});

// GET /api/cart/:userId -> obtener carrito del usuario
router.get('/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userCart = cart.filter(item => item.userId === userId);
  res.json({ cart: userCart });
});

// POST /api/cart/checkout -> { userId }  (simula las compra haber si no se rompe no tocar pase mucho dolor de cabeza )
router.post('/checkout', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId es requerido' });

  const user = users.find(u => u.id === parseInt(userId));
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  // items del usuario 
  const userItems = cart.filter(i => i.userId === user.id);
  userItems.forEach(i => {
    if (!user.purchasedCourses.includes(i.courseId)) {
      user.purchasedCourses.push(i.courseId);
    }
  });

  // delete para el carrito
  cart = cart.filter(i => i.userId !== user.id);

  res.json({ message: 'Compra realizada', purchasedCourses: user.purchasedCourses });
});

module.exports = router;
