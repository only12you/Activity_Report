// 카드 일러스트 (인라인 SVG, 외부 이미지 없이 오프라인 동작)
(function () {
  const g = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const wrap = (defs, body) => `<svg viewBox="0 0 80 64" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${body}</svg>`;

  window.ICONS = {
    roller: wrap(g('r1', '#f4f7fb', '#b9c7dc') + g('r2', '#7c5cf0', '#4326b8'),
      `<ellipse cx="42" cy="60" rx="14" ry="2.5" fill="#0002"/>
       <rect x="14" y="8" width="46" height="18" rx="9" fill="url(#r1)" stroke="#9fb2cf"/>
       <rect x="14" y="8" width="10" height="18" rx="5" fill="#2a9df4" opacity=".75"/>
       <path d="M60 17h6q4 0 4 4v7q0 4-4 4H44v8" fill="none" stroke="#7a8aa6" stroke-width="3" stroke-linecap="round"/>
       <rect x="40" y="36" width="9" height="24" rx="4.5" fill="url(#r2)"/>`),
    building: wrap(g('b1', '#cfe3f7', '#7fa7d1') + g('b2', '#e6f0fa', '#9bb7d6'),
      `<rect x="30" y="6" width="22" height="50" fill="url(#b1)"/><rect x="52" y="16" width="16" height="40" fill="url(#b2)"/><rect x="12" y="28" width="18" height="28" fill="url(#b2)"/>
       ${[10, 18, 26, 34, 42, 50].map(y => `<rect x="33" y="${y}" width="4" height="4" fill="#3b6ea5"/><rect x="40" y="${y}" width="4" height="4" fill="#3b6ea5"/><rect x="46" y="${y}" width="3" height="4" fill="#3b6ea5"/>`).join('')}
       ${[20, 28, 36, 44].map(y => `<rect x="55" y="${y}" width="4" height="4" fill="#3b6ea5"/><rect x="62" y="${y}" width="4" height="4" fill="#3b6ea5"/>`).join('')}
       ${[32, 40, 48].map(y => `<rect x="15" y="${y}" width="4" height="4" fill="#3b6ea5"/><rect x="22" y="${y}" width="4" height="4" fill="#3b6ea5"/>`).join('')}
       <rect x="6" y="54" width="68" height="6" rx="3" fill="#6bbf59"/><circle cx="14" cy="50" r="6" fill="#4caf50"/><circle cx="68" cy="51" r="5" fill="#5dbb63"/>`),
    cans: wrap(g('c1', '#e9eef5', '#a9b8cc') + g('c2', '#dbe8fb', '#7ea3d8'),
      `<ellipse cx="40" cy="60" rx="30" ry="3" fill="#0002"/>
       <path d="M8 18h28v38q-14 6-28 0z" fill="url(#c1)" stroke="#94a6bf"/><ellipse cx="22" cy="18" rx="14" ry="4" fill="#f5b638"/>
       <path d="M10 18q2 12 5 10t4 8" fill="none" stroke="#f0a416" stroke-width="4" stroke-linecap="round"/>
       <path d="M44 10h28v46q-14 6-28 0z" fill="url(#c2)" stroke="#6d8fc4"/><ellipse cx="58" cy="10" rx="14" ry="4" fill="#3d6fd1"/>
       <path d="M48 10q2 14 5 12t4 10" fill="none" stroke="#2956b8" stroke-width="4" stroke-linecap="round"/>`),
    tray: wrap(g('t1', '#6d7cf2', '#3042c8'),
      `<ellipse cx="40" cy="58" rx="32" ry="3.5" fill="#0002"/>
       <path d="M6 30l12-8h44l12 8-6 24H12z" fill="url(#t1)"/><path d="M14 32h52l-4 18H18z" fill="#e8ecff"/>
       <rect x="30" y="14" width="34" height="12" rx="6" fill="#f2b53a" transform="rotate(-8 47 20)"/><rect x="26" y="16" width="10" height="12" rx="3" fill="#2f48c9" transform="rotate(-8 31 22)"/>`),
    helmet: wrap(g('h1', '#ffffff', '#cfd9e6'),
      `<ellipse cx="40" cy="58" rx="30" ry="3.5" fill="#0002"/>
       <path d="M12 44q0-30 28-30t28 30z" fill="url(#h1)" stroke="#aebdd0"/>
       <rect x="35" y="10" width="10" height="22" rx="4" fill="#e6edf6" stroke="#aebdd0"/>
       <path d="M6 44h68q0 8-10 8H16Q6 52 6 44z" fill="#eef3f9" stroke="#aebdd0"/><path d="M52 50h18q4 0 4 4l-14 2z" fill="#2fb36d"/>`),
    handshake: wrap(g('s1', '#f3c9a5', '#d99a73'),
      `<path d="M2 18l18-6 14 10-10 20-16-4z" fill="#2c4a8a"/><path d="M78 18l-18-6-14 10 10 20 16-4z" fill="#3b5ba5"/>
       <path d="M20 14l18-4 14 8 8 4-12 24-14 8-14-8z" fill="url(#s1)" stroke="#c8895f"/>
       <path d="M28 30l12 8M34 26l12 8M40 22l12 8" stroke="#c8895f" stroke-width="2" stroke-linecap="round"/>`),
    chart: wrap(g('g1', '#53d18a', '#1b9a56'),
      `<ellipse cx="38" cy="58" rx="32" ry="3.5" fill="#0002"/>
       <rect x="8" y="38" width="12" height="20" rx="2" fill="#aab6c6"/><rect x="26" y="30" width="12" height="28" rx="2" fill="url(#g1)"/><rect x="44" y="20" width="12" height="38" rx="2" fill="url(#g1)"/><rect x="62" y="10" width="12" height="48" rx="2" fill="url(#g1)"/>
       <path d="M8 30l18-10 14 6 28-20" fill="none" stroke="#22b36b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 6h10v10" fill="none" stroke="#22b36b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`),
    clipboard: wrap(g('p1', '#3f7be0', '#1b4fb0'),
      `<g transform="rotate(12 40 34)"><rect x="18" y="6" width="44" height="54" rx="5" fill="url(#p1)"/><rect x="23" y="12" width="34" height="43" rx="2" fill="#fff"/><rect x="31" y="3" width="18" height="9" rx="3" fill="#8aa0c4"/>
       ${[19, 28, 37, 46].map(y => `<path d="M27 ${y}l2 2 4-4" fill="none" stroke="#2f7de0" stroke-width="2"/><rect x="36" y="${y - 2}" width="17" height="2.5" rx="1" fill="#9db1cf"/>`).join('')}</g>`),
    map: wrap(g('m1', '#7bd36b', '#3fa04b'),
      `<path d="M4 44l22-8 20 8 30-10-10 22-22 6-20-8z" fill="url(#m1)" stroke="#2f8a46"/><path d="M14 46l18-4 14 6" fill="none" stroke="#fff" stroke-width="2.5" opacity=".8"/>
       <path d="M52 4q10 0 10 10c0 8-10 20-10 20S42 22 42 14Q42 4 52 4z" fill="#e53935"/><circle cx="52" cy="14" r="4" fill="#fff"/>`),
    layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M12 3l9 5-9 5-9-5z" fill="currentColor"/><path d="M3 12.5l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg>`,
    cube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2l9 5v10l-9 5-9-5V7z" fill="currentColor"/><path d="M12 12l9-5M12 12L3 7M12 12v10" stroke="#fff"/></svg>`,
    doc: `<svg viewBox="0 0 24 24" fill="#fff"><path d="M6 2h8l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><path d="M8 12h8M8 16h8M8 8h4" stroke="#2f5bd4" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    chev: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" fill="#3a4258"><path d="M12 2a6 6 0 00-6 6v4l-2 4h16l-2-4V8a6 6 0 00-6-6zM10 19a2 2 0 004 0z"/></svg>`,
    home: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5L2 11h3v10h5v-6h4v6h5V11h3z"/></svg>`,
    bars: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="12" width="4.5" height="9" rx="1"/><rect x="9.7" y="4" width="4.5" height="17" rx="1"/><rect x="16.5" y="9" width="4.5" height="12" rx="1"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.7 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6z"/></svg>`,
    gear: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13a7.7 7.7 0 000-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 00-1.7-1L15 3.3h-4L10.7 6a7.6 7.6 0 00-1.7 1l-2.5-1-2 3.5L6.6 11a7.7 7.7 0 000 2l-2.1 1.6 2 3.5 2.5-1a7.6 7.6 0 001.7 1l.3 2.6h4l.3-2.6a7.6 7.6 0 001.7-1l2.5 1 2-3.5zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg>`,
    back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>`
  };

  // 상단 히어로 배경 (하늘·곡선·아파트 단지)
  window.HERO_SVG = `<svg viewBox="0 0 430 190" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc1f2"/><stop offset="1" stop-color="#eaf4ff"/></linearGradient>
      <linearGradient id="w1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffb020"/><stop offset=".55" stop-color="#ff7a2e"/><stop offset="1" stop-color="#ff7a2e" stop-opacity="0"/></linearGradient>
      <linearGradient id="w2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2d6be4"/><stop offset="1" stop-color="#7fb3ff" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="430" height="190" fill="url(#sky)"/>
    <ellipse cx="300" cy="40" rx="60" ry="12" fill="#fff" opacity=".7"/><ellipse cx="90" cy="30" rx="50" ry="9" fill="#fff" opacity=".6"/>
    <g fill="#c7d9ee">${[[222,120,14,70],[236,112,12,78],[250,125,14,65]].map(b=>`<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}"/>`).join('')}</g>
    <g>
      <rect x="296" y="56" width="26" height="134" fill="#6e9fd2"/><rect x="322" y="70" width="14" height="120" fill="#9bbbe0"/>
      <rect x="338" y="30" width="28" height="160" fill="#7aa8da"/><rect x="366" y="46" width="14" height="144" fill="#a9c6e6"/>
      <rect x="384" y="84" width="22" height="106" fill="#e8b27a"/><rect x="406" y="70" width="24" height="120" fill="#7ea9da"/>
      <rect x="270" y="96" width="22" height="94" fill="#e4b98a"/><rect x="250" y="116" width="18" height="74" fill="#9dbde2"/>
      ${Array.from({length:22},(_,i)=>`<rect x="342" y="${36+i*7}" width="20" height="2" fill="#fff" opacity=".55"/>`).join('')}
      ${Array.from({length:16},(_,i)=>`<rect x="299" y="${62+i*7}" width="20" height="2" fill="#fff" opacity=".5"/>`).join('')}
    </g>
    <ellipse cx="300" cy="196" rx="170" ry="22" fill="#4f9e4a"/><ellipse cx="380" cy="190" rx="70" ry="16" fill="#69b85a"/>
    <path d="M-10 70Q60 20 170 52T300 120L300 190L-10 190Z" fill="url(#w1)" opacity=".95"/>
    <path d="M-10 110Q80 60 190 100T330 190L-10 190Z" fill="url(#w2)" opacity=".9"/>
    <path d="M-10 150Q100 100 230 150T360 190L-10 190Z" fill="#fff" opacity=".92"/>
  </svg>`;
})();
