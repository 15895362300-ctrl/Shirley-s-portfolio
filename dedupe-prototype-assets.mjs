import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const dir='dist/auction/prototype';
const pattern=/(<script type="__bundler\/manifest">\s*)([\s\S]*?)(\s*<\/script>)/;
const files=fs.readdirSync(dir).filter(file=>file.endsWith('.html'));
const sharedPath=dir+'/shared-assets.js';
const prefix='window.__bundlerAssetData=';
const shared=fs.existsSync(sharedPath)?JSON.parse(fs.readFileSync(sharedPath,'utf8').slice(prefix.length).trim().replace(/;$/,'')):{};
const pending=[];
let before=0,after=0;
for(const file of files){
  const original=fs.readFileSync(dir+'/'+file,'utf8');
  const match=original.match(pattern);
  assert.ok(match,'Missing manifest: '+file);
  const manifest=JSON.parse(match[2]);
  for(const entry of Object.values(manifest)){
    const data=entry.data??shared[entry.assetKey];
    assert.equal(typeof data,'string');
    const key=crypto.createHash('sha256').update(data).digest('hex');
    if(shared[key])assert.equal(shared[key],data);
    shared[key]=data;
    entry.assetKey=key;
    delete entry.data;
    assert.equal(shared[entry.assetKey],data,'Asset bytes changed');
  }
  let updated=original.replace(pattern,(_,start,end,close)=>start+JSON.stringify(manifest)+close);
  if(!updated.includes('src="shared-assets.js"')){
    updated=updated.replace('  <script>','  <script src="shared-assets.js"></script>\n  <script>');
    updated=updated.replace('    const manifest = JSON.parse(manifestEl.textContent);','    if (!window.__bundlerAssetData) throw new Error("Shared assets could not load; please reload.");\n    const manifest = JSON.parse(manifestEl.textContent);');
    assert.ok(updated.includes('atob(entry.data)'));
    updated=updated.replace('atob(entry.data)','atob(window.__bundlerAssetData[entry.assetKey])');
  }
  before+=Buffer.byteLength(original);after+=Buffer.byteLength(updated);
  pending.push([dir+'/'+file,updated]);
}
const sharedText=prefix+JSON.stringify(shared)+';\n';
fs.writeFileSync(sharedPath,sharedText);
for(const [file,text] of pending)fs.writeFileSync(file,text);
console.log(`Verified ${files.length} prototypes, ${Object.keys(shared).length} byte-identical shared assets. HTML ${before} -> ${after}; shared ${Buffer.byteLength(sharedText)} bytes.`);
