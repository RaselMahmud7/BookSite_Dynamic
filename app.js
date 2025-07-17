// Dynamic loader for programming book

document.addEventListener('DOMContentLoaded', () => {
  fetch('book.json')
    .then(response => response.json())
    .then(data => renderBook(data));
});

function renderBook(book) {
  const container = document.getElementById('dynamic-content');
  if (!container) return;

  // Title and author
  container.innerHTML = `<h1>${book.title}</h1><div class="author">by ${book.author}</div>`;

  // Table of contents
  let toc = '<nav class="toc"><h2>সূচিপত্র</h2><ul>';
  book.chapters.forEach(chap => {
    toc += `<li><a href="#${chap.id}">${chap.title}</a></li>`;
  });
  toc += '</ul></nav>';
  container.innerHTML += toc;

  // Chapters
  book.chapters.forEach(chap => {
    container.innerHTML += `<section id="${chap.id}"><h2>${chap.title}</h2><div class="chapter-content">${chap.content}</div></section>`;
  });
} 