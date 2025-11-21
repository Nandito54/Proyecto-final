// cart.js - ver y finalizar carrito
const API_BASE = '/api';

async function loadCart() {
  const userId = localStorage.getItem('userId');
  const list = document.getElementById('cart-list');
  list.innerHTML = '';

  if (!userId) {
    list.textContent = 'Debes iniciar sesión para ver el carrito.';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/cart/${userId}`);
    const data = await res.json();
    const items = data.cart;

    if (!items || items.length === 0) {
      list.textContent = 'Tu carrito está vacío.';
      return;
    }

    
    const allRes = await fetch(`${API_BASE}/courses`);
    const courses = await allRes.json();

    items.forEach(it => {
      const course = courses.find(c => c.id === it.courseId) || { title: `Curso ${it.courseId}` };
      const div = document.createElement('div');
      div.className = 'course-card';
      div.innerHTML = `<strong>${escapeHtml(course.title)}</strong> — ID: ${it.courseId}`;
      list.appendChild(div);
    });

  } catch (err) {
    list.textContent = 'Error cargando el carrito';
    console.error(err);
  }
}

async function doCheckout() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('Debes iniciar sesión para comprar.');
    window.location.href = 'login.html';
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/cart/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: parseInt(userId) })
    });
    const data = await res.json();
    alert(data.message || 'Compra realizada');
    loadCart();
  } catch (err) {
    alert('Error en el checkout');
    console.error(err);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch]));
}

document.getElementById && document.addEventListener('DOMContentLoaded', () => {
  const loadBtn = document.getElementById('load-cart');
  const checkoutBtn = document.getElementById('checkout');
  if (loadBtn) loadBtn.onclick = loadCart;
  if (checkoutBtn) checkoutBtn.onclick = doCheckout;
});
