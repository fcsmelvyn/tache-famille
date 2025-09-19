// app.js - navigation mobile-like SPA + small helpers
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const themeToggle = document.getElementById('themeToggle');

function showPage(id){
  pages.forEach(p=>{
    const active = p.id === id;
    p.classList.toggle('active', active);
    p.setAttribute('aria-hidden', !active);
  });
  navBtns.forEach(b=> b.classList.toggle('active', b.dataset.target === id));
  // set title
  if(id === 'tasksView') pageTitle.textContent = 'Tâches';
  else if(id === 'profileView') pageTitle.textContent = 'Profil';
  // scroll top of view
  window.scrollTo({top:0,behavior:'smooth'});
}

// nav click
navBtns.forEach(b=> b.addEventListener('click', ()=> showPage(b.dataset.target)));

// initial route
showPage('tasksView');

// theme toggle (simple)
let dark = false;
themeToggle.addEventListener('click', ()=>{
  dark = !dark;
  document.documentElement.style.setProperty('--bg', dark ? '#0f172a' : '#f6f8fb');
  document.documentElement.style.setProperty('--card', dark ? '#0b1220' : '#ffffff');
  document.documentElement.style.setProperty('--muted', dark ? '#94a3b8' : '#6b7280');
  themeToggle.textContent = dark ? '☀️' : '🌙';
});
