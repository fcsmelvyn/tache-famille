// tasks.js - gère les tâches (active + complétées)
const TASKS_KEY = 'mp_tasks_v2';
const DONE_KEY = 'mp_done_v2';

const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDue = document.getElementById('taskDue');
const tasksList = document.getElementById('tasksList');
const doneList = document.getElementById('doneList');

let tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
let done = JSON.parse(localStorage.getItem(DONE_KEY) || '[]');

function saveTasks(){ localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }
function saveDone(){ localStorage.setItem(DONE_KEY, JSON.stringify(done)); }

function formatDate(d){
  try{
    const dt = new Date(d);
    return dt.toLocaleDateString();
  }catch(e){ return d; }
}

function renderTasks(){
  tasksList.innerHTML = '';
  if(tasks.length === 0){
    tasksList.innerHTML = '<li class="card">Aucune tâche — ajoute la première !</li>';
    return;
  }
  tasks.forEach((t, idx)=>{
    const li = document.createElement('li');
    const dueClass = new Date(t.due) < new Date() ? 'due overdue' : 'due upcoming';
    li.innerHTML = `
      <div class="task-info">
        <div style="min-width:0">
          <strong>${escapeHtml(t.title)}</strong>
          <div class="meta">Ajoutée le ${formatDate(t.created)}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="${dueClass}">${formatDate(t.due)}</div>
        <div class="actions">
          <button class="small-btn secondary" data-idx="${idx}" data-act="done">Vu</button>
          <button class="small-btn danger" data-idx="${idx}" data-act="del">Suppr</button>
        </div>
      </div>
    `;
    tasksList.appendChild(li);
  });
}

function renderDone(){
  doneList.innerHTML = '';
  if(done.length === 0){
    doneList.innerHTML = '<li class="card">Aucune tâche complétée.</li>';
    return;
  }
  done.forEach((t, idx)=>{
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="task-info">
        <div style="min-width:0">
          <strong style="text-decoration:line-through">${escapeHtml(t.title)}</strong>
          <div class="meta">Ajoutée le ${formatDate(t.created)} — Terminée le ${formatDate(t.doneAt)}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="due">${formatDate(t.due)}</div>
        <div class="actions">
          <button class="small-btn danger" data-idx="${idx}" data-act="delDone">Suppr</button>
        </div>
      </div>
    `;
    doneList.appendChild(li);
  });
}

// event delegation for tasks actions
tasksList.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const idx = Number(btn.dataset.idx);
  const act = btn.dataset.act;
  if(act === 'done'){
    const t = tasks.splice(idx,1)[0];
    t.doneAt = new Date().toISOString();
    done.unshift(t);
    saveTasks(); saveDone();
    renderTasks(); renderDone();
  } else if(act === 'del'){
    if(confirm('Supprimer cette tâche ?')){
      tasks.splice(idx,1);
      saveTasks();
      renderTasks();
    }
  }
});

doneList.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const idx = Number(btn.dataset.idx);
  const act = btn.dataset.act;
  if(act === 'delDone'){
    if(confirm('Supprimer définitivement cette tâche complétée ?')){
      done.splice(idx,1);
      saveDone();
      renderDone();
    }
  }
});

taskForm.addEventListener('submit', e=>{
  e.preventDefault();
  const title = taskTitle.value.trim();
  const due = taskDue.value;
  if(!title || !due){ alert('Titre et date limite requis'); return; }
  const t = { title, created: new Date().toISOString(), due };
  tasks.unshift(t);
  saveTasks();
  taskTitle.value = '';
  taskDue.value = '';
  renderTasks();
});

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// init
renderTasks();
renderDone();
