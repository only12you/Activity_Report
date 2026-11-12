// 보관함(Rep): 저장·미리보기·백업 — 이 기기(휴대폰/PC) 브라우저의 IndexedDB 에 보관
window.Rep = (function () {
  let dbp;
  const open = () => dbp || (dbp = new Promise((ok, no) => { try { const q = indexedDB.open('activity-reports', 1); q.onupgradeneeded = () => q.result.createObjectStore('r', { keyPath: 'id' }); q.onsuccess = () => ok(q.result); q.onerror = () => no(q.error); } catch (e) { no(e); } }));
  const tx = async (mode, fn) => { const db = await open(); return new Promise((ok, no) => { const t = db.transaction('r', mode), r = fn(t.objectStore('r')); t.oncomplete = () => ok(r && r.result); t.onerror = () => no(t.error); t.onabort = () => no(t.error); }); };
  const uid = () => 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const R = {
    all: async () => (await tx('readonly', s => s.getAll())) || [],
    del: id => tx('readwrite', s => s.delete(id)),
    put: rec => tx('readwrite', s => s.put(rec)),
    async save(rec) { rec = Object.assign({}, rec, { id: rec.id || uid(), ts: Date.now() }); await tx('readwrite', s => s.put(rec)); try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {} return rec; },
    toast(m) { const o = document.querySelector('.toast'); if (o) o.remove(); const e = document.createElement('div'); e.className = 'toast'; e.textContent = m; document.body.appendChild(e); setTimeout(() => e.classList.add('off'), 2600); setTimeout(() => e.remove(), 3100); },
    async download(name, data, type) {
      let dl = null; try { dl = await window.claude.use('downloads'); } catch (e) {}
      if (dl) { await dl.save({ filename: name, data }); return; }
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    },
    preview(html, o = {}) {
      const el = document.createElement('div'); el.className = 'pvm';
      el.innerHTML = `<div class="pvh"><button type="button" data-a="c" aria-label="닫기">✕</button><b>보고서 미리보기</b></div><div class="pvb"><div class="pvz"><div class="pp">${html}</div></div></div><div class="pvf">${o.onSave ? '<button type="button" data-a="s">💾 저장</button>' : ''}${o.onExcel ? '<button type="button" data-a="x" class="pri">📊 Excel 만들기</button>' : ''}</div>`;
      document.body.appendChild(el); document.body.style.overflow = 'hidden';
      const fit = () => { el.querySelector('.pvz').style.zoom = Math.min(1, (el.clientWidth - 16) / 720); };
      const close = () => { removeEventListener('resize', fit); el.remove(); document.body.style.overflow = ''; };
      fit(); addEventListener('resize', fit);
      el.onclick = async e => { const b = e.target.closest('button'); if (!b) return; const a = b.dataset.a;
        if (a === 'c') close();
        else if (a === 's') await o.onSave();
        else if (a === 'x') { try { await o.onExcel(); R.toast('Excel 파일을 만들었어요'); } catch (err) { R.toast('실패: ' + (err && err.message || err)); } } };
    }
  };
  return R;
})();
