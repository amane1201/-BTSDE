const members = [
  {
    name: "総統",
    role: "president",
    description: "連邦の創設者にして最終決定権者。全てを破壊する者。",
    icon: "assets/members/やまだ.JPG",
  },
  {
    name: "幹部",
    role: "executives",
    description: "総統の右腕。",
    icon: "assets/members/さ.png",
  },
  {
    name: "幹部",
    role: "executives",
    description: "総統の右腕。",
    icon: "assets/members/み.png",
  },
];

const FALLBACK_NEWS = [
  { date: "2026-04-30", title: "公式サイト公開", content: "連邦の活動を地上に開示する。本サイトは公式通信回線として機能する。" },
  { date: "2026-04-30", title: "帝国再編", content: "連邦から帝国に再編をした。" },
];

let allNews = [];
let newsDisplayCount = 5;

function initBoot(){
  const screen = document.getElementById('boot-screen');
  const log = document.getElementById('boot-log');
  const bar = document.getElementById('boot-bar-fill');
  const status = document.getElementById('boot-status');
  if(!screen) return Promise.resolve();

  const lines = [
    ["[0.01]", "ESTABLISHING SECURE CHANNEL..."],
    ["[0.12]", "HANDSHAKE // TK-HKR-FED-01"],
    ["[0.28]", "<b>AUTH GRANTED</b>"],
    ["[0.41]", "LOADING DOCTRINE v2.1"],
    ["[0.63]", "DECRYPTING MEMBER ROSTER..."],
    ["[0.82]", "SYNCING TRANSMISSIONS..."],
    ["[0.97]", "<b>READY</b> <i>// WELCOME, OPERATIVE.</i>"]
  ];

  return new Promise(resolve=>{
    let i=0;
    const step=()=>{
      if(i>=lines.length){
        bar.style.width='100%';
        status.textContent='BOOT SEQUENCE COMPLETE';
        setTimeout(()=>{
          screen.classList.add('hidden');
          setTimeout(resolve,500);
        },420);
        return;
      }
      const [t,msg]=lines[i];
      log.innerHTML += `<span style="color:#ff6680">${t}</span> ${msg}\n`;
      bar.style.width = Math.round(((i+1)/lines.length)*100)+'%';
      i++;
      setTimeout(step, 180 + Math.random()*180);
    };
    step();
  });
}

function initHeader(){
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll',()=>{
    if(window.scrollY>40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });
  toggle.addEventListener('click',()=>{
    toggle.classList.toggle('open');
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    toggle.classList.remove('open');
    nav.classList.remove('open');
  }));
}

function renderMembers(){
  const grid = document.getElementById('members-grid');
  grid.innerHTML = '';
  members.forEach((m,idx)=>{
    const card = document.createElement('article');
    card.className='member-card reveal';
    card.style.transitionDelay = (idx*60)+'ms';
    card.innerHTML = `
      <div class="member-avatar">
        <img src="${m.icon}" alt="${m.name}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23180309%22/><text x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23ff1a2e%22 font-family=%22monospace%22>✕</text></svg>';">
      </div>
      <div class="member-role">${m.role}</div>
      <div class="member-name">${m.name}</div>
      <div class="member-desc">${m.description}</div>
    `;
    card.addEventListener('click',()=>openMemberModal(m));
    grid.appendChild(card);
  });
  const counter = document.getElementById('unit-count');
  if(counter){
    animateNumber(counter, members.length, 1200, '');
  }
  observeReveals();
}

function openMemberModal(m){
  const modal = document.getElementById('member-modal');
  const body = document.getElementById('modal-body');
  const stats = m.stats || {};
  body.innerHTML = `
    <div class="modal-avatar">
      <img src="${m.icon}" alt="${m.name}" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23180309%22/><text x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23ff1a2e%22 font-family=%22monospace%22>✕</text></svg>';">
    </div>
    <div class="modal-name">${m.name}</div>
    <div class="modal-desc">${m.description}</div>
    </div>
  `;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  const modal = document.getElementById('member-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}
function initModal(){
  const modal = document.getElementById('member-modal');
  modal.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape') closeModal();
  });
}

