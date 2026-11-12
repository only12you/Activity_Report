// 입력 화면 꾸미기 레이어: 렌더된 입력 화면(.step2.fm)에 카드·아이콘·하단 고정 바를 입힙니다 (기능/데이터는 그대로)
(function () {
  const svg = p => `<svg viewBox="0 0 24 24">${p}</svg>`;
  const IC = {
    bldg: svg('<path d="M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16M14 9h5a1 1 0 011 1v11M3 21h18M8 8h2M8 12h2M8 16h2"/>'),
    users: svg('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5.2a3 3 0 010 5.6M18 14.8c1.8.7 3 2.4 3 5.2"/>'),
    brief: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M3 13h18"/>'),
    clip: svg('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h4"/>'),
    hash: svg('<path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16"/>'),
    pin: svg('<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    ruler: svg('<path d="M3 16L16 3l5 5L8 21l-5-5zM7 12l2 2M10 9l2 2M13 6l2 2"/>'),
    home: svg('<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9zM10 21v-6h4v6"/>'),
    cal: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    layers: svg('<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"/>'),
    flag: svg('<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>'),
    coin: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.8c0-1 1.2-1.8 2.5-1.8s2.5.8 2.5 1.8-1.2 1.6-2.5 1.9-2.5.8-2.5 1.9S10.7 15.5 12 15.5s2.5-.7 2.5-1.7"/>'),
    dot: svg('<circle cx="12" cy="12" r="4"/>'),
    img: svg('<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>'),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>')
  };
  const pick = t => /사업부/.test(t) ? 'bldg' : /담당자|판촉 주체/.test(t) ? 'users' : /현장명|프로젝트|거래선명|거래처명|상품명/.test(t) ? 'brief' : /활동 내용/.test(t) ? 'clip' : /코드/.test(t) ? 'hash' : /소재지/.test(t) ? 'pin'
    : /시행사|설계사|시공사|감리|업체|매입처|매출처/.test(t) ? 'bldg' : /연면적/.test(t) ? 'ruler' : /주용도/.test(t) ? 'home' : /공사시작|공사종료|입찰|시기|기준월|납기|일$/.test(t) ? 'cal' : /지하|지상|^동$|세대/.test(t) ? 'layers' : /현공정|비고/.test(t) ? 'flag' : /금액|매출|매입|물량/.test(t) ? 'coin' : 'dot';
  const mk = cls => { const d = document.createElement('section'); d.className = 'sc ' + cls; return d; };
  function decorate(root) {
    if (!root || root.classList.contains('dz')) return;
    root.classList.add('dz');
    try {
      const q = s => root.querySelector(s);
      const top = q('.top'), h2 = top && top.querySelector('h2');
      if (top && h2) {
        top.classList.add('hd');
        top.insertAdjacentHTML('afterbegin', `<div class="hbg">${window.HERO_SVG || ''}</div>`);
        const tt = document.createElement('div'); tt.className = 'tt'; top.insertBefore(tt, h2); tt.appendChild(h2);
        tt.insertAdjacentHTML('beforeend', '<small>보고서 내용을 입력해 주세요</small>');
        const nw = q('#nw'); if (nw) { nw.textContent = '＋ 새로 작성'; top.appendChild(nw); }
      }
      const tb = Array.from(root.querySelectorAll(':scope > .tbox')), fb = q('.fbox');
      if (tb[0]) { tb[0].classList.add('tcard'); const lb = tb[0].querySelector('label'); if (lb) lb.innerHTML = `<i class="ic">${IC.info}</i>` + lb.textContent.replace(/^①\s*/, ''); }
      let after = fb || tb[0];
      if (tb[1]) {
        const st = tb[1].querySelector('.strip');
        if (st && !st.children.length) tb[1].remove();
        else { tb[1].classList.add('scard'); const lb = tb[1].querySelector('label'); if (lb) lb.textContent = lb.textContent.replace(/^②\s*/, ''); after = tb[1]; }
      }
      const kids = Array.from(root.children); let cur = null;
      kids.slice(kids.indexOf(after) + 1).forEach(n => {
        if (n.matches('.act, #xl, #msg')) return;
        if (n.matches('.note') && !cur) return;
        if (n.matches('details.mat')) { cur = null; const sc = mk('mat'); root.insertBefore(sc, n); sc.appendChild(n); return; }
        if (n.tagName === 'H4' && !(cur && n.hasAttribute('data-j'))) { cur = mk(''); root.insertBefore(cur, n); }
        if (!cur) { cur = mk(''); root.insertBefore(cur, n); }
        cur.appendChild(n);
      });
      const num = el => { el.innerHTML = el.innerHTML.replace(/^\s*(\d+)\)\s*/, '<i class="nb">$1</i>'); };
      root.querySelectorAll('.sc > h4').forEach(num);
      root.querySelectorAll('.sc.mat > details > summary').forEach(num);
      root.querySelectorAll('.sc label.photo').forEach(p => { p.style.margin = '8px 0'; });
      root.querySelectorAll('.fbox .fd > span, .sc > .fr > .fd > span').forEach(sp => { sp.innerHTML = `<i class="ic">${IC[pick(sp.textContent)]}</i>` + sp.innerHTML; });
      const msg = q('#msg'), pv = q('#pvb'), sv = q('#svb'), xl = q('#xl'), act = q('.act');
      const bar = document.createElement('div'); bar.className = 'bar';
      if (msg) bar.appendChild(msg);
      const br = document.createElement('div'); br.className = 'br'; bar.appendChild(br);
      if (pv) { pv.className = 'b2'; pv.textContent = '👁 미리보기'; br.appendChild(pv); }
      if (xl) { xl.className = 'b2'; xl.textContent = '📊 Excel'; br.appendChild(xl); }
      if (sv) { sv.className = 'b1'; sv.textContent = '✓ 저장하기'; br.appendChild(sv); }
      if (act) act.remove();
      root.appendChild(bar);
    } catch (e) { if (window.console) console.error('decorate', e); }
  }

  function redesignA(root) {
    const tbl = root.querySelector('table.ovt'); if (!tbl || root.classList.contains('ax')) return;
    try {
      root.classList.add('ax');
      const top = root.querySelector('.top'), tt = top && top.querySelector('.tt');
      if (tt) tt.innerHTML = '<div class="brand2"><b>COAT <em>ON</em></b><span>통합 도료 분석 프로그램</span></div>';
      const first = root.querySelector(':scope > .sc'); if (!first) return;
      const gbt = first.querySelector('.gbt'), ob = first.querySelector('.ovbtn'), ai = first.querySelector('#ai'), pv = first.querySelector('#pv'), rd = first.querySelector('#rd'), ovi = first.querySelector('.ovi');
      if (gbt) gbt.querySelectorAll('button').forEach(b => b.insertAdjacentHTML('afterbegin', `<i class="ic">${IC.bldg}</i>`));
      [gbt, ob, ai, pv, rd].forEach(x => { if (x) root.insertBefore(x, first); });
      const card = (title, ico) => { const s = document.createElement('section'); s.className = 'sc axc'; s.innerHTML = `<h4><i class="hi">${IC[ico]}</i>${title}</h4>`; return s; };
      const c1 = card('현장 정보', 'bldg'), c2 = card('공사 정보', 'clip'), c3 = card('현장 사진', 'img');
      const rows = Array.from(tbl.rows), cells = {}, order = [];
      for (let r = 0; r < rows.length; r += 2) Array.from(rows[r].cells).forEach((th, n) => {
        const td = rows[r + 1].cells[n], el = td.querySelector('[data-p]'), k = el ? el.dataset.p.replace(/^ov\./, '') : 'x' + r + n;
        cells[k] = { th, td, k, row: r / 2 }; order.push(k);
      });
      const lab = k => cells[k].th.textContent.trim();
      const body = k => { const tb = document.createElement('div'); tb.className = 'tb'; tb.innerHTML = `<span class="tk">${lab(k)}</span>`; const td = cells[k].td; while (td.firstChild) tb.appendChild(td.firstChild); return tb; };
      const tile = k => { const d = document.createElement('div'); d.className = 'tl'; d.innerHTML = `<i class="ic">${IC[pick(lab(k))]}</i>`; d.appendChild(body(k)); return d; };
      const split = (a, b) => { const d = document.createElement('div'); d.className = 'tl sp'; d.innerHTML = `<i class="ic">${IC[pick(lab(a))]}</i>`; d.appendChild(body(a)); d.appendChild(document.createElement('u')); d.appendChild(body(b)); return d; };
      const g1 = document.createElement('div'), g2 = document.createElement('div'); g1.className = g2.className = 'tg2';
      const party = ['dev', 'des', 'bld'].filter(k => cells[k]), pg = document.createElement('div'); pg.className = 'pg';
      const done = new Set();
      order.forEach(k => {
        if (done.has(k)) return; done.add(k);
        if (party.includes(k)) { pg.appendChild(tile(k)); return; }
        const tgt = cells[k].row < 2 ? g1 : g2;
        if (k === 'start' && cells.end) { done.add('end'); tgt.appendChild(split('start', 'end')); }
        else if (k === 'dong' && cells.hh) { done.add('hh'); tgt.appendChild(split('dong', 'hh')); }
        else tgt.appendChild(tile(k));
      });
      c1.appendChild(g1); if (party.length) c1.appendChild(pg); c2.appendChild(g2);
      const ph3 = document.createElement('div'); ph3.className = 'ph3';
      if (ovi) { const h = ovi.querySelector('.ovih'); if (h) h.remove(); ph3.appendChild(ovi); }
      ph3.insertAdjacentHTML('beforeend', '<div class="hint3">보고서 오른쪽에 출력됩니다<br>(이미지는 자동 조정됩니다)</div>');
      c3.appendChild(ph3);
      [c1, c2, c3].forEach(c => root.insertBefore(c, first));
      const mat = root.querySelector(':scope > .sc.mat');
      [root.querySelector(':scope > .tcard'), root.querySelector(':scope > .fbox')].forEach(x => { if (x) root.insertBefore(x, mat || first); });
      first.remove();
      const grow = el => { el.rows = 1; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; };
      root.querySelectorAll('.axc textarea').forEach(x => { if (!x.placeholder) x.placeholder = '-'; });
      const all = () => root.querySelectorAll('.axc textarea').forEach(grow); all(); setTimeout(all, 150);
      root.addEventListener('input', e => { if (e.target.matches('.axc textarea')) grow(e.target); });
    } catch (e) { if (window.console) console.error('redesignA', e); }
  }
  const app = document.getElementById('app');
  const run = () => { const r = app.querySelector('.step2.fm'); if (r) { decorate(r); redesignA(r); } };
  new MutationObserver(run).observe(app, { childList: true });
  run();
})();
