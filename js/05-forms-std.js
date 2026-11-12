(function () {
  const BU = ['건축', '플랜트', '일반공업', '리피니시', '실란트', 'PCM', 'OEM', '재고자산', '분체', '상품'];
  var C4=["코드","거래처명","유통채널","소재지"],C3=["코드","거래처명","유통채널"],NOTE="※ 잠재 고객인 경우 KERP_거래처 등록 거래처 코드 반드시 등록";
var PF=[["당월",["계획","실적",{l:"진도율",p:1,f:function(n){return n(1)/n(0)}}]],["누계",["전년","계획","실적",{l:"신장률",p:1,f:function(n){return n(5)/n(3)-1}},{l:"진도율",p:1,f:function(n){return n(5)/n(4)}}]],["연간",["진도율"]]];
var PC=[["당월",["실적","목표점유","점유"]],["누계",["전년","실적","목표점유","점유","신장률"]],["연간",["진도율"]]];
var K=function(h,f,img,u){return{t:"kv",h:h,f:f,img:img,u:u}},R=function(h,g,u){return{t:"rows",h:h,g:g,u:u}},GR=function(h,rl,g,o){return Object.assign({t:"grid",h:h,rl:rl,g:g,u:1},o)},T=function(h){return{t:"txt",h:h}};
var EM=function(x){return[["상품 / 현장",["상품","현장코드","현장명","현공정","연면적"]],["거래처 개요",C4],["영업",x.concat(["투입시기","진행 단계","본사/지점"])]]};
var X=function(l){return{l:l,x:1}};
var MG=function(v){return[["",[X("현장스펙 / 당사제품"),"물량",X("단위"),"금액 (백만원)",X(v)]]]};
var SITE=["현장 코드","소재지","판촉 주체","담당자"];
var FORMS={
gen:{sec:[T("활동 내용")]},
A1:{sec:[K("현장 개요",["현장 코드","프로젝트명칭","소재지","판촉 주체","담당자","시행사","설계사","시공사","연면적","주용도","감리업체","공사시작","공사종료","지하","지상","동","세대수","현공정","비고"],1),
 GR("자재 정보",["내외장재 G/S","내외장재 G/T","내외장재 M/T","내외장재 기타","내외장재 상품","보온재 G/W","보온재 M/W","보온재 기타","보온재 상품","창호","공업도료 일반공업","유통도료 수성","유통도료 에폭시","유통도료 내화도료","유통도료 플랜트","상품 ①","상품 ②"],MG("수주/판매업체"),{tot:[3]})]},
A2:{sec:[K("현장 개요",["현장 코드","현장명","소재지","판촉 주체","담당자","입찰 게시일","감리업체","수주업체","?외부","?내부","?주차장","?방수","금액 (백만원)","공사시작","공사종료","지하","지상","동","세대수","?당사 디자인 제출","?경쟁사 디자인 제출","?특허공법"],1),
 GR("자재 정보",["외부","내부","주차장","방수"],MG("도장업체"),{tot:[3]})]},
B1:{note:NOTE,sec:[R("거래처 개요",[["거래처 개요",C4],["개설 및 년간 점유 목표",["총시장","매출액","점유율","개설시기"]]],1)]},
B2:{note:NOTE,sec:[R("거래처 개요",[["거래처 개요",C4],["재거래 및 점유 목표",["총시장","매출액","점유율","재거래시기"]]],1)]},
B3:{note:NOTE,sec:[R("거래처 개요",[["거래처 개요",C3],["현장 개요",["현장명","물량","금액","납기"]],["거래",["거래시기"]]],1)]},
B4:{note:NOTE,sec:[R("거래처 개요",[["거래처 개요",C4],["점유 확대 목표",["총시장","경쟁사","KCC","점유율"]]],1)]},
C1:{sec:[K("프로젝트 상품 개요",["상품명칭","규격","단위","매입 코드","매입처명","매입가","물량","매출 코드","매출처명","매출가","매출금액"],2,1)]},
C2:{sec:[R("매입처 개요",[["",["상품 정보","기존 매입처","추가 매입처","다변화 사유","도입시기"]]])]},
C3:{sec:[R("전략 상품 개요",EM(["매출액"]),1)]},
D1:{sec:[R("Cross Over 개요",[["Cross Over",["기존","추가"]],["거래처 개요",C4],["매출액 증가 내역",["기존","추가","기준월"]]],1)]},
D2:{sec:[R("Cross Over 개요",[["Cross Over",["기존","추가"]],["현장 개요",["코드","현장명","연면적"]],["연계 거래처",["코드","명칭"]],["연계 매출",["금액","기준월"]]],1)]},
E1p:{sec:[GR("운영 목표 실적 관리",["사업부 중점 상품","대규격 G/T","마이톤 스카이"],PF)]},
E1s:{sec:[R("중점 상품 개요",EM(["물량","금액"]),1)]},
E2p:{sec:[GR("운영 목표 실적 관리",["G/W 판넬","보온재 상품","외단열","샌드위치패널","고무발포"],PF)]},
E2g:{sec:[R("판촉 개요",[["현장 개요",["코드","현장명","현공정"]],["거래처 개요",["코드","거래처명"]],["목표 매출",["물량","금액","투입시기"]]],1)]},
E3p:{sec:[GR("운영 목표 실적 관리",["유통 매출","신규 매출","부자재","기타 상품","이맥스클럽(수)"],PF)]},
E3u:{sec:[GR("조합 현장 판촉 현황",["조합설립","사업승인","관리처분","이주철거","착공"],[["재건축/재개발",["총사업장","방문수",{l:"진도율",p:1,f:function(n){return n(1)/n(0)}}]],["소규모/가로주택",["총사업장","방문수",{l:"진도율",p:1,f:function(n){return n(4)/n(3)}}]],["합계",[{l:"총사업장",f:function(n){return n(0)+n(3)}},{l:"방문수",f:function(n){return n(1)+n(4)}},{l:"진도율",p:1,f:function(n){return n(7)/n(6)}}]]],{tot:[0,1,3,4],u:0})]},
E3c:{sec:[R("유통 이맥스 클럽 가입 활동",[["거래처 개요",C3],["가입 활동",["가입 사유","등급"]],["목표 매출",["금액","기준월"]]],1)]},
E3e:{sec:[R("에너지 재단 활동 내용",[["거래처 개요",["코드","시공 & 거래처명","유통채널"]],["",["활동 내용"]],["연계 매출",["금액","기준월"]]],1)]},
E3k:{sec:[R("관급시장 공략 활동 내용",[["거래처 개요",["코드","시공 & 거래처명","유통채널"]],["관급시장 개요",["명칭","연면적"]],["연계 매출",["금액","기준월"]]],1)]},
E4p:{sec:[GR("운영 목표 실적 관리",["상품 매출","재도장 매출","MAS 제조(수)","인캔(대수)","측색기(대수)","수믹스(대수)"],PF)]},
E4s:{sec:[R("중점 상품 개요",EM(["예상매출"]),1)]},
E4m:{sec:[R("MAS 제조 전환 개요",[["거래처 개요",C4],["제조 전환 현황",["진행 단계","완료예정"]],["목표 매출",["금액","기준월"]]],1)]},
E4c:{sec:[R("조색 시스템 개요",[["거래처 개요",C3],["조색 시스템 설치 현황",["설치 기기명","기존 기기명","경쟁사 기기명"]]],1)]},
E5p:{sec:[GR("분체 전문점 매출 현황",["분체 전문점"],PF),GR("PCM 코터사 매출 / 점유 현황",["동국씨엠","포스코스틸리온","디케이동신","아주스틸","KG스틸","에스와이패널","세아씨엠","서린철강","기타 (해외)"],PC)]},
E5b:{sec:[R("분체 전문점 판매 확대",[["거래처 개요",C4],["매출 및 점유 현황",["총시장","경쟁사","KCC","점유율","목표시기"]]],1)]},
E5c:{sec:[R("PCM 코터사 점유 확대",[["거래처 개요",C4],["매출 및 점유 현황",["총시장","경쟁사","KCC","점유율","경쟁사명"]]],1)]}
};
  FORMS.C1.sec[0].lay = [[0, 1, 2], [3, 4, 5, 6], [7, 8, 9, 10]];
  const TABS = {
    E1: [['운영 목표 실적', 'E1p'], ['중점 상품 판매', 'E1s'], ['대규격 G/T 판매'], ['마이톤 스카이 판매']],
    E2: [['운영 목표 실적', 'E2p'], ['G/W 판넬 판매', 'E2g'], ['보온재 상품 판매'], ['외단열/샌드위치패널/고무발포']],
    E3: [['운영 목표 실적', 'E3p'], ['조합 현장 판촉', 'E3u'], ['유통 이맥스 클럽', 'E3c'], ['에너지 재단', 'E3e'], ['관급시장 공략', 'E3k']],
    E4: [['운영 목표 실적', 'E4p'], ['중점 상품 판매', 'E4s'], ['MAS 제조 전환', 'E4m'], ['조색 시스템 확대', 'E4c']],
    E5: [['운영 목표 실적', 'E5p'], ['분체 전문점', 'E5b'], ['PCM 코터사', 'E5c']]
  };
  const BASIC = ['A3', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  const NM = { A3: '현장명', B1: '거래선명', B2: '거래선명', B3: '거래선명', B4: '거래선명', C1: '상품명', C2: '상품명', C3: '상품명', D1: '거래처명', D2: '현장명' };
  const isS = c => /^[BCD]\d$/.test(c) || /^E[1-5]$/.test(c) || BASIC.includes(c);
  ['B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'D1', 'D2', 'E1', 'E2', 'E3', 'E4', 'E5'].concat(BASIC).forEach(c => window.READY.add(c));
  const formOf = (code, tab) => TABS[code] ? FORMS[TABS[code][tab][1] || 'gen'] : (FORMS[code] || FORMS.gen);
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const load = src => new Promise((ok, no) => { if (window.ExcelJS) return ok(); const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('엑셀 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.')); document.head.appendChild(s); });
  const shrink = (file, cb) => { const im = new Image(), u = URL.createObjectURL(file);
    im.onload = () => { const k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); cb(c.toDataURL('image/jpeg', .8)); }; im.src = u; };
  const cropCover = (url, asp) => new Promise(ok => { const im = new Image(); im.onload = () => { let sw = im.width, sh = im.height; if (sh / sw > asp) sh = sw * asp; else sw = sh / asp;
    const c = document.createElement('canvas'); c.width = Math.round(sw); c.height = Math.round(sh); c.getContext('2d').drawImage(im, (im.width - sw) / 2, (im.height - sh) / 2, sw, sh, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', .85)); }; im.onerror = () => ok(url); im.src = url; });
  const num = x => { const v = parseFloat(String(x == null ? '' : x).replace(/,/g, '')); return isNaN(v) ? 0 : v; };
  const fmt = (v, p) => (!isFinite(v) || isNaN(v)) ? '' : p ? Math.round(v * 100) + '%' : (Math.round(v * 100) / 100).toLocaleString('ko-KR');
  const cols = sec => { const a = []; sec.g.forEach(g => g[1].forEach(c => a.push(Object.assign({ g: g[0] }, typeof c === 'string' ? { l: c } : c)))); return a; };
  const gcell = (sec, vals, j) => { const cs = cols(sec); const n = k => cs[k].f ? cs[k].f(n) : num(vals[k]); return fmt(cs[j].f(n), cs[j].p); };
  const totals = (sec, d) => { const t = []; (sec.tot || []).forEach(j => { let s = 0; sec.rl.forEach((_, r) => { s += num(((d || {})[r] || {})[j]); }); t[j] = s; }); return t; };
  const circ = n => n < 20 ? String.fromCharCode(0x2460 + n) : '(' + (n + 1) + ')';
  const drafts = {}, TI = {};

  function renderS(app, t, i, I, back, go) {
    const subs = t.direct ? [t.title] : t.subs, si = t.direct ? 0 : i, code = t.direct ? t.code : t.code + (i + 1), tabs = TABS[code], tab = Math.min(TI[code] || 0, tabs ? tabs.length - 1 : 0), f = formOf(code, tab);
    const key = code + (tabs ? '_' + tab : ''), nmLabel = tabs ? null : (NM[code] || null), tabName = tabs ? tabs[tab][0] : '';
    const basic = tabs ? !tabs[tab][1] : !FORMS[code];
    let S = drafts[key];
    if (!S) { S = { h: { bu: '', nm: '', act: '', mgr: '' }, s: {}, L: { prog: ['', ''], plan: ['', ''], req: [''] }, imgs: {} };
      try { const o = JSON.parse(localStorage.getItem('ar-s-' + key) || 'null'); if (o) S = Object.assign(S, o, { imgs: {} }); } catch (e) {}
      drafts[key] = S; }
    const persist = () => { try { localStorage.setItem('ar-s-' + key, JSON.stringify(Object.assign({}, S, { imgs: {} }))); } catch (e) {} };
    const bu = () => tabs ? subs[si] : S.h.bu, nm = () => tabs ? tabName : S.h.nm, hasNm = !!(nmLabel || tabs);
    const part = (v, p) => v ? esc(v) : '<em>' + p + '</em>';
    const titleHTML = () => `${code}. ${t.name} : [${part(bu(), '사업부')}] ${hasNm ? part(nm(), nmLabel) + ' ' : ''}${part(S.h.act, '활동내역')} [${part(S.h.mgr, '담당자')}]`;
    const titleTxt = () => `${code}. ${t.name} : [${bu() || '사업부'}] ${hasNm ? (nm() || nmLabel) + ' ' : ''}${S.h.act || '활동내역'} [${S.h.mgr || '담당자'}]`;
    const inp = (ex, v) => `<input type="text" ${ex} value="${esc(v)}">`;
    const secUI = (sec, k) => {
      const d = S.s[k] = S.s[k] || (sec.t === 'rows' ? [{}] : {});
      let h = `<h4>${k + 1}) ${esc(sec.h)}${sec.u ? '<small>단위 : 백만원</small>' : ''}</h4>`;
      if (sec.t === 'txt') return h + `<div class="fr"><textarea rows="4" data-s="${k}" data-k="0">${esc(d[0])}</textarea></div>`;
      if (sec.t === 'kv') { h += '<div class="mr"><div class="sx">' + sec.f.map((l, j) => `<label class="fd"><span>${esc(l)}</span>${inp(`data-s="${k}" data-k="${j}"`, d[j])}</label>`).join('') + '</div></div>';
        for (let n = 0; n < (sec.img || 0); n++) { const im = S.imgs[k + '_' + n]; h += `<label class="photo" style="display:block;margin:8px 14px">${im ? `<img src="${im}" alt="">` : ''}<div>이미지 ${n + 1} ${im ? '바꾸기' : '선택'}</div><input type="file" accept="image/*" data-img="${k}_${n}" hidden></label>`; }
        return h; }
      const cs = cols(sec), isg = sec.t === 'grid';
      (isg ? sec.rl : d).forEach((rn, r) => { const v = d[r] = d[r] || {};
        h += `<div class="mr"><div class="mh">${isg ? esc(rn) : (r + 1) + '번 행'}${!isg && d.length > 1 ? `<button type="button" class="x" style="float:right;width:auto;padding:0 10px" data-del="${k},${r}">삭제</button>` : ''}</div><div class="sx">`;
        cs.forEach((c, j) => { const lb = esc(c.g ? c.g + ' ' + c.l : c.l);
          h += c.f ? `<div class="fd"><span>${lb} (자동)</span><output data-fc="${k}_${r}_${j}">${gcell(sec, v, j)}</output></div>` : `<label class="fd"><span>${lb}</span>${inp(`data-s="${k}" data-r="${r}" data-c="${j}" inputmode="${isg && !c.x ? 'decimal' : 'text'}"`, v[j])}</label>`; });
        h += '</div></div>'; });
      if (!isg) h += `<button type="button" class="addb" data-add="${k}">＋ 행 추가</button>`;
      if (sec.tot) { const tt = totals(sec, d); h += '<div class="mr"><div class="mh">합계 (자동)</div><div class="sx">' + cs.map((c, j) => (c.f || sec.tot.includes(j)) ? `<div class="fd"><span>${esc(c.g + ' ' + c.l)}</span><output data-fc="${k}_t_${j}">${c.f ? gcell(sec, tt, j) : fmt(tt[j])}</output></div>` : '').join('') + '</div></div>'; }
      return h; };
    const listHTML = k => S.L[k].map((v, n) => `<div class="li"><b>${circ(n)}</b><textarea rows="2" data-l="${k}" data-n="${n}">${esc(v)}</textarea><button type="button" class="x" data-ldel="${k}.${n}" aria-label="삭제">✕</button></div>`).join('') + `<button type="button" class="addb" data-ladd="${k}">＋ 항목 추가</button>`;
    const listUI = (k, n, label) => `<h4>${n}) ${label}</h4><div id="ls-${k}">${listHTML(k)}</div>`;
    const ns = f.sec.length;
    const strip = tabs ? tabs.map((x, n) => `<button data-tab="${n}" class="${n === tab ? 'y' : ''}">${esc(x[0])}</button>`).join('') : (t.direct ? [] : subs).map((s, n) => `<button data-go="${n}" class="${n === i ? 'y' : ''}">${esc(s)}</button>`).join('');
    app.innerHTML = `<div class="step2 fm">
      <div class="top"><button id="bk" aria-label="뒤로">${I.back}</button><h2>${code}. ${esc(subs[si])}${tabs ? ' · ' + esc(tabName) : ''}</h2></div>
      <div class="tbox"><label>① 제목 (자동 생성)</label><div class="t" id="ttl">${titleHTML()}</div></div>
      <div class="fbox"><div class="fr">
        ${tabs ? '' : `<label class="fd w2"><span>사업부</span><select data-h="bu"><option value="">선택</option>${BU.map(b => `<option${S.h.bu === b ? ' selected' : ''}>${b}</option>`).join('')}</select></label>`}
        <label class="fd ${tabs ? 'w4' : 'w2'}"><span>담당자 (= 판촉 주체)</span><input data-h="mgr" value="${esc(S.h.mgr)}"></label>
        ${nmLabel ? `<label class="fd w4"><span>${nmLabel}</span><input data-h="nm" value="${esc(S.h.nm)}"></label>` : ''}
        <label class="fd w4"><span>활동 내용</span><input data-h="act" value="${esc(S.h.act)}" placeholder="예) 판촉의 건"></label></div></div>
      <div class="tbox"><label>② 본문 : 구분</label><div class="strip">${strip}</div></div>
      ${f.note ? `<div class="note">${esc(f.note)}</div>` : ''}${basic ? '<div class="note">이 유형은 양식이 아직 없어 기본 양식으로 작성돼요.</div>' : ''}
      ${f.sec.map((sec, k) => secUI(sec, k)).join('')}
      ${listUI('prog', ns + 1, '진행 사항')}${listUI('plan', ns + 2, '예정 사항')}${listUI('req', ns + 3, '지원 요청')}
      <div class="act"><button type="button" id="pvb">👁 미리보기</button><button type="button" id="svb">💾 저장</button><button type="button" id="nw">＋ 새로 작성</button></div><button class="cta xl" id="xl">📊 Excel 보고서 만들기</button><div class="msg" id="msg"></div></div>`;
    const root = app.querySelector('.fm'), upd = () => { document.getElementById('ttl').innerHTML = titleHTML(); };
    const redo = () => { const y = window.scrollY; renderS(app, t, i, I, back, go); window.scrollTo(0, y); };
    const draw = k => { document.getElementById('ls-' + k).innerHTML = listHTML(k); persist(); };
    const calc = k => { const sec = f.sec[k], v = S.s[k], cs = cols(sec);
      sec.rl.forEach((_, r) => cs.forEach((c, j) => { if (c.f) { const o = root.querySelector(`[data-fc="${k}_${r}_${j}"]`); if (o) o.textContent = gcell(sec, v[r] || {}, j); } }));
      if (sec.tot) { const tt = totals(sec, v); cs.forEach((c, j) => { const o = root.querySelector(`[data-fc="${k}_t_${j}"]`); if (o) o.textContent = c.f ? gcell(sec, tt, j) : fmt(tt[j]); }); } };
    root.addEventListener('input', e => { const el = e.target, d = el.dataset;
      if (d.h) { S.h[d.h] = el.value; upd(); }
      else if (d.l) S.L[d.l][+d.n] = el.value;
      else if (d.s != null) { const sec = f.sec[d.s], v = S.s[d.s];
        if (sec.t === 'rows') v[+d.r][+d.c] = el.value;
        else if (sec.t === 'grid') { v[+d.r] = v[+d.r] || {}; v[+d.r][+d.c] = el.value; calc(+d.s); }
        else v[+d.k] = el.value; }
      persist(); });
    root.addEventListener('change', e => { const el = e.target;
      if (el.dataset.img && el.files[0]) shrink(el.files[0], url => { S.imgs[el.dataset.img] = url; redo(); }); });
    root.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
      if (d.add !== undefined) { S.s[d.add].push({}); persist(); redo(); }
      else if (d.del !== undefined) { const a = d.del.split(','); S.s[a[0]].splice(+a[1], 1); persist(); redo(); }
      else if (d.ladd !== undefined) { S.L[d.ladd].push(''); draw(d.ladd); }
      else if (d.ldel !== undefined) { const a = d.ldel.split('.'); if (S.L[a[0]].length > 1) S.L[a[0]].splice(+a[1], 1); else S.L[a[0]][0] = ''; draw(a[0]); }
      else if (d.tab !== undefined) { TI[code] = +d.tab; renderS(app, t, i, I, back, go); }
      else if (d.go !== undefined) { if (+d.go !== i) go(+d.go); } });
    document.getElementById('bk').onclick = back;
    document.getElementById('xl').onclick = async () => { const msg = document.getElementById('msg'); msg.textContent = '엑셀 파일 만드는 중…';
      try { await toExcelS(f, S, titleTxt(), tabs ? tabs.map(x => x[0]) : subs, tabs ? tab : si); msg.textContent = '완료 — 저장 확인창에서 저장해 주세요.'; }
      catch (err) { msg.textContent = err && err.code === 'declined' ? '저장을 취소했어요.' : '실패: ' + (err.message || err.code || err); } };
    const recS = () => ({ id: S._id, eng: 'S', code, tab, title: titleTxt(), sub: tabs ? tabName : subs[si], data: JSON.parse(JSON.stringify(S)) });
    const doXS = () => toExcelS(f, S, titleTxt(), tabs ? tabs.map(x => x[0]) : subs, tabs ? tab : si);
    const doSaveS = async () => { try { const r = await window.Rep.save(recS()); S._id = r.id; persist(); window.Rep.toast('보관함에 저장했어요 · 홈 아래 "보고서"에서 볼 수 있어요'); } catch (e) { window.Rep.toast('저장 실패: ' + (e.message || e)); } };
    document.getElementById('pvb').onclick = () => window.Rep.preview(prevS(f, S, titleTxt(), tabs ? tabs.map(x => x[0]) : subs, tabs ? tab : si), { onSave: doSaveS, onExcel: doXS });
    document.getElementById('svb').onclick = doSaveS;
    document.getElementById('nw').onclick = () => { if (!confirm('작성 중인 내용을 지우고 새 보고서를 시작할까요?\n(저장한 보고서는 그대로 남아요)')) return; delete drafts[key]; try { localStorage.removeItem('ar-s-' + key); } catch (e) {} renderS(app, t, i, I, back, go); };
    window.scrollTo(0, 0);
  }

  async function toExcelS(f, S, title, names, sel) {
    await load('https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js');
    const NC = 40, UW = 4.2, CPX = Math.round(UW * 7 + 5), FONT = '맑은 고딕', GRAY = 'FFF2F2F2', YEL = 'FFFFFF00';
    const wb = new ExcelJS.Workbook(), ws = wb.addWorksheet('보고서', { views: [{ showGridLines: false }], pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
    ws.columns = Array.from({ length: NC }, () => ({ width: UW }));
    const bs = st => st === 'm' ? { style: 'medium', color: { argb: 'FF000000' } } : st === 'd' ? { style: 'dotted', color: { argb: 'FF7F7F7F' } } : { style: 'thin', color: { argb: 'FF000000' } };
    let r = 1;
    const put = (y, c1, c2, v, o = {}) => { const y2 = y + (o.rows || 1) - 1; if (c2 > c1 || y2 > y) ws.mergeCells(y, c1, y2, c2);
      const c = ws.getCell(y, c1); c.value = v;
      c.alignment = { horizontal: o.l ? 'left' : o.r ? 'right' : 'center', vertical: 'middle', wrapText: true, indent: o.ind ? 1 : 0 };
      c.font = { name: FONT, size: o.sz || 10, bold: !!o.b, color: { argb: o.red ? 'FFFF0000' : (o.col || 'FF000000') } };
      if (o.fill) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: o.fill } };
      if (o.h) ws.getRow(y).height = o.h; };
    const frame = (r1, r2, c1, c2, vb, hb) => { const vf = typeof vb === 'function' ? vb : (y, x) => vb[x];
      for (let y = r1; y <= r2; y++) for (let x = c1; x <= c2; x++) ws.getCell(y, x).border = { top: bs(y === r1 ? 'm' : (hb[y - 1] || 't')), bottom: bs(y === r2 ? 'm' : (hb[y] || 't')), left: bs(x === c1 ? 'm' : (vf(y, x - 1) || 't')), right: bs(x === c2 ? 'm' : (vf(y, x) || 't')) }; };
    const place = (n, w) => { const tot = w.reduce((a, b) => a + b, 0), raw = w.map(x => x * n / tot), base = raw.map(Math.floor); let rest = n - base.reduce((a, b) => a + b, 0);
      raw.map((v, k) => [v - base[k], k]).sort((a, b) => b[0] - a[0]).slice(0, rest).forEach(p => base[p[1]]++); let c = 1; return base.map(x => { const o = [c, c + x - 1]; c += x; return o; }); };
    const wt = l => /명|스펙|사유|소재|내용|기기|시공|정보|상품/.test(l) ? 2 : 1;
    const lines = (v, sp) => { let u = 0; for (const ch of String(v == null ? '' : v)) u += ch.charCodeAt(0) > 255 ? 2 : 1; return Math.max(1, Math.ceil(u / ((sp[1] - sp[0] + 1) * UW * .9))); };
    const gap = () => { ws.getRow(r).height = 8; r++; };
    const rowsTable = (sec, d) => {
      const cs = cols(sec), pos = place(NC, cs.map(c => wt(c.l))), hasG = sec.g.some(g => g[0]), t0 = r, vb = {}, hb = {}, vm = new Set();
      cs.forEach((c, j) => { if (j < cs.length - 1) vb[pos[j][1]] = cs[j + 1].g === c.g ? 'd' : 't'; });
      if (hasG) { let j = 0; sec.g.forEach(g => { const n = g[1].length; if (g[0]) put(r, pos[j][0], pos[j + n - 1][1], g[0], { fill: GRAY, b: 1, h: 20 }); else for (let q = 0; q < n; q++) vm.add(j + q); j += n; }); ws.getRow(r).height = 20; hb[r] = 't'; r++; }
      const hh = Math.max(20, ...cs.map((c, j) => lines(c.l, pos[j]) * 14 + 6));
      cs.forEach((c, j) => { if (vm.has(j)) put(r - 1, pos[j][0], pos[j][1], c.l, { fill: GRAY, rows: 2 }); else put(r, pos[j][0], pos[j][1], c.l, { fill: GRAY, h: hh }); }); hb[r] = 't'; r++;
      let rows = d.filter(row => Object.values(row).some(v => String(v).trim())); if (!rows.length) rows = [{}];
      rows.forEach((row, n) => { let h = 24; cs.forEach((c, j) => { const v = row[j] == null ? '' : row[j]; put(r, pos[j][0], pos[j][1], v, { red: /코드/.test(c.l) }); h = Math.max(h, lines(v, pos[j]) * 14 + 10); });
        ws.getRow(r).height = h; if (n < rows.length - 1) hb[r] = 'd'; r++; });
      frame(t0, r - 1, 1, NC, vb, hb); };
    const gridTable = (sec, G) => {
      const cs = cols(sec), pos = place(NC, [3].concat(cs.map(() => 1))), t0 = r, vb = {}, hb = {};
      vb[pos[0][1]] = 't'; cs.forEach((c, j) => { if (j < cs.length - 1) vb[pos[j + 1][1]] = cs[j + 1].g === c.g ? 'd' : 't'; });
      put(r, pos[0][0], pos[0][1], '구분', { fill: GRAY, b: 1, rows: 2, h: 20 });
      let j0 = 0; sec.g.forEach(g => { const n = g[1].length; put(r, pos[j0 + 1][0], pos[j0 + n][1], g[0], { fill: GRAY, b: 1, h: 20 }); j0 += n; }); hb[r] = 't'; r++;
      const hh = Math.max(20, ...cs.map((c, j) => lines(c.l, pos[j + 1]) * 14 + 6));
      cs.forEach((c, j) => put(r, pos[j + 1][0], pos[j + 1][1], c.l, { fill: GRAY, h: hh })); hb[r] = 't'; r++;
      const val = (v, j) => cs[j].f ? gcell(sec, v, j) : (v[j] == null ? '' : v[j]);
      sec.rl.forEach((rn, n) => { const v = G[n] || {}; put(r, pos[0][0], pos[0][1], rn, { h: 22 }); cs.forEach((c, j) => put(r, pos[j + 1][0], pos[j + 1][1], val(v, j))); hb[r] = 't'; r++; });
      if (sec.tot) { const tt = totals(sec, G); put(r, pos[0][0], pos[0][1], '합계', { b: 1, h: 22 }); cs.forEach((c, j) => put(r, pos[j + 1][0], pos[j + 1][1], c.f ? gcell(sec, tt, j) : (sec.tot.includes(j) ? fmt(tt[j]) : ''), { b: 1 })); r++; }
      frame(t0, r - 1, 1, NC, vb, hb); };
    const kvTable = async (sec, d, k) => {
      const LW = 20, half = (NC - LW) / 2, t0 = r, re = {}, hb = {};
      put(r, 1, LW, '상품 정보', { fill: GRAY, b: 1, h: 20 }); put(r, LW + 1, NC, '이미지', { fill: GRAY, b: 1 }); hb[r] = 't'; r++;
      const b0 = r;
      sec.lay.forEach(g => { const pos = place(LW, g.map(x => wt(sec.f[x])));
        g.forEach((x, q) => { put(r, pos[q][0], pos[q][1], sec.f[x].replace(/^매[입출] /, ''), { fill: GRAY, h: 20 }); put(r + 1, pos[q][0], pos[q][1], d[x] || '', { red: /코드/.test(sec.f[x]), h: 24 });
          if (q < g.length - 1) { [r, r + 1].forEach(y => { re[y] = re[y] || {}; re[y][pos[q][1]] = 'd'; }); } });
        hb[r] = 't'; hb[r + 1] = 't'; r += 2; });
      const b1 = r - 1;
      ws.mergeCells(b0, LW + 1, b1, LW + half); ws.mergeCells(b0, LW + half + 1, b1, NC);
      [0, 1].forEach(n => { const c = ws.getCell(b0, LW + 1 + n * half); c.value = S.imgs[k + '_' + n] ? '' : circ(n); c.font = { name: FONT, size: 10, color: { argb: 'FF808080' } }; c.alignment = { horizontal: 'center', vertical: 'middle' }; });
      frame(t0, b1, 1, NC, (y, x) => (x === LW || x === LW + half) ? 't' : (re[y] || {})[x], hb);
      let H = 0; for (let y = b0; y <= b1; y++) H += (ws.getRow(y).height || 20) * 4 / 3;
      for (let n = 0; n < 2; n++) { const u = S.imgs[k + '_' + n]; if (!u) continue; const w = half * CPX - 5, h = H - 5, c = await cropCover(u, h / w);
        ws.addImage(wb.addImage({ base64: c, extension: 'jpeg' }), { tl: { col: LW + n * half + 2.5 / CPX, row: b0 - 1 + .03 }, br: { col: LW + (n + 1) * half - 2.5 / CPX, row: b1 - .03 }, editAs: 'oneCell' }); } };
    put(r, 1, NC, '① ' + title, { l: 1, b: 1, sz: 13, h: 28 }); r++;
    if (f.note) { put(r, 1, NC, f.note, { l: 1, sz: 9, col: 'FF2457B8', h: 16 }); r++; }
    gap();
    const SL = names.length, per = Math.floor((NC - 6) / SL), first = NC - per * SL;
    put(r, 1, first, '구분', { fill: GRAY, b: 1, h: 22 });
    names.forEach((n, q) => put(r, first + q * per + 1, first + (q + 1) * per, n, { fill: q === sel ? YEL : null, b: q === sel }));
    frame(r, r, 1, NC, {}, {}); r++; gap();
    for (let k = 0; k < f.sec.length; k++) { const sec = f.sec[k], d = S.s[k] || (sec.t === 'rows' ? [{}] : {});
      put(r, 1, NC - 8, `${k + 1}) ${sec.h}`, { l: 1, b: 1, sz: 11, h: 22 }); if (sec.u) put(r, NC - 7, NC, '단위 : 백만원', { r: 1, sz: 9 }); r++;
      if (sec.t === 'txt') { const v = String(d[0] || ''); put(r, 1, NC, v, { l: 1, ind: 1, h: Math.max(60, lines(v, [1, NC]) * 15 + 12) }); frame(r, r, 1, NC, {}, {}); r++; }
      else if (sec.t === 'kv') await kvTable(sec, d, k); else if (sec.t === 'grid') gridTable(sec, d); else rowsTable(sec, d);
      gap(); }
    const txt = (h, a, min) => { put(r, 1, NC, h, { l: 1, b: 1, sz: 11, h: 22 }); r++; const L = a.filter(v => String(v || '').trim()), n = Math.max(L.length, min);
      for (let q = 0; q < n; q++) { const v = circ(q) + ' ' + (L[q] || ''); put(r, 1, NC, v, { l: 1, ind: 1, h: Math.max(20, lines(v, [1, NC]) * 15 + 5) }); r++; } gap(); };
    const ns = f.sec.length; txt(`${ns + 1}) 진행 사항`, S.L.prog, 2); txt(`${ns + 2}) 예정 사항`, S.L.plan, 2); txt(`${ns + 3}) 지원 요청 :`, S.L.req, 1);
    const buf = await wb.xlsx.writeBuffer(), fname = title.replace(/[\\/:*?"<>|]/g, '') + '.xlsx';
    let dl = null; try { dl = await window.claude.use('downloads'); } catch (e) {}
    if (dl) { await dl.save({ filename: fname, data: buf }); return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })); a.download = fname; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  const prevS = (f, S, title, names, sel) => {
    const E = x => esc(x == null ? '' : x);
    let h = `<div class="pt1">① ${E(title)}</div>${f.note ? `<div class="nt">${E(f.note)}</div>` : ''}<table class="sg"><tr><th>구분</th>${names.map((n, q) => `<td class="${q === sel ? 'yl' : ''}">${E(n)}</td>`).join('')}</tr></table>`;
    f.sec.forEach((sec, k) => {
      const d = S.s[k] || (sec.t === 'rows' ? [{}] : {});
      h += `<h5>${k + 1}) ${E(sec.h)}${sec.u ? '<span class="un">단위 : 백만원</span>' : ''}</h5>`;
      if (sec.t === 'txt') h += `<div class="tx">${E(d[0]).replace(/\n/g, '<br>')}</div>`;
      else if (sec.t === 'kv') {
        (sec.lay || [sec.f.map((_, j) => j)]).forEach(g => { h += '<table class="tb"><tr>' + g.map(x => `<th>${E(sec.f[x].replace(/^매[입출] /, ''))}</th>`).join('') + '</tr><tr>' + g.map(x => `<td class="${/코드/.test(sec.f[x]) ? 'rd' : ''}">${E(d[x])}</td>`).join('') + '</tr></table>'; });
        if (sec.img) h += '<div class="ib2">' + Array.from({ length: sec.img }, (_, n) => { const im = S.imgs && S.imgs[k + '_' + n]; return `<div>${im ? `<img src="${im}" alt="">` : circ(n)}</div>`; }).join('') + '</div>';
      } else if (sec.t === 'rows') {
        const cs = cols(sec); let t = '<table class="tb">';
        if (sec.g.some(g => g[0])) t += '<tr>' + sec.g.map(g => `<th colspan="${g[1].length}">${E(g[0])}</th>`).join('') + '</tr>';
        t += '<tr>' + cs.map(c => `<th>${E(c.l)}</th>`).join('') + '</tr>';
        let rows = d.filter(row => Object.values(row).some(v => String(v).trim())); if (!rows.length) rows = [{}];
        rows.forEach(row => { t += '<tr>' + cs.map((c, j) => `<td class="${/코드/.test(c.l) ? 'rd' : ''}">${E(row[j])}</td>`).join('') + '</tr>'; });
        h += t + '</table>';
      } else {
        const cs = cols(sec); let t = '<table class="tb"><tr><th rowspan="2">구분</th>' + sec.g.map(g => `<th colspan="${g[1].length}">${E(g[0])}</th>`).join('') + '</tr><tr>' + cs.map(c => `<th>${E(c.l)}</th>`).join('') + '</tr>';
        sec.rl.forEach((rn, n) => { const v = d[n] || {}; t += `<tr><th>${E(rn)}</th>` + cs.map((c, j) => `<td>${E(c.f ? gcell(sec, v, j) : v[j])}</td>`).join('') + '</tr>'; });
        if (sec.tot) { const tt = totals(sec, d); t += '<tr><th>합계</th>' + cs.map((c, j) => `<td><b>${E(c.f ? gcell(sec, tt, j) : (sec.tot.includes(j) ? fmt(tt[j]) : ''))}</b></td>`).join('') + '</tr>'; }
        h += t + '</table>';
      }
    });
    const lst = (hd, arr, min) => { const L = (arr || []).filter(v => String(v || '').trim()), n = Math.max(L.length, min); let o = `<h5>${hd}</h5>`; for (let q = 0; q < n; q++) o += `<div class="ln">${circ(q)} ${E(L[q] || '')}</div>`; return o; };
    const ns = f.sec.length;
    return h + lst(`${ns + 1}) 진행 사항`, S.L.prog, 2) + lst(`${ns + 2}) 예정 사항`, S.L.plan, 2) + lst(`${ns + 3}) 지원 요청 :`, S.L.req, 1);
  };
  const blankS = () => ({ h: { bu: '', nm: '', act: '', mgr: '' }, s: {}, L: { prog: ['', ''], plan: ['', ''], req: [''] }, imgs: {} });
  const sctx = r => { const t = window.ACTIVITY_TYPES.find(x => x.code === r.code[0]), i = +r.code.slice(1) - 1, tabs = TABS[r.code], tab = r.tab || 0; return { t, i, f: formOf(r.code, tab), S: Object.assign(blankS(), r.data), names: tabs ? tabs.map(x => x[0]) : (t.direct ? [t.title] : t.subs), sel: tabs ? tab : (t.direct ? 0 : i) }; };
  window.Forms.S = {
    open: r => { const key = r.code + (TABS[r.code] ? '_' + (r.tab || 0) : ''); drafts[key] = Object.assign(blankS(), r.data, { _id: r.id }); TI[r.code] = r.tab || 0; },
    preview: r => { const c = sctx(r); return prevS(c.f, c.S, r.title, c.names, c.sel); },
    excel: r => { const c = sctx(r); return toExcelS(c.f, c.S, r.title, c.names, c.sel); }
  };

  const old = window.Forms.render;
  window.Forms.render = function (app, t, i, I, back, go) { return (t.direct || isS(t.code + (i + 1))) ? renderS(app, t, i, I, back, go) : old.apply(this, arguments); };
})();
