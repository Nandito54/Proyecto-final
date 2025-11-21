// course details aqui voy probando :)
const API_BASE = '/api'; 


const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');


function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }
function setText(id, txt) { const el = document.getElementById(id); if(el) el.textContent = txt; }

async function loadCourse() {
  if (!courseId) {
    setText('course-title', 'Curso no especificado');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/courses/${courseId}`);
    if (!res.ok) throw new Error('Curso no encontrado');
    const course = await res.json();

    setText('course-title', course.title);
    setText('course-sub', course.description);
    setText('course-price', `Precio: €${course.price}`);

    
    setText('acc-0-content', `Duración aproximada: 4 semanas / 8 semanas (según plan).`);
    setText('acc-1-content', `Incluye vídeos, material descargable y rutinas. (Ejemplo)`);
    setText('acc-2-content', `Proceso: registrate → añade al carrito → checkout → acceso al curso.`);

  } catch (err) {
    console.error(err);
    setText('course-title', 'Error cargando el curso');
  }
}


function setupAccordions() {
  const accs = qsa('.accordion');
  accs.forEach(acc => {
    acc.addEventListener('click', () => {
      const idx = acc.getAttribute('data-idx');
      const content = document.getElementById(`acc-${idx}`);
      if (!content) return;
      const open = content.style.display === 'block';
      // cerrar todos
      qsa('.accordion-content').forEach(c => c.style.display = 'none');
      qsa('.accordion .chev').forEach(c => c.textContent = '+');
      if (!open) {
        content.style.display = 'block';
        acc.querySelector('.chev').textContent = '−';
      } else {
        content.style.display = 'none';
        acc.querySelector('.chev').textContent = '+';
      }
    });
  });
}


function setupCookie() {
  const bar = document.getElementById('cookie-bar');
  const btn = document.getElementById('cookie-accept');
  if (!bar || !btn) return;
  if (localStorage.getItem('cookiesAccepted')) {
    bar.style.display = 'none';
    return;
  }
  btn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', '1');
    bar.style.display = 'none';
  });
}


function setupChat() {
  const chat = document.getElementById('chat-circle');
  if (!chat) return;
  chat.addEventListener('click', () => {
    alert('Chat de soporte (simulado).');
  });
}


function setupButtons() {
  const startBtn = document.getElementById('btn-start');
  const buyBtn = document.getElementById('btn-buy');

  if (startBtn) startBtn.addEventListener('click', () => {
    alert('Comenzar Mi Plan: redirigiendo al carrito (simulado).');
    window.location.href = 'cart.html';
  });

  if (buyBtn) buyBtn.addEventListener('click', async () => {
    // intentar añadir al carrito y hacer checkout si está logueado
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Debes iniciar sesión para comprar.');
      window.location.href = 'login.html';
      return;
    }
    try {
      // añade el curso  al carrito
      await fetch(`${API_BASE}/cart/add`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ userId: parseInt(userId), courseId: parseInt(courseId) })
      });
      // checkout
      const res = await fetch(`${API_BASE}/cart/checkout`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ userId: parseInt(userId) })
      });
      const data = await res.json();
      alert(data.message || 'Compra realizada');
      window.location.href = 'profile.html';
    } catch (err) {
      console.error(err);
      alert('Error al procesar la compra');
    }
  });
}

// inicializador 
document.addEventListener('DOMContentLoaded', () => {
  loadCourse();
  setupAccordions();
  setupCookie();
  setupChat();
  setupButtons();
});
