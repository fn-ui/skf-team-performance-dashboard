const fs = require('fs');
const path = 'src/pages/Projects.jsx';
const s = fs.readFileSync(path,'utf8');
const matches = s.match(/`/g) || [];
console.log('backticks count:', matches.length);
let idx = -1; let i=0; while((idx = s.indexOf('`', idx+1)) !== -1 && i<50){ console.log('index', i, idx); i++; }
