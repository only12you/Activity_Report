// 문법 점검: node tools/check.js  (js/*.js 전체를 파싱만 해 봅니다)
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'js'); let bad = 0;
fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort().forEach(f => {
  try { new Function(fs.readFileSync(path.join(dir, f), 'utf8')); console.log('OK  ', f); }
  catch (e) { bad++; console.log('ERR ', f, e.message); }
});
process.exit(bad ? 1 : 0);
