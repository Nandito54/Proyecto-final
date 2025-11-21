
const fs = require('fs');
const path = require('path');


const coursesPath = path.join(__dirname, '..', 'data', 'courses.json');


function loadCourses() {
  const data = fs.readFileSync(coursesPath, 'utf8');
  return JSON.parse(data);
}

module.exports = {
  getAllCourses: () => {
    return loadCourses();
  },

  getCourseById: (id) => {
    const courses = loadCourses();
    return courses.find(course => course.id === parseInt(id));
  }
};
