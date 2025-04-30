function markRead(id) {
  fetch('/books', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
    .then(res => res.json())
    .then(() => window.location.reload());
}

function deleteBook(id) {
  fetch('/books', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
    .then(res => res.json())
    .then(() => window.location.reload());
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mark-read-btn').forEach(btn => {
    btn.addEventListener('click', () => markRead(btn.dataset.id));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteBook(btn.dataset.id));
  });

  // star rating input logic
  const stars = document.querySelectorAll('#star-rating .star');
  const ratingInput = document.getElementById('ratingInput');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.dataset.value);
      ratingInput.value = value;
      stars.forEach(s => {
        s.classList.toggle('selected', parseInt(s.dataset.value) <= value);
      });
    });
  });
});
