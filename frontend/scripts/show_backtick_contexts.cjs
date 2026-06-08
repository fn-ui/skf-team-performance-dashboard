const fs = require('fs');
const s = fs.readFileSync('src/pages/Projects.jsx','utf8');
const idxs = [];
let i = -1;
while ((i = s.indexOf('`', i + 1)) !== -1) idxs.push(i);
for (let j = 0; j < idxs.length; j++) {
  const pos = idxs[j];
  const ctx = s.slice(Math.max(0, pos - 40), pos + 40);
  console.log('---', j, 'pos', pos);
  console.log(ctx);
}
