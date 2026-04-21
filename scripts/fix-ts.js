const fs = require('fs');

const clientPath = 'src/lib/supabase/client.ts';
let clientContent = fs.readFileSync(clientPath, 'utf8');
clientContent = clientContent.replace('fn: () => Promise<unknown>', 'fn: () => Promise<any>');
fs.writeFileSync(clientPath, clientContent);

const blocksPath = 'src/lib/section-blocks.ts';
let blocksContent = fs.readFileSync(blocksPath, 'utf8');
// Fix linear-gradient backgrounds
blocksContent = blocksContent.replace(/background:\s*"(linear-gradient|url)([^"]*)"/g, 'backgroundImage: "$1$2"');
// Fix rgb/hex backgrounds
blocksContent = blocksContent.replace(/background:\s*"([^"]*)"/g, 'backgroundColor: "$1"');
fs.writeFileSync(blocksPath, blocksContent);

console.log('Fixed typescript errors');
