// backend/server.js
const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Rutas API 
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/cart', cartRoutes);


app.use('/', express.static(path.join(__dirname, '../frontend')));

// ruta de prueba para ver si arranca el servidor
app.get('/hello', (req, res) => res.send('Servidor backend funcionando'));

// Iniciador del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
