// courses //
const express = require('express');
const router = express.Router();


const CourseModel = require('../models/course');

// GET lista todos los cursos //
router.get('/', (req, res) => {
  try {
    const courses = CourseModel.getAllCourses();
    res.json(courses);
  } catch (err) {
    console.error('Error al obtener cursos:', err);
    res.status(500).json({ message: 'Error interno al obtener cursos' });
  }
});

// GET detalle de curso //
router.get('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const course = CourseModel.getCourseById(id);
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    res.json(course);
  } catch (err) {
    console.error('Error al obtener curso por id:', err);
    res.status(500).json({ message: 'Error interno al obtener el curso' });
  }
});

module.exports = router;
