import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

// Content hashes change only when an asset changes; never discard saved user content.
let count=0;
for(const entry of fs.readdirSync('dist',{recursive:true})){
  if(!entry.endsWith('.html'))continue;
  const file=path.join('dist',entry),html=fs.readFileSync(file,'utf8');
  const updated=html.replace(/(<(?:script|link)\b[^>]*?\b(?:src|href)=")(?!https?:|\/\/)([^"?#]+\.(?:js|css))(?:\?[^"#]*)?("[^>]*>)/g,(_,start,url,end)=>{
    const asset=path.resolve(path.dirname(file),url);
    assert.ok(fs.existsSync(asset),'Missing asset: '+asset);
    const hash=crypto.createHash('sha256').update(fs.readFileSync(asset)).digest('hex').slice(0,12);
    count++;return `${start}${url}?v=${hash}${end}`;
  });
  if(html!==updated)fs.writeFileSync(file,updated);
}
console.log(`Versioned ${count} local script/style references.`);
