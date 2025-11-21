// frontend/js/main.js
// Versión mejorada pero simple: carga cursos, renderiza grid y añade al carrito (nivel junior)

const API_BASE = '/api';

// Escapa texto para evitar inyección (muy básico)
function escapeHtml(text) {
  if (!text && text !== 0) return '';
  return String(text).replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
}

// Renderiza cursos en el contenedor #courses-list como grid de tarjetas
function renderCoursesGrid(courses) {
  const listDiv = document.getElementById('courses-list');
  if (!listDiv) return;

  // Asegurar que use la clase de estilo para grid
  listDiv.classList.add('courses-grid');
  listDiv.innerHTML = ''; // limpiar

  courses.forEach(course => {
    const node = document.createElement('div');
    node.className = 'course-card';
    node.innerHTML = `
      <div>
        <h3>${escapeHtml(course.title)}</h3>
        <p>${escapeHtml(course.description)}</p>
      </div>
      <div class="course-meta">
        <span class="price-badge">€${escapeHtml(course.price)}</span>
        <div>
          <a class="btn-link" href="course-detail.html?id=${course.id}">Ver</a>
          <button onclick="addToCart(${course.id})" style="margin-left:8px;">Añadir</button>
        </div>
      </div>
    `;
    listDiv.appendChild(node);
  });
}

// Renderiza la lista destacada (home)
function renderFeatured(courses) {
  const feat = document.getElementById('featured-list');
  if (!feat) return;
  feat.innerHTML = '';
  courses.slice(0,3).forEach(c => {
    const n = document.createElement('div');
    n.innerHTML = `<strong>${escapeHtml(c.title)}</strong> — €${escapeHtml(c.price)} — <a href="course-detail.html?id=${c.id}">Ver</a>`;
    feat.appendChild(n);
  });
}

// Cargar cursos desde backend y renderizar en las páginas donde exista el contenedor
async function loadAndRenderCourses() {
  try {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error('Error al obtener cursos');
    const courses = await res.json();

    // render en listado y featured si existen
    renderCoursesGrid(courses);
    renderFeatured(courses);
  } catch (err) {
    console.error('Error cargando cursos', err);
  }
}

// Añade al caerrito el storage corre el codigo no tocar ya la cagamos suficiente)
async function addToCart(courseId) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('Debes iniciar sesión para añadir cursos al carrito.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: parseInt(userId), courseId: parseInt(courseId) })
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message || 'Añadido al carrito');
    } else {
      alert(data.message || 'Error al añadir al carrito');
      console.error('Error addToCart', data);
    }
  } catch (err) {
    console.error('Error añadiendo al carrito', err);
    alert('Error al añadir al carrito');
  }
}

document.addEventListener('DOMContentLoaded', loadAndRenderCourses);
