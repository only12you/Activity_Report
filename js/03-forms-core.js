// 2단계: 서브유형별 입력 양식 + Excel 보고서. 새 양식은 FORMS 에 추가하고 READY 에 코드를 넣으면 됩니다.
(function () {
  const BU = ['건축', '플랜트', '일반공업', '리피니시', '실란트', 'PCM', 'OEM', '재고자산', '분체', '상품'];
  window.READY = new Set(['A1', 'A2']);
  const T = (k, l, s, ph) => ({ k, l, s, ph }), C = (k, l, s) => ({ k, l, s, c: 1 });
  const five = [T('start', '공사시작', 1, '25.11'), T('end', '공사종료', 1, '27.12'), T('b', '지하', 1, '1B'), T('f', '지상', 1, '2F'), T('dong', '동', 1), T('hh', '세대수', 1)];
  const sp = (g, items) => items.map(i => ({ g, i }));
  const F = {
    A1: {
      ov: [[T('code', '현장 코드', 2), T('pname', '프로젝트명칭', 4)], [T('addr', '소재지', 4), T('prom', '판촉 주체 / 담당자', 2)],
        [T('dev', '시행사', 2), T('des', '설계사', 2), T('bld', '시공사', 2)], [T('area', '연면적', 2, '163,917㎡'), T('use', '주용도', 2), T('sup', '감리업체', 2)],
        five, [T('stage', '현공정', 2), T('memo', '비고', 4)]],
      mh: ['사업부', '품목', '현장스펙 / 당사제품', '물량', '단위', '금액 (백만원)', '수주/판매업체'], vend: '수주/판매업체',
      rows: [...sp('내외장재', ['G/S', 'G/T', 'M/T', '기타', '상품']), ...sp('보온재', ['G/W', 'M/W', '기타', '상품']), ...sp('창호', ['']), ...sp('공업도료', ['일반공업']),
        ...sp('유통도료', ['수성', '에폭시', '내화도료', '플랜트']), ...sp('상품', ['', ''])]
    },
    A2: {
      ov: [[T('code', '현장 코드', 2), T('pname', '현장명', 4)], [T('addr', '소재지', 4), T('prom', '판촉 주체 / 담당자', 2)],
        [T('bid', '입찰 게시일', 2, '2025-11-13'), T('sup', '감리업체', 2), T('win', '수주업체', 2)],
        [C('ext', '외부', 1), C('int', '내부', 1), C('park', '주차장', 1), C('wp', '방수', 1), T('amt', '금액 (백만원)', 2)],
        five, [C('our', '당사 디자인 제출', 2), C('rival', '경쟁사 디자인 제출', 2), C('pat', '특허공법', 2)]],
      mh: ['도장사양', '현장스펙 / 당사제품', '물량', '단위', '금액 (백만원)', '도장업체'], vend: '도장업체',
      rows: sp('', ['외부', '내부', '주차장', '방수'])
    }
  };
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const drafts = {}, afP = new Set(); let lastMsg = '';
  const load = src => new Promise((ok, no) => {
    if (window.ExcelJS) return ok();
    const s = document.createElement('script'); s.src = src; s.onload = ok;
    s.onerror = () => no(new Error('엑셀 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.')); document.head.appendChild(s);
  });
  const shrink = (file, cb, max = 900) => {
    const im = new Image(), u = URL.createObjectURL(file);
    im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k;
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); cb(c.toDataURL('image/jpeg', .8), c.height / c.width); };
    im.src = u;
  };
  const cropRegion = (url, p) => new Promise(ok => { const im = new Image(); im.onload = () => {
    const x0 = Math.max(0, p.x), y0 = Math.max(0, p.y), x = x0 * im.width, y = y0 * im.height, w = Math.min(p.w, 1 - x0) * im.width, h = Math.min(p.h, 1 - y0) * im.height;
    if (w < 20 || h < 20) return ok(null); const k = Math.min(1, 900 / Math.max(w, h)), c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
    c.getContext('2d').drawImage(im, x, y, w, h, 0, 0, c.width, c.height); ok({ url: c.toDataURL('image/jpeg', .85), asp: c.height / c.width }); }; im.onerror = () => ok(null); im.src = url; });

  const cropCover = (url, asp) => new Promise(ok => { const im = new Image(); im.onload = () => {
    let sw = im.width, sh = im.height; if (sh / sw > asp) sh = sw * asp; else sw = sh / asp;
    const c = document.createElement('canvas'); c.width = Math.round(sw); c.height = Math.round(sh);
    c.getContext('2d').drawImage(im, (im.width - sw) / 2, (im.height - sh) / 2, sw, sh, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', .85)); };
    im.onerror = () => ok(url); im.src = url; });

  async function toExcel(code, t, f, d, title, sub) {
    await load('https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js');
    const NC = 22, UW = 5.4, CPX = Math.round(UW * 7 + 5);
    const wb = new ExcelJS.Workbook(), ws = wb.addWorksheet(code, { views: [{ showGridLines: false }], pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
    ws.columns = Array.from({ length: NC }, () => ({ width: UW }));
    const thin = { style: 'thin' }, med = { style: 'medium' }, bd = { top: thin, left: thin, bottom: thin, right: thin };
    const GRAY = 'FFF2F2F2', YEL = 'FFFFFF00';
    let r = 1;
    const cell = (row, c1, c2, v, o = {}) => {
      if (c2 > c1) ws.mergeCells(row, c1, row, c2);
      const c = ws.getCell(row, c1); c.value = v;
      c.alignment = { horizontal: o.left ? 'left' : 'center', vertical: 'middle', wrapText: true };
      c.font = { name: '맑은 고딕', size: o.sz || 10, bold: !!o.b, color: o.red ? { argb: 'FFFF0000' } : undefined };
      if (o.fill) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: o.fill } };
      if (!o.nb) for (let x = c1; x <= c2; x++) ws.getCell(row, x).border = bd;
      ws.getRow(row).height = o.h || 20;
    };
    const box = (r1, r2, c1, c2) => { for (let y = r1; y <= r2; y++) for (let x = c1; x <= c2; x++) { const c = ws.getCell(y, x), b = Object.assign({}, c.border || bd);
      if (y === r1) b.top = med; if (y === r2) b.bottom = med; if (x === c1) b.left = med; if (x === c2) b.right = med; c.border = b; } };
    cell(r++, 1, NC, '① ' + title, { nb: 1, left: 1, b: 1, sz: 13, h: 26 }); r++;
    const SL = sub.all.length, per = Math.floor((NC - 4) / SL), first = NC - per * SL;
    cell(r, 1, first, '구분', { fill: GRAY, b: 1 });
    sub.all.forEach((n, i) => cell(r, first + i * per + 1, first + (i + 1) * per, n, { fill: i === sub.i ? YEL : undefined }));
    box(r, r, 1, NC); r += 2;
    cell(r++, 1, NC, '1) 현장 개요', { nb: 1, left: 1, b: 1 });
    const ov0 = r;
    f.ov.forEach(row => {
      let c = 1;
      row.forEach(x => { cell(r, c, c + x.s * 2 - 1, x.k === 'prom' ? '판촉 주체' : x.l, { fill: GRAY }); c += x.s * 2; });
      c = 1;
      row.forEach(x => { cell(r + 1, c, c + x.s * 2 - 1, x.c ? (d.ov[x.k] ? '●' : '') : ((x.k === 'prom' ? d.h.mgr : x.k === 'pname' ? (d.ov.pname || d.h.site) : d.ov[x.k]) || ''), { h: 22, red: x.k === 'code' }); c += x.s * 2; });
      r += 2;
    });
    const ovEnd = r - 1;
    cell(ov0, 13, NC, '이미지', { fill: GRAY });
    ws.mergeCells(ov0 + 1, 13, ovEnd, NC);
    for (let y = ov0 + 1; y <= ovEnd; y++) for (let x = 13; x <= NC; x++) ws.getCell(y, x).border = bd;
    let imgs = [0, 1].filter(k => d.sp && d.sp[k]).map(k => ({ u: d.sp[k] }));
    if (!imgs.length && d.photo) imgs = [{ u: d.photo }]; // 현장 사진이 없으면 개요판 사진이라도 이미지 칸에 넣는다
    if (imgs.length) {
      let H = 0; for (let y = ov0 + 1; y <= ovEnd; y++) H += (ws.getRow(y).height || 20) * 4 / 3;
      const W = CPX * (NC - 12), gap = 4, n = imgs.length, sw = (W - gap * (n - 1) - 2 * n) / n, sh = H - 4;
      for (let k = 0; k < n; k++) { const u = await cropCover(imgs[k].u, sh / sw);
        ws.addImage(wb.addImage({ base64: u, extension: 'jpeg' }), { tl: { col: 12 + (1 + k * (sw + gap + 2)) / CPX, row: ov0 + .03 }, br: { col: 12 + (1 + k * (sw + gap + 2) + sw) / CPX, row: ovEnd - .03 }, editAs: 'oneCell' }); }
    }
    box(ov0, ovEnd, 1, NC);
    r++; cell(r++, 1, NC, '2) 자재 정보', { nb: 1, left: 1, b: 1 });
    const two = f.mh.length === 7;
    const spans = two ? [[1, 2], [3, 4], [5, 10], [11, 12], [13, 14], [15, 18], [19, 22]] : [[1, 2], [3, 10], [11, 12], [13, 14], [15, 18], [19, 22]];
    const mt0 = r;
    f.mh.forEach((h, i) => cell(r, spans[i][0], spans[i][1], h, { fill: GRAY })); r++;
    const used = f.rows.map((x, n) => ({ x, n })).filter(o => { const m = d.m[o.n] || {}; return ['spec', 'qty', 'unit', 'amt', 'vendor'].some(k => String(m[k] || '').trim()); });
    const m0 = r; let sum = 0;
    used.forEach(({ x, n }) => {
      const m = d.m[n] || {}, vals = two ? [x.g, x.i, m.spec, m.qty, m.unit, m.amt, m.vendor] : [x.i, m.spec, m.qty, m.unit, m.amt, m.vendor];
      sum += parseFloat(String(m.amt || '').replace(/,/g, '')) || 0;
      vals.forEach((v, i) => { if (two && (i === 0 || (i === 1 && !x.i))) return; cell(r, spans[i][0], spans[i][1], v || '', { left: i === (two ? 2 : 1) }); });
      r++;
    });
    if (two) { let s = 0; while (s < used.length) { let e = s; while (e + 1 < used.length && used[e + 1].x.g === used[s].x.g) e++;
      const c2 = used[s].x.i ? 2 : 4; ws.mergeCells(m0 + s, 1, m0 + e, c2); const c = ws.getCell(m0 + s, 1); c.value = used[s].x.g; c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }; c.font = { name: '맑은 고딕', size: 10 };
      for (let y = m0 + s; y <= m0 + e; y++) for (let x = 1; x <= c2; x++) ws.getCell(y, x).border = bd; s = e + 1; } }
    cell(r, 1, 14, '합계', { b: 1 }); cell(r, 15, 18, sum, { b: 1 }); ws.getCell(r, 15).numFmt = '#,##0.##'; cell(r, 19, NC, '', {});
    box(mt0, r, 1, NC); r += 2;
    const circ = n => n < 20 ? String.fromCharCode(0x2460 + n) : '(' + (n + 1) + ')';
    const txt = (h, arr, min) => { cell(r++, 1, NC, h, { nb: 1, left: 1, b: 1 }); const L = arr.filter(v => String(v || '').trim()), n = Math.max(L.length, min);
      for (let k = 0; k < n; k++) cell(r++, 1, NC, circ(k) + ' ' + (L[k] || ''), { nb: 1, left: 1, h: Math.max(20, 16 * Math.ceil((L[k] || '').length / 50)) }); r++; };
    txt('3) 진행 사항', d.prog, 2); txt('4) 예정 사항', d.plan, 2); txt('5) 지원 요청 :', d.req, 1);
    const buf = await wb.xlsx.writeBuffer();
    const fname = title.replace(/[\\/:*?"<>|]/g, '') + '.xlsx';
    let dl = null; try { dl = await window.claude.use('downloads'); } catch (e) {}
    if (dl) { await dl.save({ filename: fname, data: buf }); return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    a.download = title.replace(/[\\/:*?"<>|]/g, '') + '.xlsx'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  // 공사 개요판 사진 → 항목 자동 추출 (아트팩트: Claude 샘플 기능 / zip 앱: 자동 입력 없음, API 키 사용 안 함)
  const SIGN = new Set(['pname', 'addr', 'dev', 'des', 'bld', 'area', 'use', 'sup', 'start', 'end', 'b', 'f', 'dong', 'hh']);
  const dataBlob = u => { const bin = atob(u.split(',')[1]), a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return new Blob([a], { type: 'image/jpeg' }); };
  const parseJSON = s => { const m = String(s).match(/\{[\s\S]*\}/); if (!m) throw new Error('결과를 해석하지 못했습니다.'); return JSON.parse(m[0]); };

  // ===== 키 없이 기기에서 글자 읽기(Tesseract OCR) → 공사 개요판 항목 추출 =====
  const parseSign = raw => {
    const L = String(raw || '').replace(/\r/g, '').split('\n').map(x => x.replace(/[ \t　]+/g, ' ').trim()).filter(Boolean);
    const LBL = { pname: ['프로젝트명칭', '공사명', '사업명', '현장명', '공사이름', '프로젝트명'], addr: ['공사위치', '대지위치', '현장위치', '사업위치', '소재지', '위치'], dev: ['건축주', '시행자', '시행사', '사업주체', '발주처', '발주자'],
      des: ['설계자', '설계사', '설계업체', '설계'], bld: ['시공자', '시공사', '시공업체', '건설사', '시공'], sup: ['감리자', '감리단', '감리업체', '감리'], area: ['연면적'], use: ['주용도', '용도'] };
    const rx = lab => new RegExp(lab.split('').join('\\s*') + '\\s*[:：|｜\\-]?\\s*(.+)$');
    const clean = v => String(v || '').replace(/^[\s|｜:：\-·.]+|[\s|｜]+$/g, '').trim();
    const ov = {}, yymm = (y, m) => String(y).slice(-2) + '.' + String(m).padStart(2, '0');
    for (const k in LBL) {
      for (const line of L) {
        let v = '';
        for (const lab of LBL[k]) { const m = line.match(rx(lab)); if (m && clean(m[1]).length >= 2) { v = clean(m[1]); break; } }
        if (v) { ov[k] = v; break; }
      }
    }
    { const m = String(raw || '').match(/(?<!\d)(20\d{8})(?!\d)/); if (m) ov.code = m[1]; }
    if (ov.area) { const m = String(ov.area).match(/(\d[\d,\.]*)\s*(㎡|m2|m²|㎡|M2)?/); ov.area = m ? m[1] + '㎡' : ov.area; }
    const dre = /(20\d{2}|\d{2})\s*[.\-/년]\s*(\d{1,2})/g;
    for (const line of L) {
      if (/공사\s*기간|착공|준공|완공/.test(line)) { const ds = [...line.matchAll(dre)].map(m => yymm(m[1], m[2])); if (ds[0] && !ov.start) ov.start = ds[0]; if (ds[1] && !ov.end) ov.end = ds[1]; }
    }
    const all = L.join(' ');
    let m;
    if ((m = all.match(/지하\s*(\d+)\s*층/))) ov.b = m[1] + 'B';
    if ((m = all.match(/지상\s*(\d+)\s*층/))) ov.f = m[1] + 'F';
    if ((m = all.match(/(\d+)\s*개?\s*동/))) ov.dong = m[1];
    if ((m = all.match(/(\d[\d,]*)\s*세대/))) ov.hh = m[1].replace(/,/g, '');
    return { h: { site: ov.pname || '' }, ov, m: {}, prog: [], plan: [], req: [] };
  };
  // 보고서 표(라벨 칸 아래에 값 칸) 형태의 사진: 글자 위치(좌표)로 라벨 바로 아래 값을 찾음
  const parsePos = words => {
    const W = (words || []).filter(w => w && w.text && w.bbox && String(w.text).trim()).map(w => { const b = w.bbox; return { t: String(w.text).trim(), x0: b.x0, x1: b.x1, y0: b.y0, y1: b.y1, cx: (b.x0 + b.x1) / 2, cy: (b.y0 + b.y1) / 2, h: b.y1 - b.y0 }; });
    if (W.length < 4) return {};
    const hs = W.map(w => w.h).sort((a, b) => a - b), H = hs[hs.length >> 1] || 20;
    const LB = { code: ['현장코드'], pname: ['프로젝트명칭', '프로젝트명'], addr: ['소재지'], dev: ['시행사'], des: ['설계사'], bld: ['시공사'], area: ['연면적'], use: ['주용도'], sup: ['감리업체'], start: ['공사시작'], end: ['공사종료'], b: ['지하'], f: ['지상'], dong: ['동'], hh: ['세대수'], stage: ['현공정'], memo: ['비고'] };
    const ALL = new Set([].concat(...Object.values(LB), ['판촉주체', '담당자', '이미지', '구분']));
    const rows = []; W.slice().sort((a, b) => a.cy - b.cy).forEach(w => { const r = rows.find(r => Math.abs(r.cy - w.cy) < H * .6); if (r) { r.w.push(w); r.cy = (r.cy * (r.w.length - 1) + w.cy) / r.w.length; } else rows.push({ cy: w.cy, w: [w] }); });
    rows.forEach(r => r.w.sort((a, b) => a.x0 - b.x0)); rows.sort((a, b) => a.cy - b.cy);
    const strip = x => x.replace(/[\s|｜:：·.]/g, '');
    const out = {}, used = new Set();
    for (const k in LB) {
      let hit = null;
      rows.forEach((r, ri) => { if (hit) return; for (let i = 0; i < r.w.length && !hit; i++) { let j = i, tx = ''; while (j < r.w.length && j < i + 3) { tx += strip(r.w[j].t); if (LB[k].includes(tx)) { hit = { ri, i, j }; break; } if (tx.length > 6) break; j++; } } });
      if (!hit) continue;
      const r = rows[hit.ri], ws = r.w.slice(hit.i, hit.j + 1), lx0 = Math.min(...ws.map(w => w.x0)), lx1 = Math.max(...ws.map(w => w.x1)), lc = (lx0 + lx1) / 2, lw = lx1 - lx0, tol = Math.max(lw * 1.2, H * 5);
      for (let q = hit.ri + 1; q < rows.length && q <= hit.ri + 2; q++) {
        const c = rows[q].w.filter(w => Math.abs(w.cx - lc) <= tol + (w.x1 - w.x0) / 2);
        if (!c.length) continue;
        let st = c.reduce((m, w) => Math.abs(w.cx - lc) < Math.abs(m.cx - lc) ? w : m), L = rows[q].w.indexOf(st), R = L;
        const gap = H * 1.1;
        while (L > 0 && rows[q].w[L].x0 - rows[q].w[L - 1].x1 < gap) L--;
        while (R < rows[q].w.length - 1 && rows[q].w[R + 1].x0 - rows[q].w[R].x1 < gap) R++;
        const seg = rows[q].w.slice(L, R + 1), v = seg.map(w => w.t).join(' ').replace(/^[\s|｜:：]+|[\s|｜]+$/g, '').trim();
        if (!v) continue;
        if (seg.some(w => ALL.has(strip(w.t)))) break;   // 값 칸이 비어 있고 다음 라벨 줄이 잡힌 경우
        const key = q + ':' + L; if (used.has(key)) break; used.add(key);
        out[k] = v; break;
      }
    }
    if (out.area) { const m = out.area.match(/(\d[\d,\.]*)\s*(㎡|m2|m²|M2)?/); if (m) out.area = m[1] + '㎡'; }
    if (out.code) { const m = out.code.replace(/\s/g, '').match(/\d{8,12}/); out.code = m ? m[0] : out.code; }
    ['dong', 'hh'].forEach(k => { if (out[k]) { const m = out[k].match(/\d[\d,]*/); if (m) out[k] = m[0]; } });
    return out;
  };
  window.__parsePos = parsePos;
  window.__parseSign = parseSign;
  const ocrPrep = url => new Promise((ok, no) => { const im = new Image(); im.onload = () => { const L = Math.max(im.width, im.height), k = L > 2600 ? 2400 / L : L < 1600 ? Math.min(2.5, 2000 / L) : 1, c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
    const g = c.getContext('2d'); g.drawImage(im, 0, 0, c.width, c.height); const d = g.getImageData(0, 0, c.width, c.height), p = d.data; let mn = 255, mx = 0;
    for (let i = 0; i < p.length; i += 4) { const y = (p[i] * .3 + p[i + 1] * .59 + p[i + 2] * .11) | 0; p[i] = p[i + 1] = p[i + 2] = y; if (y < mn) mn = y; if (y > mx) mx = y; }
    const sc = 255 / Math.max(40, mx - mn); for (let i = 0; i < p.length; i += 4) { const y = Math.max(0, Math.min(255, (p[i] - mn) * sc)); p[i] = p[i + 1] = p[i + 2] = y; }
    { const W = c.width, H = c.height, M = Math.max(40, Math.round(Math.min(W, H) * .08)), kill = new Uint8Array(W * H), dk = (x, y) => p[(y * W + x) * 4] < 140;
      for (let y = 0; y < H; y++) { let x = 0; while (x < W) { if (dk(x, y)) { const s = x; while (x < W && dk(x, y)) x++; if (x - s >= M) for (let q = s; q < x; q++) kill[y * W + q] = 1; } else x++; } }
      for (let x = 0; x < W; x++) { let y = 0; while (y < H) { if (dk(x, y)) { const s = y; while (y < H && dk(x, y)) y++; if (y - s >= M) for (let q = s; q < y; q++) kill[q * W + x] = 1; } else y++; } }
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (kill[y * W + x]) for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H) { const i = (Y * W + X) * 4; p[i] = p[i + 1] = p[i + 2] = 255; } } }
    g.putImageData(d, 0, 0); ok(c); }; im.onerror = () => no(new Error('사진을 열지 못했어요.')); im.src = url; });
  let OCRW = null;
  async function ocrSign(url) {
    const U = p => new URL(p, location.href).href;
    const loadJs = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('load')); document.head.append(s); });
    if (!window.Tesseract) { try { await loadJs(U('vendor/ocr/tesseract.min.js')); } catch (e) { try { await loadJs('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'); } catch (e2) { throw new Error('글자 읽기 도구를 불러오지 못했어요 (vendor/ocr 폴더가 함께 올라갔는지 확인하세요).'); } } }
    if (!OCRW) OCRW = await Promise.race([window.Tesseract.createWorker('kor+eng', 1, { workerPath: U('vendor/ocr/worker.min.js'), corePath: U('vendor/ocr/core'), langPath: U('vendor/ocr/lang'), gzip: true }), new Promise((_, no) => setTimeout(() => no(new Error('글자 읽기 준비가 오래 걸려요 (vendor/ocr/lang 파일 확인).')), 120000))]);
    const c = await ocrPrep(url);
    const run = async psm => { try { await OCRW.setParameters({ tessedit_pageseg_mode: psm, user_defined_dpi: '300', preserve_interword_spaces: '1' }); } catch (e) {}
      const r = await OCRW.recognize(c), res = parseSign(r.data.text); let pp = {}; try { pp = parsePos(r.data.words); } catch (e) {}
      const signStyle = ['pname', 'addr', 'dev', 'des', 'bld', 'area', 'use'].filter(k => res.ov[k]).length >= 4;   // '라벨 값' 한 줄 형태(공사 개요판)면 글자 줄 해석을 우선
      Object.keys(pp).forEach(k => { if (pp[k] && !(signStyle && res.ov[k])) res.ov[k] = pp[k]; }); return { r, res }; };
    let best = await run('4');
    if (Object.keys(best.res.ov).length < 4) { const b2 = await run('11'); if (Object.keys(b2.res.ov).length > Object.keys(best.res.ov).length) best = b2; }
    const r = best.r, res = best.res;
    if (res.ov.pname) res.h.site = res.ov.pname;
    if (!Object.keys(res.ov).length) throw new Error('사진에서 항목을 찾지 못했어요. 읽힌 글자: “' + String(r.data.text || '').replace(/\s+/g, ' ').slice(0, 120) + '” — 표 전체가 화면에 반듯하게 꽉 차도록 다시 찍어 보세요.');
    return res;
  }
  async function readSign(url, fields, rowsTxt) {
    const q = '첨부 사진은 (가) 공사 개요 표지판이거나 (나) 작성이 끝난 현장 보고서(표 양식)입니다. 사진에 실제로 적힌 내용만 읽어 아래 형식의 JSON 객체 하나로만 답하세요(설명·코드블록 금지). 보이지 않거나 불확실한 값은 빈 문자열("")이나 빈 배열로 두고 절대 추측하지 마세요. 날짜는 YY.MM 형식(예: 25.11), 지하/지상은 1B, 15F 형식, 연면적은 숫자와 단위(예: 163,917㎡)로 쓰고, 표에 적힌 숫자·금액은 적힌 그대로 문자열로 쓰세요. 건축주·발주처는 시행사, 설계자는 설계사, 시공자는 시공사, 공사기간은 공사시작·공사종료로 나누세요.\n' +
      '형식: {"h":{"bu":"사업부","site":"현장명","act":"활동 내용","mgr":"담당자(판촉 주체)"},"ov":{현장 개요 항목},"m":{"자재행번호":{"spec":"현장스펙/당사제품","qty":"물량","unit":"단위","amt":"금액","vendor":"업체"}},"prog":["진행 사항"],"plan":["예정 사항"],"req":["지원 요청"],"photo":{"x":0.55,"y":0.2,"w":0.4,"h":0.5}}\n' +
      '- h: 보고서 제목이 "코드. 유형 : [사업부] 현장명 활동내용 [담당자]" 형태면 나눠서 넣으세요.\n- ov 항목(키: 의미)\n' + fields.map(x => `"${x.k}": ${x.l}${x.c ? ' (● 표시가 있으면 true, 없으면 false)' : ''}`).join('\n') +
      '\n- m: 자재 정보 표에서 내용이 적힌 행만, 아래 행번호를 키로 넣으세요.\n' + rowsTxt + '\n- prog·plan·req: 진행 사항·예정 사항·지원 요청의 ①②③ 항목을 번호 기호 없이 한 줄씩 문자열 배열로 쓰세요.\n- photo: 첨부 사진이 작성된 보고서의 "이미지" 칸이거나 공사 개요판(표지판)일 때, 그 안의 조감도·완공 예상도·현장 사진만 담긴 영역의 왼쪽 위 좌표 x,y와 너비 w, 높이 h를 첨부 사진 전체 크기 대비 0~1 사이 비율로 쓰세요(글자 표 부분은 제외). 그런 그림이 없으면 "photo":null 로 쓰세요.';
    let cl = null; try { if (window.claude && window.claude.use) cl = await window.claude.use('sample'); } catch (e) {}
    if (cl) {
      if (cl.limits && !(await cl.limits()).images) throw new Error('이 화면에서는 사진 인식을 사용할 수 없습니다.');
      return parseJSON((await cl(q, { images: [dataBlob(url)], cache: false })).text);
    }
    // API 키 입력·저장 기능 제거: 이전에 저장된 키가 있으면 삭제
    try { localStorage.removeItem('ar-key'); } catch (e) {}
    return ocrSign(url);
  }

  const prevA = (code, d, title) => {
    const f = F[code], t = window.ACTIVITY_TYPES.find(x => x.code === code[0]), i = +code.slice(1) - 1, E = x => esc(x == null ? '' : x);
    const circ = n => n < 20 ? String.fromCharCode(0x2460 + n) : '(' + (n + 1) + ')';
    const V = x => E(x.c ? (d.ov[x.k] ? '●' : '') : ((x.k === 'prom' ? d.h.mgr : x.k === 'pname' ? (d.ov.pname || d.h.site) : d.ov[x.k]) || ''));
    let h = `<div class="pt1">① ${E(title)}</div><table class="sg"><tr><th>구분</th>${t.subs.map((s, n) => `<td class="${n === i ? 'yl' : ''}">${E(s)}</td>`).join('')}</tr></table><h5>1) 현장 개요</h5>`;
    const imgs = [0, 1].filter(k => d.sp && d.sp[k]).map(k => d.sp[k]); if (!imgs.length && d.photo) imgs.push(d.photo);
    h += '<div class="ovw"><div class="ovl"><table class="tb">' + f.ov.map(row => '<tr>' + row.map(x => `<th colspan="${x.s}">${E(x.k === 'prom' ? '판촉 주체' : x.l)}</th>`).join('') + '</tr><tr>' + row.map(x => `<td colspan="${x.s}" class="${x.k === 'code' ? 'rd' : ''}">${V(x)}</td>`).join('') + '</tr>').join('') + '</table></div>';
    h += `<div class="ovr"><div class="ih">이미지</div><div class="ib">${imgs.map(u => `<img src="${u}" alt="">`).join('')}</div></div></div>`;
    const KS = ['spec', 'qty', 'unit', 'amt', 'vendor'], two = f.mh.length === 7, num = x => parseFloat(String(x == null ? '' : x).replace(/,/g, '')) || 0;
    const used = f.rows.map((x, n) => ({ x, n })).filter(o => KS.some(k => String((d.m[o.n] || {})[k] || '').trim()));
    let sum = 0, mr = '', s = 0;
    while (s < used.length) { let e = s; if (two) while (e + 1 < used.length && used[e + 1].x.g === used[s].x.g) e++;
      for (let q = s; q <= e; q++) { const { x, n } = used[q], m = d.m[n] || {}; let tds = ''; sum += num(m.amt);
        if (two) { if (q === s) tds += `<td rowspan="${e - s + 1}"${x.i ? '' : ' colspan="2"'}>${E(x.g)}</td>`; if (x.i) tds += `<td>${E(x.i)}</td>`; } else tds += `<td>${E(x.i)}</td>`;
        mr += `<tr>${tds}<td class="l">${E(m.spec)}</td><td>${E(m.qty)}</td><td>${E(m.unit)}</td><td>${E(m.amt)}</td><td>${E(m.vendor)}</td></tr>`; }
      s = e + 1; }
    h += `<h5>2) 자재 정보</h5><table class="tb"><tr>${f.mh.map(x => `<th>${E(x)}</th>`).join('')}</tr>${mr}<tr><th colspan="${two ? 5 : 4}">합계</th><td><b>${sum.toLocaleString()}</b></td><td></td></tr></table>`;
    const lst = (hd, arr, min) => { const L = (arr || []).filter(v => String(v || '').trim()), n = Math.max(L.length, min); let o = `<h5>${hd}</h5>`; for (let q = 0; q < n; q++) o += `<div class="ln">${circ(q)} ${E(L[q] || '')}</div>`; return o; };
    return h + lst('3) 진행 사항', d.prog, 2) + lst('4) 예정 사항', d.plan, 2) + lst('5) 지원 요청 :', d.req, 1);
  };
  const blankA = code => ({ h: { bu: '', site: '', act: '', mgr: '' }, ov: {}, m: F[code].rows.map(() => ({})), prog: ['', ''], plan: ['', ''], req: [''], photo: null, sp: [null, null], sa: [0, 0] });

  window.Forms = {
    render(app, t, i, I, back, go) {
      const code = t.code + (i + 1), f = F[code];
      let d = drafts[code];
      if (!d) {
        d = { h: { bu: '', site: '', act: '', mgr: '' }, ov: {}, m: f.rows.map(() => ({})), prog: ['', ''], plan: ['', ''], req: [''], photo: null, sp: [null, null], sa: [0, 0] };
        try { const s = JSON.parse(localStorage.getItem('ar-d-' + code) || 'null'); if (s) d = Object.assign(d, s, { photo: null, sp: [null, null], sa: [0, 0] }); } catch (e) {}
        if (!Array.isArray(d.req)) d.req = [d.req || ''];
        try { const q = JSON.parse(localStorage.getItem('ar-sp-' + code) || 'null'); if (q && Array.isArray(q.sp)) { d.sp = q.sp; d.sa = q.sa || [0, 0]; } } catch (e) {}
        drafts[code] = d;
      }
      const persist = () => { try { localStorage.setItem('ar-d-' + code, JSON.stringify(Object.assign({}, d, { photo: null, sp: [null, null], sa: [0, 0] }))); } catch (e) {} };
      const saveSp = () => { try { localStorage.setItem('ar-sp-' + code, JSON.stringify({ sp: d.sp, sa: d.sa })); } catch (e) {} };
      const ph = (v, p) => v ? esc(v) : `<em>${p}</em>`;
      const titleHTML = () => `${code}. ${t.name} : [${ph(d.h.bu, '사업부')}] ${ph(d.h.site, '현장명')} ${ph(d.h.act, '활동내역')} [${ph(d.h.mgr, '담당자')}]`;
      const titleTxt = () => `${code}. ${t.name} : [${d.h.bu || '사업부'}] ${d.h.site || '현장명'} ${d.h.act || '활동내역'} [${d.h.mgr || '담당자'}]`;
      const inp = (p, v, l, ex = '') => `<label class="fd w4"><span>${l}</span><input data-p="${p}" value="${esc(v)}" ${ex}></label>`;
      const KS = ['spec', 'qty', 'unit', 'amt', 'vendor'];
      const filled = m => !!m && KS.some(k => String(m[k] || '').trim());
      const amtOf = n => parseFloat(String((d.m[n] || {}).amt || '').replace(/,/g, '')) || 0;
      const mbody = n => { const m = d.m[n] || {}, p = 'm.' + n + '.';
        return `<div class="mr"><input data-p="${p}spec" value="${esc(m.spec)}" placeholder="현장스펙 / 당사제품">
          <div class="m4"><input data-p="${p}qty" value="${esc(m.qty)}" placeholder="물량" inputmode="decimal"><input data-p="${p}unit" value="${esc(m.unit)}" placeholder="단위">
          <input data-p="${p}amt" value="${esc(m.amt)}" placeholder="금액" inputmode="decimal"><input data-p="${p}vendor" value="${esc(m.vendor)}" placeholder="${f.vend}"></div></div>`; };
      const mitem = (n, label) => `<details class="mi" data-n="${n}"${filled(d.m[n]) ? ' open' : ''}><summary>${esc(label)}<em class="mib"></em></summary>${mbody(n)}</details>`;
      const matHTML = () => { const gs = []; f.rows.forEach((x, n) => { const l = gs[gs.length - 1]; if (l && x.g && l.g === x.g) l.n.push(n); else gs.push({ g: x.g, n: [n] }); });
        return '<div class="mctl"><button type="button" id="mex">모두 펼치기</button><button type="button" id="mcl">모두 접기</button></div><div class="mctl"><button type="button" id="mmat">📋 자재정보 입력 (제품 DB · 사양 DB)</button></div>' +
          gs.map(g => g.g && g.n.length > 1
            ? `<details class="mg"${g.n.some(n => filled(d.m[n])) ? ' open' : ''}><summary>${esc(g.g)}<small class="mgs"></small></summary>${g.n.map((n, k) => mitem(n, f.rows[n].i || g.g + ' ' + (k + 1))).join('')}</details>`
            : g.n.map(n => { const x = f.rows[n]; return mitem(n, x.g ? x.g + (x.i ? ' · ' + x.i : '') : x.i); }).join('')).join(''); };
      const refreshMat = () => {
        app.querySelectorAll('details.mi').forEach(el => { const n = +el.dataset.n, b = el.querySelector('.mib'), ok = filled(d.m[n]); b.textContent = ok ? '입력됨' + (amtOf(n) ? ' · ' + amtOf(n).toLocaleString() : '') : ''; b.className = 'mib' + (ok ? ' on' : ''); });
        app.querySelectorAll('details.mg').forEach(el => { const ns = [...el.querySelectorAll('details.mi')].map(x => +x.dataset.n), c = ns.filter(n => filled(d.m[n])).length, s = ns.reduce((t, n) => t + amtOf(n), 0); el.querySelector('.mgs').textContent = c ? ' ' + c + '건' + (s ? ' · ' + s.toLocaleString() : '') : ''; });
        const mc = document.getElementById('mc'); if (mc) mc.textContent = d.m.filter(filled).length; };
      const circ = n => n < 20 ? String.fromCharCode(0x2460 + n) : '(' + (n + 1) + ')';
      const listHTML = k => d[k].map((v, n) => `<div class="li"><b>${circ(n)}</b><textarea rows="2" data-p="${k}.${n}">${esc(v)}</textarea><button type="button" class="x" data-del="${k}.${n}" aria-label="삭제">✕</button></div>`).join('') + `<button type="button" class="addb" data-add="${k}">＋ 항목 추가</button>`;
      const spHTML = () => `<div class="photo one"><b class="pt">추가 현장 사진</b>${[1].map(k => `<label class="pbtn"><i class="sth" id="spv${k}">${d.sp[k] ? `<img src="${d.sp[k]}" alt="">` : '📷'}</i> 사진 ${k + 1}<input type="file" accept="image/*" class="spi" data-k="${k}" hidden></label><button type="button" class="pbtn alt spx" data-k="${k}"${d.sp[k] ? '' : ' hidden'}>✕</button>`).join('')}</div>`;
      const sec = (k, h) => `<h4>${h}</h4><div id="ls-${k}">${listHTML(k)}</div>`;
      app.innerHTML = `<div class="step2 fm">
        <div class="top"><button id="bk" aria-label="뒤로">${I.back}</button><h2>${code}. ${t.subs[i]}</h2></div>
        <div class="tbox"><label>① 제목 (자동 생성)</label><div class="t" id="ttl">${titleHTML()}</div></div>
        <div class="fbox"><div class="fr">
          <label class="fd w2"><span>사업부</span><select data-p="h.bu"><option value="">선택</option>${BU.map(b => `<option${d.h.bu === b ? ' selected' : ''}>${b}</option>`).join('')}</select></label>
          <label class="fd w2"><span>담당자 (= 판촉 주체)</span><input data-p="h.mgr" value="${esc(d.h.mgr)}"></label>
          ${inp('h.site', d.h.site, '현장명', 'placeholder="예) KG 바이오탱크 신축공사"')}${inp('h.act', d.h.act, '활동 내용', 'placeholder="예) 판촉의 건"')}</div></div>
        <h4 data-j="1" class="ovt1">1) 현장 개요 <small>· 현장 사진</small></h4>
        <div class="gbt"><b>구분</b>${t.subs.map((s, n) => `<button data-go="${n}" class="${n === i ? 'y' : ''}">${s}</button>`).join('')}</div>
        <label class="ovbtn">📷 개요서 사진으로 자동 입력 (OCR)<input type="file" accept="image/*" class="phi" hidden></label><span id="pv" hidden></span><button type="button" id="rd" hidden></button><div class="msg" id="ai">개요서 사진을 올리면 표가 자동으로 채워져요. 노란 칸은 확인해 주세요.</div>
        <div class="ovw2"><table class="ovt">${f.ov.map(row => '<tr>' + row.map(x => `<th colspan="${x.s}">${x.k === 'prom' ? '판촉 주체' : x.l}</th>`).join('') + '</tr><tr>' + row.map(x => x.c
          ? `<td colspan="${x.s}"><label class="ck"><input type="checkbox" data-p="ov.${x.k}" ${d.ov[x.k] ? 'checked' : ''}><span>해당</span></label></td>`
          : `<td colspan="${x.s}"><textarea rows="1" class="${x.k === 'code' ? 'rd' : ''}" data-p="${x.k === 'prom' ? 'h.mgr' : 'ov.' + x.k}" placeholder="${x.k === 'prom' ? '담당자' : x.ph || ''}">${esc(x.k === 'prom' ? d.h.mgr : d.ov[x.k])}</textarea></td>`).join('') + '</tr>').join('')}</table>
          <div class="ovi"><div class="ovih">이미지</div><div class="ovib" id="spv0" role="button" tabindex="0">${d.sp[0] ? `<img src="${d.sp[0]}" alt="">` : '<span class="ovph">📷<br>눌러서<br>현장 사진 선택</span>'}</div><input type="file" accept="image/*" class="spi" data-k="0" hidden><button type="button" class="spx ovx" data-k="0"${d.sp[0] ? '' : ' hidden'}>✕ 삭제</button></div></div>
        <details class="mat"${d.m.some(m => Object.values(m).some(v => v)) ? ' open' : ''}><summary>2) 자재 정보 <small>입력 <b id="mc">0</b>건 · 합계 <b id="sum">0</b> 백만원</small></summary>
        ${matHTML()}</details>
        ${sec('prog', '3) 진행 사항')}${sec('plan', '4) 예정 사항')}${sec('req', '5) 지원 요청')}
        <div class="act"><button type="button" id="pvb">👁 미리보기</button><button type="button" id="svb">💾 저장</button><button type="button" id="nw">＋ 새로 작성</button></div><button class="cta xl" id="xl">📊 Excel 보고서 만들기</button><div class="msg" id="msg"></div></div>`;
      const sumUp = () => { const s = d.m.reduce((a, m) => a + (parseFloat(String(m.amt || '').replace(/,/g, '')) || 0), 0); document.getElementById('sum').textContent = s.toLocaleString(); };
      sumUp(); refreshMat();
      const grow = el => { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; };
      const growAll = () => app.querySelectorAll('.ovt textarea').forEach(grow); growAll(); setTimeout(growAll, 150);
      app.querySelector('.fm').addEventListener('input', e => { if (e.target.matches('.ovt textarea')) grow(e.target); });
      const flat = f.ov.flat().filter(x => x.k !== 'prom');
      const rowsTxt = f.rows.map((x, n) => n + ': ' + (x.g ? x.g + (x.i ? ' ' + x.i : '') : x.i)).join('\n');
      const auto = async () => {
        const st = document.getElementById('ai'); st.textContent = '🔍 사진에서 글자를 읽는 중… (처음 한 번은 언어 데이터를 내려받느라 1분쯤 걸릴 수 있어요)';
        try {
          const r = await readSign(d.photo, flat, rowsTxt); let n = 0; afP.clear();
          const S = v => (v == null ? '' : String(v)).trim(), h = r.h || {}, ov = r.ov || {};
          const bu = BU.find(b => S(h.bu).includes(b)); if (bu && !d.h.bu) { d.h.bu = bu; afP.add('h.bu'); n++; }
          ['site', 'act', 'mgr'].forEach(k => { if (S(h[k]) && !d.h[k]) { d.h[k] = S(h[k]); afP.add('h.' + k); n++; } });
          flat.forEach(x => { const v = ov[x.k]; if (x.c) { if (v === true && !d.ov[x.k]) { d.ov[x.k] = true; afP.add('ov.' + x.k); n++; } } else if (S(v) && !d.ov[x.k]) { d.ov[x.k] = S(v); afP.add('ov.' + x.k); n++; } });
          if (d.ov.pname && !d.h.site) { d.h.site = d.ov.pname; afP.add('h.site'); }
          Object.keys(r.m || {}).forEach(key => { const i2 = +key, src = r.m[key] || {}; if (!f.rows[i2] || filled(d.m[i2])) return;
            const row = {}; KS.forEach(k => { row[k] = S(src[k]); if (row[k]) afP.add('m.' + i2 + '.' + k); }); if (filled(row)) { d.m[i2] = row; n++; } });
          [['prog', r.prog], ['plan', r.plan], ['req', r.req]].forEach(([k, arr]) => { const L = (Array.isArray(arr) ? arr : []).map(S).filter(Boolean); if (!L.length) return;
            const cur = d[k].filter(v => S(v)), add = cur.length ? L.filter(v => !cur.includes(v)) : L; if (!add.length) return;
            d[k] = cur.concat(add); while (d[k].length < (k === 'req' ? 1 : 2)) d[k].push(''); add.forEach(v => afP.add(k + '.' + d[k].indexOf(v))); n += add.length; });
          let cropped = false; const ph = r.photo;
          if (ph && ['x', 'y', 'w', 'h'].every(k => typeof ph[k] === 'number') && ph.w > .05 && ph.h > .05 && !d.sp[0]) { const c = await cropRegion(d.photo, ph); if (c) { d.sp[0] = c.url; d.sa[0] = c.asp; saveSp(); cropped = true; n++; } }
          persist(); const y = window.scrollY;
          lastMsg = n ? `✅ ${n}개 항목을 자동 입력했어요. 노란 칸을 확인하고 틀린 곳은 고쳐 주세요.${cropped ? ' 보고서 속 현장 사진도 잘라서 사진 1 칸에 넣었어요.' : ''}` : '사진에서 읽을 수 있는 항목이 없어요. 직접 입력해 주세요.';
          window.Forms.render(app, t, i, I, back, go); window.scrollTo(0, y);
        } catch (err) { st.textContent = '⚠ 자동 입력 실패: ' + (err.message || err.code || err); }
      };
      const set = (p, v) => { const a = p.split('.'); let o = d; for (let j = 0; j < a.length - 1; j++) o = o[a[j]]; o[a[a.length - 1]] = v; };
      const on = e => {
        const el = e.target, p = el.dataset.p; if (!p) return;
        set(p, el.type === 'checkbox' ? el.checked : el.value);
        if (p.startsWith('h.')) { if (p === 'h.mgr' && !d.ov.prom) { /* 담당자는 제목용 */ } document.getElementById('ttl').innerHTML = titleHTML(); }
        if (p.startsWith('m.')) { sumUp(); refreshMat(); }
        if (p === 'h.mgr') app.querySelectorAll('[data-p="h.mgr"]').forEach(o => { if (o !== el) { o.value = el.value; if (o.matches('.ovt textarea')) { o.style.height = 'auto'; o.style.height = o.scrollHeight + 'px'; } } });
        persist();
      };
      app.querySelector('.fm').addEventListener('input', on); app.querySelector('.fm').addEventListener('change', on);
      const draw = k => { document.getElementById('ls-' + k).innerHTML = listHTML(k); persist(); };
      app.querySelector('.fm').addEventListener('click', e => {
        const a = e.target.closest('[data-add]'), x = e.target.closest('[data-del]');
        if (a) { d[a.dataset.add].push(''); draw(a.dataset.add); const t = app.querySelectorAll('#ls-' + a.dataset.add + ' textarea'); t[t.length - 1].focus(); }
        if (x) { const [k, n] = x.dataset.del.split('.'); if (d[k].length > 1) d[k].splice(+n, 1); else d[k][0] = ''; draw(k); }
      });
      app.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { const n = +b.dataset.go; if (n === i) return; go(n); });
      document.getElementById('bk').onclick = back;
      document.getElementById('spv0').onclick = () => app.querySelector('.spi[data-k="0"]').click();
      const spShow = k => { document.getElementById('spv' + k).innerHTML = d.sp[k] ? `<img src="${d.sp[k]}" alt="">` : (k === 0 ? '<span class="ovph">📷<br>눌러서<br>현장 사진 선택</span>' : '📷'); app.querySelector(`.spx[data-k="${k}"]`).hidden = !d.sp[k]; };
      app.querySelectorAll('.spi').forEach(i => i.onchange = e => { const k = +i.dataset.k, fl = e.target.files[0]; if (!fl) return; shrink(fl, (url, asp) => { d.sp[k] = url; d.sa[k] = asp; saveSp(); spShow(k); e.target.value = ''; }); });
      app.querySelectorAll('.spx').forEach(b => b.onclick = () => { const k = +b.dataset.k; d.sp[k] = null; d.sa[k] = 0; saveSp(); spShow(k); });
      document.getElementById('mex').onclick = () => app.querySelectorAll('details.mg,details.mi').forEach(x => { x.open = true; });
      const coatApply = o => {
        if (!o || !Array.isArray(o.rows) || !o.rows.length) return alert('반영할 자재정보가 없습니다.');
        const two = f.rows.some(x => x.g), done = {}, nn = x => parseFloat(String(x || '').replace(/,/g, '')) || 0;
        const spec = String(o.sp || '');
        const a2row = () => { const k = ['방수', '주차장', '내부', '외부'].find(w => spec.includes(w)) || '외부'; const n = f.rows.findIndex(x => x.i === k); return n < 0 ? 0 : n; };
        let cnt = 0;
        o.rows.forEach(r => {
          let n = two ? f.rows.findIndex(x => x.g === r.g && (x.i || '') === (r.i || '')) : a2row();
          if (n < 0) n = f.rows.findIndex(x => x.g === '상품'); if (n < 0) n = 0;
          const m = d.m[n] = d.m[n] || {};
          if (done[n]) { m.spec = [m.spec, r.spec].filter(Boolean).join(' | '); if (!m.unit || m.unit === r.unit) { m.qty = String(+(nn(m.qty) + nn(r.qty)).toFixed(1)); m.unit = r.unit; } m.amt = String(+(nn(m.amt) + nn(r.amt)).toFixed(2)); }
          else { m.spec = r.spec || ''; m.qty = r.qty ? String(r.qty) : ''; m.unit = r.unit || ''; m.amt = r.amt ? String(r.amt) : ''; done[n] = 1; }
          cnt++;
        });
        const y = window.scrollY; window.Forms.render(app, t, i, I, back, go); window.scrollTo(0, y);
        const dm = document.querySelector('details.mat'); if (dm) dm.open = true;
        alert('자재정보 ' + cnt + '건을 자재 정보 표에 반영했습니다.\n(금액 단위: 백만원)');
      };
      window.__arApply = coatApply;
      document.getElementById('mmat').onclick = () => window.ARMAT.open();
      document.getElementById('mcl').onclick = () => app.querySelectorAll('details.mg,details.mi').forEach(x => { x.open = false; });
      app.querySelectorAll('.phi').forEach(inp => inp.onchange = e => { const fl = e.target.files[0]; if (!fl) return;
        shrink(fl, (url, asp) => { d.photo = url; d.asp = asp; document.getElementById('pv').innerHTML = `<img src="${url}" alt="">`; e.target.value = ''; auto(); }, 1600); });
      document.getElementById('rd').onclick = () => d.photo ? auto() : (document.getElementById('ai').textContent = '먼저 사진을 촬영하거나 불러오세요.');
      document.getElementById('xl').onclick = async () => {
        const msg = document.getElementById('msg'); msg.textContent = '엑셀 파일 만드는 중…';
        try { await toExcel(code, t, f, d, titleTxt(), { all: t.subs, i }); const np = [0, 1].filter(k => d.sp[k]).length; msg.textContent = np ? `완료 — 현장 사진 ${np}장을 이미지 칸에 넣었어요.` : d.photo ? '완료 — 현장 사진이 없어 개요판 사진을 이미지 칸에 넣었어요. 현장 사진을 올리면 그 사진으로 바뀌어요.' : '완료 — 사진이 없어 이미지 칸이 비어 있어요. 개요판 또는 현장 사진을 올려 주세요.'; }
        catch (err) { msg.textContent = '실패: ' + err.message; }
      };
      const recA = () => ({ id: d._id, eng: 'A', code, title: titleTxt(), sub: t.subs[i], data: JSON.parse(JSON.stringify(d)) });
      const doXA = () => toExcel(code, t, f, d, titleTxt(), { all: t.subs, i });
      const doSaveA = async () => { try { const r = await window.Rep.save(recA()); d._id = r.id; persist(); window.Rep.toast('보관함에 저장했어요 · 홈 아래 "보고서"에서 볼 수 있어요'); } catch (e) { window.Rep.toast('저장 실패: ' + (e.message || e)); } };
      document.getElementById('pvb').onclick = () => window.Rep.preview(prevA(code, d, titleTxt()), { onSave: doSaveA, onExcel: doXA });
      document.getElementById('svb').onclick = doSaveA;
      document.getElementById('nw').onclick = () => { if (!confirm('작성 중인 내용을 지우고 새 보고서를 시작할까요?\n(저장한 보고서는 그대로 남아요)')) return; delete drafts[code]; try { ['ar-d-', 'ar-sp-'].forEach(k => localStorage.removeItem(k + code)); } catch (e) {} window.Forms.render(app, t, i, I, back, go); };
      afP.forEach(p => { const el = app.querySelector(`[data-p="${p}"]`); if (el) el.classList.add('af'); });
      if (lastMsg) { document.getElementById('ai').textContent = lastMsg; lastMsg = ''; }
      window.scrollTo(0, 0);
    }
  };
  window.Forms.A = {
    open: r => { drafts[r.code] = Object.assign(blankA(r.code), r.data, { _id: r.id }); },
    preview: r => prevA(r.code, Object.assign(blankA(r.code), r.data), r.title),
    excel: r => { const t = window.ACTIVITY_TYPES.find(x => x.code === r.code[0]); return toExcel(r.code, t, F[r.code], Object.assign(blankA(r.code), r.data), r.title, { all: t.subs, i: +r.code.slice(1) - 1 }); }
  };
})();
