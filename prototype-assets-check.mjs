import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

const dir='dist/auction/prototype';
const context={window:{}};
vm.runInNewContext(fs.readFileSync(dir+'/shared-assets.js','utf8'),context);
const shared=context.window.__bundlerAssetData;
const manifest=html=>JSON.parse(html.match(/<script type="__bundler\/manifest">\s*([\s\S]*?)\s*<\/script>/)[1]);
for(const name of ['home','lots','account','flows']){
  const file=`${dir}/${name}.html`;
  const html=fs.readFileSync(file,'utf8');
  const current=manifest(html);
  const original=manifest(execFileSync('git',['show',`27978904351e42cfe135238a4fcb1883fd0ea2d3:${file}`],{encoding:'utf8',maxBuffer:32*1024*1024}));
  for(const entry of Object.values(current)){
    const data=shared[entry.assetKey];
    assert.equal(typeof data,'string');
    assert.equal(crypto.createHash('sha256').update(data).digest('hex'),entry.assetKey);
    entry.data=data;delete entry.assetKey;
  }
  assert.deepEqual(current,original,`${name}: preserve every original asset and metadata`);
  const sharedIndex=html.indexOf('src="shared-assets.js');
  assert.ok(sharedIndex>=0&&sharedIndex<html.indexOf("document.addEventListener('DOMContentLoaded'"));
  assert.ok(html.includes('atob(window.__bundlerAssetData[entry.assetKey])'));
}
console.log('PASS: all four prototypes preserve every original asset byte and load shared data before unpacking.');
