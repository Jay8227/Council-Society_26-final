/* Council Society 2026 — shared site behavior */

(function(){
  /* ---- mobile nav ----
     FIX: The .main-nav lives inside .site-header which has backdrop-filter.
     In WebKit (iOS Safari / Android Chrome), backdrop-filter creates a stacking
     context that breaks position:fixed on descendants, causing the nav to appear
     as a narrow partial panel instead of full-screen.
     SOLUTION: Move the nav element to be a direct child of <body> before wiring events.
  ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav    = document.querySelector('.main-nav');
  var siteHeader = document.querySelector('.site-header');

  // Portal the nav out of the header so it isn't clipped by backdrop-filter
  if(nav && siteHeader && siteHeader.contains(nav)){
    document.body.insertBefore(nav, siteHeader.nextSibling);
  }

  // Create backdrop for tap-outside-to-close
  var backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  function closeNav(){
    if(!nav) return;
    nav.classList.remove('open');
    if(toggle) toggle.classList.remove('is-open');
    if(toggle) toggle.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      backdrop.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeNav);
    });
    backdrop.addEventListener('click', closeNav);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && nav.classList.contains('open')) closeNav();
    });
  }

  /* ---- active nav link ---- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){ a.classList.add('active'); }
  });

  /* ---- scroll reveal ---- */
  var io = null;
  var revealEls = document.querySelectorAll('.reveal');

  function makeObserver(){
    if(!('IntersectionObserver' in window)) return null;
    return new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  }

  if('IntersectionObserver' in window && revealEls.length){
    io = makeObserver();
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* Global helper — call this after dynamically inserting .reveal elements
     so they get registered with the intersection observer.
     Usage:  window.observeReveal(container.querySelectorAll('.reveal'));  */
  window.observeReveal = function(els){
    if(!els || !els.length) return;
    if(io){
      els.forEach(function(el){ if(!el.classList.contains('in')) io.observe(el); });
    } else {
      els.forEach(function(el){ el.classList.add('in'); });
    }
  };

  /* ---- footer year ---- */
  document.querySelectorAll('.js-year').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* ---- sticky header shadow on scroll ---- */
  var header = document.querySelector('.site-header');
  if(header){
    window.addEventListener('scroll', function(){
      header.style.boxShadow = window.scrollY > 8 ? 'var(--shadow-sm)' : 'none';
    }, { passive: true });
  }
})();

/* ==========================================================================
   The Constellation — signature hero graphic
   Renders the Core Council with the eight Domain Circles orbiting it,
   connected by lateral links that pulse to suggest continuous exchange.
   ========================================================================== */
function renderConstellation(containerId){
  var el = document.getElementById(containerId);
  if(!el) return;

  var domains = [
    {name:'Climate & Environment', color:'#5FB3A6'},
    {name:'Health & Medicine', color:'#5FB3A6'},
    {name:'Technology, AI & Data', color:'#5FB3A6'},
    {name:'Education', color:'#5FB3A6'},
    {name:'Economics & Policy', color:'#5FB3A6'},
    {name:'Psychology & Mental Health', color:'#5FB3A6'},
    {name:'Philosophy & Ethics', color:'#5FB3A6'},
    {name:'Social Systems & Culture', color:'#5FB3A6'}
  ];

  var W = 560, H = 560, cx = W/2, cy = H/2, R = 210;
  var ns = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('role','img');
  svg.setAttribute('aria-label','Diagram of the Core Council connected to eight Domain Circles');

  var positions = domains.map(function(d,i){
    var angle = (Math.PI*2/domains.length)*i - Math.PI/2;
    return { x: cx + R*Math.cos(angle), y: cy + R*Math.sin(angle), angle: angle, d:d };
  });

  function add(tag, attrs, parent){
    var n = document.createElementNS(ns, tag);
    for(var k in attrs){ n.setAttribute(k, attrs[k]); }
    (parent||svg).appendChild(n);
    return n;
  }

  // outer faint ring
  add('circle', { cx:cx, cy:cy, r:R, class:'const-core-ring' });

  // static links (core to each node) + lateral links (node to neighboring node)
  positions.forEach(function(p){
    add('line', { x1:cx, y1:cy, x2:p.x, y2:p.y, class:'const-link' });
  });
  positions.forEach(function(p, i){
    var next = positions[(i+1)%positions.length];
    add('path', {
      d:'M '+p.x+' '+p.y+' Q '+cx+' '+cy+' '+next.x+' '+next.y,
      class:'const-link-pulse'
    });
  });

  // core
  add('circle', { cx:cx, cy:cy, r:30, class:'const-core' });
  var coreLabel = add('text', { x:cx, y:cy+4, 'text-anchor':'middle', class:'core-label' });
  coreLabel.style.font = '600 10px IBM Plex Mono, monospace';
  coreLabel.style.fill = '#0B1622';
  coreLabel.textContent = 'CORE';

  // nodes
  positions.forEach(function(p){
    var g = add('g', { class:'const-node', tabindex:'0', role:'img', 'aria-label':p.d.name });
    add('circle', { cx:p.x, cy:p.y, r:4.5, class:'node-dot' }, g);
    var labelX = cx + (R+26)*Math.cos(p.angle);
    var labelY = cy + (R+26)*Math.sin(p.angle);
    var anchor = Math.cos(p.angle) > 0.3 ? 'start' : (Math.cos(p.angle) < -0.3 ? 'end' : 'middle');
    var words = p.d.name.split(' ');
    var t = add('text', { x:labelX, y:labelY, 'text-anchor':anchor }, g);
    var line1 = words.slice(0, Math.ceil(words.length/2)).join(' ');
    var line2 = words.slice(Math.ceil(words.length/2)).join(' ');
    var tspan1 = document.createElementNS(ns,'tspan');
    tspan1.setAttribute('x', labelX); tspan1.textContent = line1;
    t.appendChild(tspan1);
    if(line2){
      var tspan2 = document.createElementNS(ns,'tspan');
      tspan2.setAttribute('x', labelX); tspan2.setAttribute('dy', '12'); tspan2.textContent = line2;
      t.appendChild(tspan2);
    }
  });

  el.innerHTML = '';
  el.appendChild(svg);
}