async function loadNews(){
  const track = document.getElementById('news-track');
  try{
    const res = await fetch('news.json',{cache:'no-store'});
    if(!res.ok) throw new Error('bad response');
    const data = await res.json();
    if(!Array.isArray(data) || data.length===0) throw new Error('empty');
    allNews = data;
  }catch(err){
    allNews = FALLBACK_NEWS;
  }
  allNews.sort((a,b)=> new Date(b.date) - new Date(a.date));
  renderNews();
}

function renderNews(){
  const track = document.getElementById('news-track');
  const list = allNews.slice(0, newsDisplayCount);
  track.innerHTML = '';
  if(list.length===0){
    track.innerHTML = '<div class="news-loading">NO TRANSMISSION FOUND.</div>';
    return;
  }
  list.forEach((n,i)=>{
    const c = document.createElement('article');
    c.className = 'news-card reveal';
    c.style.transitionDelay = (i*70)+'ms';
    const d = formatDate(n.date);
    c.innerHTML = `
      <div class="news-date">${d}</div>
      <div class="news-title">${escapeHTML(n.title||'(無題)')}</div>
      <div class="news-content">${escapeHTML(n.content||'')}</div>
    `;
    track.appendChild(c);
  });
  observeReveals();

  const moreBtn = document.getElementById('news-more');
  if(moreBtn){
    if(newsDisplayCount >= allNews.length){
      moreBtn.style.display = 'none';
    }else{
      moreBtn.style.display = '';
    }
  }
}

function initNewsControls(){
  const track = document.getElementById('news-track');
  document.getElementById('news-prev').addEventListener('click',()=>{
    track.scrollBy({left:-track.clientWidth*0.8,behavior:'smooth'});
  });
  document.getElementById('news-next').addEventListener('click',()=>{
    track.scrollBy({left:track.clientWidth*0.8,behavior:'smooth'});
  });
  document.getElementById('news-more').addEventListener('click',()=>{
    newsDisplayCount += 5;
    renderNews();
    showToast('SIGNAL','追加通達を受信しました。','fa-satellite');
  });
}

function formatDate(s){
  if(!s) return '----.--.--';
  const d = new Date(s);
  if(isNaN(d)) return s;
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const da = String(d.getDate()).padStart(2,'0');
  return `${y}.${m}.${da}`;
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

function animateNumber(el, target, duration=1400, suffix=''){
  const start = performance.now();
  const from = 0;
  const step = (now)=>{
    const p = Math.min((now-start)/duration,1);
    const eased = 1 - Math.pow(1-p,3);
    const val = Math.floor(from + (target-from)*eased);
    el.textContent = val.toLocaleString() + suffix;
    if(p<1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + suffix;
  };
  requestAnimationFrame(step);
}

function observeReveals(){
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if(!('IntersectionObserver' in window)){
    els.forEach(e=>e.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  },{threshold:.15});
  els.forEach(e=>io.observe(e));
}

function observeStats(){
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if(!('IntersectionObserver' in window)){
    nums.forEach(n=>animateNumber(n, +n.dataset.target, 1400, n.dataset.suffix||''));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        animateNumber(en.target, +en.target.dataset.target, 1600, en.target.dataset.suffix||'');
        io.unobserve(en.target);
      }
    });
  },{threshold:.4});
  nums.forEach(n=>io.observe(n));
}

function initParticles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,particles=[];
  const resize=()=>{
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth+'px';
    canvas.style.height = window.innerHeight+'px';
  };
  resize();
  window.addEventListener('resize',resize);

  const count = Math.min(70, Math.floor(window.innerWidth/18));
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: (Math.random()*1.6+.4)*devicePixelRatio,
      vx: (Math.random()-.5)*.3*devicePixelRatio,
      vy: (Math.random()-.5)*.3*devicePixelRatio,
      a: Math.random()*.7+.3,
      hue: Math.random()<.75 ? 355 : (Math.random()<.5?310:270)
    });
  }
  const tick=()=>{
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
      grad.addColorStop(0,`hsla(${p.hue},100%,60%,${p.a})`);
      grad.addColorStop(1,`hsla(${p.hue},100%,60%,0)`);
      ctx.fillStyle = grad;
      ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  };
  tick();
}

