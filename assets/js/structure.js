/* Council Society 2026 — Interactive Structure
   Renders an expandable/collapsible hierarchy from STRUCTURE + GUARDIAN
   (see structure-data.js) with live search filtering. */

(function(){

  var root = document.getElementById('structure-tree');
  var guardianRoot = document.getElementById('guardian-card');
  var flowRoot = document.getElementById('authority-flow');
  var searchInput = document.getElementById('structure-search');
  var searchCount = document.getElementById('structure-search-count');
  var expandAllBtn = document.getElementById('expand-all');
  var collapseAllBtn = document.getElementById('collapse-all');

  if(!root) return;

  function norm(s){ return (s||'').toLowerCase(); }

  function matches(node, q){
    if(!q) return true;
    return norm(node.title).indexOf(q) > -1 || norm(node.description).indexOf(q) > -1 || norm(node.subtitle).indexOf(q) > -1;
  }

  function highlight(text, q){
    if(!q) return text;
    var idx = norm(text).indexOf(q);
    if(idx === -1) return text;
    return text.slice(0,idx) + '<mark>' + text.slice(idx, idx+q.length) + '</mark>' + text.slice(idx+q.length);
  }

  function childRow(child, q){
    var show = !q || matches(child, q);
    var visible = show ? '' : ' style="display:none"';
    if(child.isNote){
      return '<div class="struct-note"'+visible+'><strong>'+highlight(child.title,q)+'.</strong> '+highlight(child.description,q)+'</div>';
    }
    return (
      '<div class="struct-child"'+visible+'>'+
        '<div class="struct-child-dot"></div>'+
        '<div>'+
          '<h4>'+highlight(child.title, q)+'</h4>'+
          '<p>'+highlight(child.description, q)+'</p>'+
        '</div>'+
      '</div>'
    );
  }

  function layerCard(layer, idx){
    var childrenHtml = (layer.children||[]).map(function(c){ return childRow(c, ''); }).join('');
    return (
      '<article class="struct-layer" data-id="'+layer.id+'" data-color="'+layer.color+'">'+
        '<button class="struct-header" aria-expanded="false" aria-controls="panel-'+layer.id+'">'+
          '<div class="struct-header-left">'+
            '<span class="struct-num">'+(idx+1)+'</span>'+
            '<div>'+
              '<span class="struct-label">'+layer.label+'</span>'+
              '<h3>'+layer.title+'</h3>'+
              '<span class="struct-subtitle">'+layer.subtitle+'</span>'+
            '</div>'+
          '</div>'+
          '<span class="struct-chevron" aria-hidden="true">+</span>'+
        '</button>'+
        '<div class="struct-panel" id="panel-'+layer.id+'" role="region">'+
          '<p class="struct-role">'+layer.role+'</p>'+
          '<p class="struct-desc">'+layer.description+'</p>'+
          '<div class="struct-children">'+childrenHtml+'</div>'+
        '</div>'+
      '</article>'
    );
  }

  function render(){
    root.innerHTML = STRUCTURE.map(layerCard).join('');

    if(guardianRoot){
      guardianRoot.innerHTML = (
        '<span class="struct-label">'+GUARDIAN.label+'</span>'+
        '<h3>'+GUARDIAN.title+'</h3>'+
        '<span class="struct-subtitle">'+GUARDIAN.subtitle+'</span>'+
        '<p class="struct-role" style="margin-top:14px;">'+GUARDIAN.role+'</p>'+
        '<p class="struct-desc">'+GUARDIAN.description+'</p>'
      );
    }

    if(flowRoot){
      flowRoot.innerHTML = AUTHORITY_FLOW.map(function(step, i){
        return '<div class="flow-step">'+
          '<span class="flow-num">'+(i+1)+'</span><span>'+step+'</span>'+
          (i < AUTHORITY_FLOW.length-1 ? '<span class="flow-arrow" aria-hidden="true">\u2193</span>' : '')+
        '</div>';
      }).join('');
    }

    root.querySelectorAll('.struct-header').forEach(function(btn){
      btn.addEventListener('click', function(){
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        panel.style.maxHeight = expanded ? null : panel.scrollHeight + 'px';
        btn.closest('.struct-layer').classList.toggle('open', !expanded);
      });
    });
  }

  function setAll(open){
    root.querySelectorAll('.struct-header').forEach(function(btn){
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : null;
      btn.closest('.struct-layer').classList.toggle('open', open);
    });
  }

  function runSearch(){
    var q = norm(searchInput.value.trim());
    var totalMatches = 0;

    root.querySelectorAll('.struct-layer').forEach(function(layerEl){
      var layer = STRUCTURE.filter(function(l){ return l.id === layerEl.dataset.id; })[0];
      var layerSelfMatch = matches(layer, q);
      var childMatches = 0;

      var childEls = layerEl.querySelectorAll('.struct-child, .struct-note');
      childEls.forEach(function(childEl, i){
        var child = (layer.children||[])[i];
        var show = !q || layerSelfMatch || matches(child, q);
        if(!q){
          // restore plain text (remove old highlight markup) and show
          childEl.style.display = '';
          var titleEl = childEl.querySelector('h4');
          var descEl = childEl.querySelector('p');
          if(titleEl) titleEl.innerHTML = child.title;
          if(descEl) descEl.innerHTML = child.description;
          if(childEl.classList.contains('struct-note')){ childEl.innerHTML = '<strong>'+child.title+'.</strong> '+child.description; }
          return;
        }
        if(show && matches(child,q)) childMatches++;
        childEl.style.display = show ? '' : 'none';
        if(show){
          var t2 = childEl.querySelector('h4');
          var d2 = childEl.querySelector('p');
          if(t2) t2.innerHTML = highlight(child.title, q);
          if(d2) d2.innerHTML = highlight(child.description, q);
          if(childEl.classList.contains('struct-note')){ childEl.innerHTML = '<strong>'+highlight(child.title,q)+'.</strong> '+highlight(child.description,q); }
        }
      });

      var layerVisible = !q || layerSelfMatch || childMatches > 0;
      layerEl.style.display = layerVisible ? '' : 'none';

      if(q && layerVisible){
        var btn = layerEl.querySelector('.struct-header');
        var panel = layerEl.querySelector('.struct-panel');
        btn.setAttribute('aria-expanded','true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        layerEl.classList.add('open');
        totalMatches += (layerSelfMatch ? 1 : 0) + childMatches;
      }
    });

    if(searchCount){
      searchCount.textContent = q ? (totalMatches + ' match' + (totalMatches===1?'':'es') + ' for \u201c'+searchInput.value.trim()+'\u201d') : '';
    }
  }

  render();
  if(searchInput){ searchInput.addEventListener('input', runSearch); }
  if(expandAllBtn){ expandAllBtn.addEventListener('click', function(){ setAll(true); }); }
  if(collapseAllBtn){ collapseAllBtn.addEventListener('click', function(){ setAll(false); }); }

})();
