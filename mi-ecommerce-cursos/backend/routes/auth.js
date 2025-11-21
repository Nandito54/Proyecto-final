// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { users } = require('../models/user');

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email y contraseña son requeridos' });

  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ message: 'El usuario ya existe' });

  const newUser = { id: users.length + 1, email, password, purchasedCourses: [] };
  users.push(newUser);

  // Devolvemos datos sin contraseña no tocar que se vuelve loco
  res.status(201).json({ message: 'Usuario creado', user: { id: newUser.id, email: newUser.email } });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: 'Email o contraseña incorrectos' });

  // Respuesta simple: devolvemos userId como "token" (muy básico)
  res.json({ message: 'Login exitoso', userId: user.id });
});

// GET /api/auth/profile/:id
router.get('/profile/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  res.json({ email: user.email, purchasedCourses: user.purchasedCourses });
});

module.exports = router;