function initFooter(){
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
  const node = document.getElementById('node-id');
  if(node){
    const id = Array.from({length:6},()=>Math.floor(Math.random()*16).toString(16).toUpperCase()).join('');
    node.textContent = 'TK-'+id;
  }
  const up = document.getElementById('uptime');
  if(up){
    const start = Date.now();
    setInterval(()=>{
      const s = Math.floor((Date.now()-start)/1000);
      const hh = String(Math.floor(s/3600)).padStart(2,'0');
      const mm = String(Math.floor((s%3600)/60)).padStart(2,'0');
      const ss = String(s%60).padStart(2,'0');
      up.textContent = `${hh}:${mm}:${ss}`;
    },1000);
  }
}

function showToast(title, msg, icon='fa-triangle-exclamation'){
  const wrap = document.getElementById('toast-wrap');
  if(!wrap) return;
  const el = document.createElement('div');
  el.className='toast';
  el.innerHTML = `<i class="fa-solid ${icon}"></i><div><b>${title}</b><span>${msg}</span></div>`;
  wrap.appendChild(el);
  setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),300);},5000);
}

function initFakeToasts(){
  const messages = [
    ['important','荒らし','fa-user-plus'],
  ];
  let i=0;
  setTimeout(()=>showToast(...messages[i++ % messages.length]), 3800);
  setInterval(()=>{
    if(document.hidden) return;
    showToast(...messages[i++ % messages.length]);
  }, 14000);
}

function initHackButton(){
  const btn = document.getElementById('hack-btn');
  if(!btn) return;
  btn.addEventListener('click',()=>{
    const original = btn.innerHTML;
    btn.disabled = true;
    const frames = [
      '> initiating contact...',
      '> scanning handshake_____',
      '> bypassing firewall ▓▓▓░░',
      '> bypassing firewall ▓▓▓▓▓',
      '> channel OPEN',
      '> welcome, operative.'
    ];
    let i=0;
    const t = setInterval(()=>{
      if(i>=frames.length){
        clearInterval(t);
        btn.innerHTML = '<i class="fa-solid fa-check"></i> CHANNEL ESTABLISHED';
        showToast('CONTACT','連邦との接続が確立されました。','fa-satellite-dish');
        setTimeout(()=>{btn.innerHTML=original;btn.disabled=false;},2400);
        return;
      }
      btn.innerHTML = `<i class="fa-solid fa-terminal"></i> ${frames[i++]}`;
    },420);
  });
}

function initGlitchScramble(){
  const title = document.querySelector('.hero-title .glitch');
  if(!title) return;
  const original = title.textContent;
  const chars = '#$%&*@!?01XYZΣΞΔ破壊主義';
  let locked = true;
  const scramble = ()=>{
    if(!locked) return;
    let out = '';
    for(let i=0;i<original.length;i++){
      out += Math.random()<.15 ? chars[Math.floor(Math.random()*chars.length)] : original[i];
    }
    title.textContent = out;
    title.setAttribute('data-text', out);
  };
  setInterval(()=>{
    if(Math.random()<.25){
      locked=true;
      let count=0;
      const t = setInterval(()=>{
        scramble();
        count++;
        if(count>4){
          clearInterval(t);
          title.textContent = original;
          title.setAttribute('data-text', original);
        }
      },60);
    }
  },4200);
}

document.addEventListener('DOMContentLoaded', async ()=>{
  initParticles();
  initHeader();
  initFooter();
  initModal();
  initNewsControls();
  initHackButton();

  renderMembers();
  observeReveals();
  observeStats();

  await initBoot();

  loadNews();
  initFakeToasts();
  initGlitchScramble();
});
