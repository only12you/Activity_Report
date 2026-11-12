(function () {
  const T = window.ACTIVITY_TYPES, I = window.ICONS;
  const $ = (s, r = document) => r.querySelector(s);
  const app = $('#app');
  const state = { tab: 'major', major: null, sub: null, screen: 'home', step: 1 };
  const shut = new Set();

  const key = 'activity-report-state-v1';
  try { Object.assign(state, JSON.parse(localStorage.getItem(key) || '{}'), { screen: 'home', step: 1 }); } catch (e) {}
  const save = () => { try { localStorage.setItem(key, JSON.stringify({ tab: state.tab, major: state.major, sub: state.sub })); } catch (e) {} };

  const find = c => T.find(t => t.code === c);
  const subCode = (t, i) => t.code + (i + 1);
  const titleOf = (t, i) => t.direct
    ? `${t.code}. ${t.title} : [사업부] 활동 내용 [담당자]`
    : `${subCode(t, i)}. ${t.title} : [사업부] 현장명_활동 내용 [담당자]`;

  function subSummary() {
    const a = find('A').subs.slice(0, 3), b = find('B').subs.slice(0, 3);
    const li = (arr, c) => arr.map((s, i) => `<li><span class="dot" style="--d:${c}"></span>${i + 1}. ${s}</li>`).join('');
    return `<section class="subbox">
      <div class="hd">${I.cube}<b>서브유형 표준</b><small>세부 유형을 선택하세요</small><button class="all" id="all">전체보기 ${I.chev}</button></div>
      <div class="bd"><ul>${li(a, '#2f6df0')}</ul><ul>${li(b, '#e60012')}</ul></div></section>`;
  }

  function listAll() {
    return T.filter(t => !t.direct).map(t => `
      <div class="sec-h" style="margin-top:14px"><b style="font-size:19px">${t.code}. ${t.name}</b><span class="ln"></span></div>
      ${t.subs.map((s, i) => `<button class="opt${!window.READY.has(subCode(t, i)) ? ' todo' : ''}${state.major === t.code && state.sub === i ? ' sel' : ''}" data-code="${t.code}" data-i="${i}"><b>${subCode(t, i)}</b>${s}</button>`).join('')}`).join('');
  }

  const DESC = {
    A1: '건축 현장의 판촉 및 영업활동을 관리합니다.', A2: '재도장 현장에서의 영업활동을 관리합니다.', A3: '정비사업 현장의 영업활동을 관리합니다.',
    B1: '신규 거래처 개설 및 판촉 활동을 관리합니다.', B2: '기존 거래처의 재거래 활동을 관리합니다.', B3: '조달 수주업체 대상 판촉 활동을 관리합니다.', B4: '기존 거래처의 점유 확대 활동을 관리합니다.',
    C1: '프로젝트 상품 소싱 활동을 관리합니다.', C2: '매입처 다변화 활동을 관리합니다.', C3: '전략 상품 판매 확대 활동을 관리합니다.',
    D1: '거래처 간 교차 판매 활동을 관리합니다.', D2: '현장과 연계한 교차 판매 활동을 관리합니다.',
    E1: '내외장재 사업부의 중점 운영 활동을 관리합니다.', E2: '보온재 사업부의 중점 운영 활동을 관리합니다.', E3: '창호/수주 사업부의 중점 운영 활동을 관리합니다.', E4: '유통도료 사업부의 중점 운영 활동을 관리합니다.', E5: '공업 사업부의 중점 운영 활동을 관리합니다.',
    F1: '시스템 개선 건의사항을 관리합니다.', F2: '판촉/홍보 지원 건의사항을 관리합니다.', F3: '품질·물류·수급 개선 건의사항을 관리합니다.', F4: '단가 지원 건의사항을 관리합니다.',
    G1: '제품 개선 및 개발 활동을 관리합니다.', G2: '신규 상품 도입 활동을 관리합니다.',
    H1: '실적 분석 및 운영 계획을 보고합니다.', H2: '채권 관리 현황을 보고합니다.', H3: '재고 관리 현황을 보고합니다.', H4: '출장 결과를 보고합니다.', H5: '시장 및 경쟁사 주요 정보를 보고합니다.', H6: '직판 수주 현황을 보고합니다.'
  };
  const descOf = (t, i) => DESC[subCode(t, i)] || `${t.subs[i]} 활동을 관리합니다.`;
  function groupCards() {
    return T.map(t => {
      const rows = t.direct
        ? `<button class="gr${state.major === t.code ? ' sel' : ''}" data-code="${t.code}" data-i=""><i class="gbd">${t.code}</i><span class="gt"><b>${t.title}</b><small>활동 내용을 바로 작성합니다.</small></span><i class="gk">${I.check}</i></button>`
        : t.subs.map((s, i) => `<button class="gr${!window.READY.has(subCode(t, i)) ? ' todo' : ''}${state.major === t.code && state.sub === i ? ' sel' : ''}" data-code="${t.code}" data-i="${i}"><i class="gbd">${subCode(t, i)}</i><span class="gt"><b>${s}</b><small>${descOf(t, i)}</small></span><i class="gk">${I.check}</i></button>`).join('');
      return `<section class="gc${shut.has(t.code) ? ' shut' : ''}" data-code="${t.code}"><button class="gh" type="button"><b>${t.code}. ${t.name}</b><span class="gn">${t.direct ? '바로 작성' : t.subs.length + '개'}</span>${I.chev.replace('<svg', '<svg class="gv"')}</button><div class="gb">${rows}</div></section>`;
    }).join('');
  }

  const HERO2 = `<svg class="art" viewBox="0 0 390 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2=".9"><stop offset="0" stop-color="#0a3bc0"/><stop offset=".55" stop-color="#1f66e8"/><stop offset="1" stop-color="#63a6f8"/></linearGradient><linearGradient id="gl" x1="0" x2="1"><stop offset="0" stop-color="#86b4f3"/><stop offset="1" stop-color="#d4e7ff"/></linearGradient><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#06278f" stop-opacity=".55"/><stop offset=".75" stop-color="#06278f" stop-opacity="0"/></linearGradient><pattern id="wd" width="6" height="7" patternUnits="userSpaceOnUse"><rect x="1" y="1.2" width="3.6" height="4.4" fill="#eef6ff" opacity=".85"/></pattern></defs><rect width="390" height="150" fill="url(#hg)"/><rect width="390" height="150" fill="url(#sh)"/><ellipse cx="70" cy="34" rx="90" ry="26" fill="#fff" opacity=".08"/><ellipse cx="300" cy="24" rx="84" ry="18" fill="#fff" opacity=".1"/><g id="bl"><rect x="236" y="62" width="28" height="100" fill="url(#gl)"/><rect x="268" y="30" width="38" height="130" fill="url(#gl)"/><rect x="310" y="66" width="28" height="100" fill="url(#gl)"/><rect x="342" y="44" width="34" height="120" fill="url(#gl)"/><rect x="378" y="74" width="22" height="90" fill="url(#gl)"/></g><use href="#bl" fill="url(#wd)"/><g fill="url(#wd)"><rect x="236" y="62" width="28" height="100"/><rect x="268" y="30" width="38" height="130"/><rect x="310" y="66" width="28" height="100"/><rect x="342" y="44" width="34" height="120"/><rect x="378" y="74" width="22" height="90"/></g><path d="M0 140c90-12 170-6 390-22v40H0z" fill="#2e8a4e" opacity=".5"/><g transform="rotate(-32 30 70)" fill="#fff" opacity=".4"><rect x="-10" y="48" width="60" height="20" rx="9"/><rect x="16" y="66" width="7" height="34" rx="3"/></g></svg>`;
  const V2 = {
    A: ['현장 방문 및 판촉 활동', '<rect x="8" y="22" width="12" height="22" fill="#2f6df0"/><rect x="22" y="14" width="14" height="30" fill="#4a82f2"/><rect x="38" y="26" width="12" height="18" fill="#7aa2f6"/><path d="M14 20V6h22M30 6v8M16 6l-6 6" stroke="#1e5be6" stroke-width="2.4" fill="none"/><g fill="#fff"><rect x="10" y="26" width="3" height="3"/><rect x="15" y="26" width="3" height="3"/><rect x="25" y="19" width="3" height="3"/><rect x="30" y="19" width="3" height="3"/><rect x="25" y="25" width="3" height="3"/><rect x="30" y="25" width="3" height="3"/></g><rect x="4" y="44" width="52" height="2.5" fill="#1e5be6"/>'],
    B: ['거래처 방문 및 관리', '<path d="M6 16l12-4 10 8-8 10-10-6z" fill="#1e5be6"/><path d="M58 16l-12-4-10 8 8 10 10-6z" fill="#2f6df0"/><path d="M20 20l12-8 12 8-8 14-8 4-8-6z" fill="#5b8def"/><path d="M26 30l6 5 8-7" stroke="#fff" stroke-width="2" fill="none"/>'],
    C: ['제품 판매 확대 활동', '<rect x="10" y="30" width="9" height="14" fill="#5b8def"/><rect x="24" y="22" width="9" height="22" fill="#2f6df0"/><rect x="38" y="12" width="9" height="32" fill="#1e5be6"/><path d="M8 24L24 12l10 6 22-12" stroke="#2f6df0" stroke-width="3" fill="none"/><path d="M48 4h10v10z" fill="#2f6df0"/>'],
    D: ['제품 간 연계 영업', '<path d="M16 24L32 10l16 14-16 14z" stroke="#7aa2f6" stroke-width="3" fill="none"/><circle cx="16" cy="24" r="8" fill="#2f6df0"/><circle cx="32" cy="10" r="7" fill="#1e5be6"/><circle cx="48" cy="24" r="8" fill="#2f6df0"/><circle cx="32" cy="38" r="7" fill="#1e5be6"/>'],
    E: ['사업부별 운영 활동', '<circle cx="32" cy="14" r="7" fill="#1e5be6"/><path d="M19 42c0-9 6-14 13-14s13 5 13 14z" fill="#1e5be6"/><circle cx="14" cy="20" r="5.5" fill="#5b8def"/><path d="M4 42c0-7 4-11 10-11 2 0 4 .6 5 1.6-3 3-4 6.6-4 9.4z" fill="#5b8def"/><circle cx="50" cy="20" r="5.5" fill="#5b8def"/><path d="M60 42c0-7-4-11-10-11-2 0-4 .6-5 1.6 3 3 4 6.6 4 9.4z" fill="#5b8def"/>'],
    F: ['건의 및 지원 활동', '<rect x="14" y="4" width="28" height="38" rx="3" fill="#2f6df0"/><path d="M20 14h16M20 20h16M20 26h10" stroke="#fff" stroke-width="2"/><path d="M34 40l14-18 6 5-14 18-8 2z" fill="#1e5be6" stroke="#fff" stroke-width="1.5"/>'],
    G: ['신제품 개발 및 도입', '<path d="M32 4a14 14 0 00-8 25c2 2 2 4 2 6h12c0-2 0-4 2-6A14 14 0 0032 4z" fill="#2f6df0"/><rect x="26" y="37" width="12" height="4" rx="2" fill="#1e5be6"/><rect x="28" y="42" width="8" height="3" rx="1.5" fill="#1e5be6"/><g stroke="#5b8def" stroke-width="2.6" stroke-linecap="round"><path d="M10 14l5 3M54 14l-5 3M6 28h6M52 28h6"/></g>'],
    H: ['보고 및 제안 활동', '<rect x="16" y="3" width="30" height="40" rx="3" fill="#2f6df0"/><path d="M22 12h18M22 18h18M22 24h10" stroke="#fff" stroke-width="2"/><g fill="#9dbcf7"><rect x="23" y="32" width="4" height="7"/><rect x="30" y="28" width="4" height="11"/><rect x="37" y="30" width="4" height="9"/></g>'],
    I: ['지점장 주관 활동', '<circle cx="32" cy="13" r="9" fill="#1e5be6"/><path d="M10 44c0-12 9-19 22-19s22 7 22 19z" fill="#2f6df0"/><path d="M28 27l4 8 4-8" fill="#fff"/><path d="M32 33l-2 9h4z" fill="#1e5be6"/>']
  };
  const STEPS = ['활동 유형', '세부 선택', '정보 입력', '보고서 생성'];
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

  function cardHTML(t) {
    const v = V2[t.code] || ['', ''];
    return `<button class="tc${state.major === t.code ? ' sel' : ''}" data-code="${t.code}">
      <i class="bd">${t.code}</i><i class="tk">${I.check}</i>
      <div class="ic"><svg viewBox="0 0 64 48" aria-hidden="true">${v[1]}</svg></div>
      <div class="tn">${t.name}</div><div class="td">${v[0]}</div><span class="go">${I.chev}</span>
    </button>`;
  }

  function home() {
    app.className = 'v2';
    const s = state.step === 2 && state.major ? 2 : 1, t0 = find(state.major);
    const total = T.filter(t => !t.direct).reduce((n, t) => n + t.subs.length, 0);
    const picked = s === 2 && t0 && state.sub != null && !t0.direct ? `${subCode(t0, state.sub)} ${t0.subs[state.sub]}` : '';
    app.innerHTML = `
      <header class="h2">${HERO2}
        <div class="brand"><b>COAT ON</b><span>Activity Report</span></div>
        <div class="tools"><button id="cls" aria-label="활동 분류표">${I.bars}</button><button id="arch" aria-label="보고서 보관함">${I.doc}</button><button id="gear" aria-label="설정">${I.gear}</button></div>
        <div class="ttl"><h1>${s === 1 ? '활동 유형 설정' : '세부 유형 선택'}</h1><p>${s === 1 ? '활동 목적을 선택하시면<br>해당 양식으로 보고서를 작성할 수 있습니다.' : '선택한 활동의 세부 항목을 고르면<br>입력 양식이 열립니다.'}</p></div>
      </header>
      <main class="sh">
        <ol class="steps">${STEPS.map((n, k) => `<li class="${k + 1 === s ? 'on' : k + 1 < s ? 'done' : ''}" data-s="${k + 1}"><i>${k + 1 < s ? I.check : k + 1}</i><span>${n}</span></li>`).join('')}</ol>
        ${s === 1 ? `<div class="tg">${T.map(cardHTML).join('')}</div>
          <div class="info"><i>i</i><div><b>선택 안내</b><span>선택한 활동 유형에 따라 입력 항목과 보고서 양식이 자동으로 변경됩니다.</span></div></div>`
        : `<div class="sec-h"><b>세부 유형</b><span class="ln"></span><span class="cnt pill">전체 <strong>${total}</strong>개 항목</span></div><div class="scrl">${groupCards()}</div>`}
      </main>
      <div class="dk">${s === 2 ? '<button class="prev" id="prev">이전</button>' : ''}<button class="next" id="done" ${s === 1 ? (state.major ? '' : 'disabled') : (picked || (t0 && t0.direct) ? '' : 'disabled')}><span id="ct">${s === 2 && picked ? '다음 단계 · ' + picked : '다음 단계'}</span>${arrow}</button></div>
      <div class="mask" id="mask"></div><div class="pop" id="pop"></div>`;
    bind();
  }

  function bind() {
    $('#cls').onclick = classScreen;
    $('#arch').onclick = listScreen;
    $('#gear').onclick = () => window.Rep.toast('설정은 준비 중이에요');
    app.querySelectorAll('.steps li.done').forEach(li => li.onclick = () => { state.step = 1; home(); });
    app.querySelectorAll('.tc').forEach(c => c.onclick = () => {
      const t = find(c.dataset.code); if (state.major !== t.code) state.sub = null; state.major = t.code; state.step = 1; save(); home();
    });
    app.querySelectorAll('.gh').forEach(h => h.onclick = () => { const g = h.parentElement, c = g.dataset.code; g.classList.toggle('shut'); if (g.classList.contains('shut')) shut.add(c); else shut.delete(c); });
    app.querySelectorAll('.gr').forEach(r => r.onclick = () => {
      const t = find(r.dataset.code); state.major = r.dataset.code; state.sub = r.dataset.i === '' ? null : +r.dataset.i; save();
      app.querySelectorAll('.gr.sel').forEach(x => x.classList.remove('sel')); r.classList.add('sel');
      $('#done').disabled = false; $('#ct').textContent = '다음 단계 · ' + (t.direct ? t.title : subCode(t, state.sub) + ' ' + t.subs[state.sub]);
    });
    const pv = $('#prev'); if (pv) pv.onclick = () => { state.step = 1; home(); };
    $('#done').onclick = () => {
      const t = find(state.major); if (!t) return;
      if (state.step !== 2 && !t.direct) { state.step = 2; state.sub = null; shut.clear(); T.forEach(x => { if (x.code !== t.code) shut.add(x.code); }); home(); return; }
      if (!t.direct && state.sub == null) return;
      state.step = t.direct ? 1 : 2; step2(t);
    };
  }

  function step2(t) {
    state.screen = 'step2'; app.className = '';
    if (t.direct || window.READY.has(subCode(t, state.sub || 0))) {
      return window.Forms.render(app, t, state.sub || 0, I, () => { state.screen = 'home'; if (state.from === 'list') { state.from = null; listScreen(); } else home(); }, n => { state.sub = n; save(); if (window.READY.has(subCode(t, n))) step2(t); else { step2(t); } });
    }
    const i = state.sub || 0, name = t.direct ? t.name : t.subs[i];
    const ttl = titleOf(t, i).replace(/(\[[^\]]+\]|현장명_활동 내용|활동 내용)/g, '<em>$1</em>');
    app.innerHTML = `<div class="step2">
      <div class="top"><button id="bk" aria-label="뒤로">${I.back}</button><h2>${t.code}${t.direct ? '' : (i + 1)}. ${name}</h2></div>
      <div class="tbox"><label>제목 (자동 생성)</label><div class="t">${ttl}</div>
        <div class="chips"><span>① 제목</span><span>② 본문 : 구분 및 내용</span></div></div>
      <div class="note">다음 단계: 유형별 보고서 양식(현장 개요 · 자재 정보 등)과 공사 개요판 사진 인식 입력이 이 화면에 연결됩니다.<br>양식을 보내주시면 ${t.code}${t.direct ? '' : (i + 1)} 화면부터 구현합니다.</div>
    </div>`;
    $('#bk').onclick = () => { state.screen = 'home'; home(); };
    window.scrollTo(0, 0);
  }


  // ── 활동 분류표(표준화 정의) 화면: 홈 상단 분류표 버튼 → 구분 A~I 전체를 한눈에 보고, 항목을 누르면 해당 양식으로 이동
  let CF = 'all';
  function classScreen() {
    state.screen = 'class'; app.className = '';
    const hasForm = c => 'ABCDE'.includes(c[0]), hasInfo = c => hasForm(c) && !['D1', 'E1', 'E2'].includes(c);
    const rows = T.map(t => t.subs.map((s, i) => ({ t, i, s, c: subCode(t, i) }))).flat();
    const nForm = rows.filter(r => hasForm(r.c)).length, nInfo = rows.filter(r => hasInfo(r.c)).length;
    const F = [['all', '전체'], ['form', '표준양식'], ['info', '정보활용'], ['none', '양식 미정']];
    app.innerHTML = `<div class="cls">
      <div class="top"><button id="bk" aria-label="뒤로">${I.back}</button><h2>Activity 표준화 정의</h2></div>
      <p class="sub">활동 분류표 · 구분 A~I (항목을 누르면 보고서 양식으로 이동)</p>
      <div class="lg"><span><i class="dt b"></i>표준양식</span><span><i class="dt r"></i>정보활용</span></div>
      <div class="st"><div><b>${T.length}</b><span>구분</span></div><div><b>${rows.length}</b><span>활동 항목</span></div><div><b>${nForm}</b><span>표준양식 (정보활용 ${nInfo})</span></div></div>
      <div class="cf" id="cf">${F.map(f => `<button data-f="${f[0]}" class="${CF === f[0] ? 'on' : ''}">${f[1]}</button>`).join('')}</div>
      <div id="cgs">${T.map(t => `<section class="cg" data-code="${t.code}" style="--c:${t.color}">
        <h3><i>${t.code}</i>${t.name}<em>${t.subs.length ? t.subs.length + '개' : '직접 작성'}</em></h3>
        <div class="cl">${t.subs.length ? t.subs.map((s, i) => { const c = subCode(t, i), f = hasForm(c), n = hasInfo(c); return `<button class="cr" data-code="${t.code}" data-i="${i}" data-f="${f ? 1 : 0}" data-n="${n ? 1 : 0}"><span class="no">${i + 1}</span><span class="nm">${s}</span><span class="tg"><span class="${f ? '' : 'off'}"><i class="dt b" style="margin-right:4px"></i>양식</span><span class="${n ? '' : 'off'}"><i class="dt r" style="margin-right:4px"></i>정보</span></span>${window.READY.has(c) ? '<span class="rd">작성</span>' : ''}</button>`; }).join('') : `<button class="cr" data-code="${t.code}" data-i="" data-f="0" data-n="0"><span class="nm">${t.title}</span>${window.READY.has(t.code) || t.direct ? '<span class="rd">작성</span>' : ''}</button>`}</div></section>`).join('')}</div></div>`;
    const apply = () => {
      app.querySelectorAll('#cf button').forEach(b => b.classList.toggle('on', b.dataset.f === CF));
      app.querySelectorAll('.cr').forEach(r => {
        const f = r.dataset.f === '1', n = r.dataset.n === '1';
        r.classList.toggle('hide', !(CF === 'all' || (CF === 'form' && f) || (CF === 'info' && n) || (CF === 'none' && !f && !n)));
      });
      app.querySelectorAll('.cg').forEach(g => g.classList.toggle('hide', CF !== 'all' && !g.querySelector('.cr:not(.hide)')));
    };
    apply();
    $('#bk').onclick = () => { state.screen = 'home'; home(); };
    $('#cf').onclick = e => { const b = e.target.closest('button'); if (b) { CF = b.dataset.f; apply(); } };
    app.querySelectorAll('.cg>h3').forEach(h => h.onclick = () => h.parentElement.classList.toggle('shut'));
    app.querySelectorAll('.cr').forEach(r => r.onclick = () => {
      const t = find(r.dataset.code); if (!t) return;
      const i = r.dataset.i === '' ? null : +r.dataset.i, c = t.direct ? t.code : subCode(t, i);
      if (!t.direct && !window.READY.has(c)) { window.Rep.toast(`${c} ${t.subs[i]} — 보고서 양식은 준비 중이에요`); return; }
      state.major = t.code; state.sub = i; state.step = t.direct ? 1 : 2; save(); step2(t);
    });
    window.scrollTo(0, 0);
  }

  let LQ = '', LF = '';
  async function listScreen() {
    state.screen = 'list'; state.from = null; app.className = '';
    let recs = [], err = '';
    try { recs = (await window.Rep.all()).sort((a, b) => b.ts - a.ts); } catch (e) { err = '이 브라우저에서는 보관함을 쓸 수 없어요: ' + (e.message || e); }
    const E = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const D = ts => { const d = new Date(ts), p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };
    const thumb = r => { const dd = r.data || {}, x = (dd.sp && dd.sp.find(Boolean)) || dd.photo || (dd.imgs && Object.values(dd.imgs).find(Boolean)); const t = find(r.code[0]); return x ? `<img src="${x}" alt="">` : (t ? I[t.icon] : ''); };
    const eng = r => r.eng === 'A' ? window.Forms.A : window.Forms.S;
    app.innerHTML = `<div class="step2 lst">
      <div class="top"><button id="bk" aria-label="뒤로">${I.back}</button><h2>보고서 보관함</h2></div>
      <div class="fbox"><input id="lq" type="search" placeholder="제목·유형으로 검색" value="${E(LQ)}"></div>
      <div class="lf" id="lf"></div><div class="lcnt" id="lc"></div><div id="rl"></div>
      ${err ? `<div class="note">${E(err)}</div>` : ''}
      <div class="bk2"><button type="button" id="exp">⬇ 백업 파일 저장</button><label class="bkl">⬆ 백업 가져오기<input type="file" accept=".json,application/json" id="imp" hidden></label></div>
      <p class="hint">보고서는 <b>지금 쓰는 이 휴대폰/PC의 브라우저</b>에 저장돼요. 다른 기기로 옮기거나 안전하게 보관하려면 백업 파일을 저장한 뒤 다른 기기에서 가져오기 하세요. 브라우저 데이터를 지우면 보고서도 함께 지워져요.</p>
      <div class="dock"><nav class="nav"><button id="nh">${I.home}홈</button><button class="on">${I.bars}보고서</button><button>${I.star}즐겨찾기</button><button>${I.gear}설정</button></nav></div></div>`;
    const paint = () => {
      const q = LQ.trim().toLowerCase(), cnt = {}; recs.forEach(r => { cnt[r.code[0]] = (cnt[r.code[0]] || 0) + 1; });
      $('#lf').innerHTML = `<button data-f="" class="${LF ? '' : 'on'}">전체 ${recs.length}</button>` + Object.keys(cnt).sort().map(c => `<button data-f="${c}" class="${LF === c ? 'on' : ''}">${c}. ${E(find(c) ? find(c).name : c)} ${cnt[c]}</button>`).join('');
      const shown = recs.filter(r => (!LF || r.code[0] === LF) && (!q || (r.title + ' ' + r.sub + ' ' + r.code).toLowerCase().includes(q)));
      $('#lc').textContent = `${shown.length}건 · 최근 수정순`;
      $('#rl').innerHTML = shown.length ? shown.map(r => `<div class="ri" data-id="${r.id}"><div class="th">${thumb(r)}</div><div class="bd"><b class="tt">${E(r.title)}</b><small>${E(r.code)} · ${E(r.sub)} · ${D(r.ts)}</small></div>
        <div class="ra"><button data-a="open">✏ 열기</button><button data-a="pv">👁 미리보기</button><button data-a="xl">📊 Excel</button><button data-a="dup">⧉ 복제</button><button data-a="del">🗑 삭제</button></div></div>`).join('')
        : `<div class="empty">${recs.length ? '검색 결과가 없어요.' : '저장된 보고서가 없어요.<br>작성 화면에서 <b>💾 저장</b>을 누르면 여기에 쌓여요.'}</div>`;
    };
    paint();
    $('#bk').onclick = $('#nh').onclick = () => { state.screen = 'home'; home(); };
    $('#lq').oninput = e => { LQ = e.target.value; paint(); };
    $('#lf').onclick = e => { const b = e.target.closest('button'); if (!b) return; LF = b.dataset.f; paint(); };
    $('#rl').onclick = async e => {
      const b = e.target.closest('button'), row = e.target.closest('.ri'); if (!b || !row) return;
      const r = recs.find(x => x.id === row.dataset.id); if (!r) return;
      const a = b.dataset.a;
      try {
        if (a === 'open') { const t = find(r.code[0]); eng(r).open(r); state.major = t.code; state.sub = +r.code.slice(1) - 1; state.tab = 'major'; save(); state.from = 'list'; step2(t); }
        else if (a === 'pv') window.Rep.preview(eng(r).preview(r), { onExcel: () => eng(r).excel(r) });
        else if (a === 'xl') { window.Rep.toast('Excel 만드는 중…'); await eng(r).excel(r); window.Rep.toast('Excel 파일을 만들었어요'); }
        else if (a === 'dup') { await window.Rep.save(Object.assign({}, r, { id: undefined })); window.Rep.toast('복제했어요'); listScreen(); }
        else if (a === 'del') { if (!confirm('이 보고서를 삭제할까요?\n삭제하면 되돌릴 수 없어요.\n\n' + r.title)) return; await window.Rep.del(r.id); window.Rep.toast('삭제했어요'); listScreen(); }
      } catch (err) { window.Rep.toast('실패: ' + (err && err.message || err)); }
    };
    $('#exp').onclick = async () => {
      if (!recs.length) return window.Rep.toast('저장된 보고서가 없어요');
      const d = new Date(), p = n => String(n).padStart(2, '0');
      try { await window.Rep.download(`Activity_Report_backup_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.json`, new TextEncoder().encode(JSON.stringify({ app: 'activity-report', v: 1, recs })), 'application/json'); window.Rep.toast('백업 파일을 저장했어요'); } catch (e) { window.Rep.toast('백업 실패: ' + (e && e.message || e)); }
    };
    $('#imp').onchange = async e => {
      const fl = e.target.files[0]; if (!fl) return;
      try { const j = JSON.parse(await fl.text()), arr = Array.isArray(j.recs) ? j.recs : []; let n = 0;
        for (const r of arr) if (r && r.id && r.code && r.data && (r.eng === 'A' || r.eng === 'S')) { await window.Rep.put(Object.assign({ ts: Date.now(), title: '', sub: '' }, r)); n++; }
        window.Rep.toast(n ? `${n}건을 가져왔어요` : '가져올 보고서가 없어요'); listScreen(); } catch (err) { window.Rep.toast('가져오기 실패: 백업 파일이 올바르지 않아요'); }
    };
    window.scrollTo(0, 0);
  }

  home();
})();
