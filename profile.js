// profile.js - gère les profils locaux (nom, prenom, avatar)
const PROFILE_KEY = 'mp_profiles_v2';
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');
const lastName = document.getElementById('lastName');
const firstName = document.getElementById('firstName');
const saveProfile = document.getElementById('saveProfile');
const profilesList = document.getElementById('profilesList');
const resetProfiles = document.getElementById('resetProfiles');

let profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || '[]');

function saveProfiles(){ localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles)); }

avatarInput.addEventListener('change', ()=>{
  const f = avatarInput.files && avatarInput.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = ()=>{
    avatarPreview.src = r.result;
    avatarPreview.dataset.raw = r.result;
  };
  r.readAsDataURL(f);
});

saveProfile.addEventListener('click', (e)=>{
  e.preventDefault();
  const ln = lastName.value.trim();
  const fn = firstName.value.trim();
  const avatar = avatarPreview.dataset.raw || '';
  if(!ln && !fn){ alert('Au moins un nom ou prénom requis'); return; }
  const p = { id: Date.now(), lastName: ln, firstName: fn, avatar };
  profiles.unshift(p);
  saveProfiles();
  renderProfiles();
  // reset form
  lastName.value=''; firstName.value=''; avatarPreview.src=''; delete avatarPreview.dataset.raw;
});

resetProfiles.addEventListener('click', (e)=>{
  e.preventDefault();
  if(confirm('Supprimer tous les profils locaux ?')){
    profiles = [];
    saveProfiles();
    renderProfiles();
  }
});

function renderProfiles(){
  profilesList.innerHTML = '';
  if(profiles.length === 0){
    profilesList.innerHTML = '<li class="card">Aucun utilisateur enregistré.</li>';
    return;
  }
  profiles.forEach(p=>{
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center;flex:1">
        <img src="${p.avatar || ''}" class="avatar" alt="avatar"/>
        <div style="min-width:0">
          <strong>${escapeHtml(p.firstName || '')} ${escapeHtml(p.lastName || '')}</strong>
          <div class="meta">ID : ${p.id}</div>
        </div>
      </div>
      <div class="actions">
        <button class="small-btn danger" data-id="${p.id}" data-act="del">Suppr</button>
      </div>
    `;
    profilesList.appendChild(li);
  });
}

// delegation for deleting profile
profilesList.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = Number(btn.dataset.id);
  if(confirm('Supprimer cet utilisateur ?')){
    profiles = profiles.filter(p=> p.id !== id);
    saveProfiles();
    renderProfiles();
  }
});

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// init
renderProfiles();
