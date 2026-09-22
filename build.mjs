import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
await build({entryPoints:['src/hero.jsx'],bundle:true,minify:true,format:'iife',outfile:'dist/hero.js',define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic'});
execFileSync(process.execPath,['node_modules/@tailwindcss/cli/dist/index.mjs','-i','src/hero.css','-o','dist/hero.css','--minify'],{stdio:'inherit'});
