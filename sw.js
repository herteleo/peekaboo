if(!self.define){let e,s={};const i=(i,l)=>(i=new URL(i+".js",l).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(l,n)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const a=e=>i(e,r),u={module:{uri:r},exports:o,require:a};s[r]=Promise.all(l.map((e=>u[e]||a(e)))).then((e=>(n(...e),o)))}}define(["./workbox-7369c0e1"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/Dir.efb04d85.js",revision:null},{url:"assets/FileOverlayAudio.a036ae57.js",revision:null},{url:"assets/FileOverlayImage.108a75c1.js",revision:null},{url:"assets/FileOverlayMarkdown.a525f3c2.js",revision:null},{url:"assets/FileOverlayPdf.cd39a9f8.js",revision:null},{url:"assets/FileOverlayText.52eb752d.js",revision:null},{url:"assets/FileOverlayText.eac0d35b.css",revision:null},{url:"assets/FileOverlayUnknown.2822e775.js",revision:null},{url:"assets/FileOverlayVideo.4cf10c4f.js",revision:null},{url:"assets/Home.078dbcca.js",revision:null},{url:"assets/index.2e12ed84.css",revision:null},{url:"assets/index.44b741f6.js",revision:null},{url:"assets/marked.esm.2a07299f.js",revision:null},{url:"assets/workbox-window.prod.es5.d2780aeb.js",revision:null},{url:"index.html",revision:"6be735d6e3e98a443c944fc23964ff16"},{url:"favicon.png",revision:"55b997854ee084cfcb4562495afaff26"},{url:"icon-192x192.png",revision:"2f3aca7a7fc3129aeaf148343d1c92af"},{url:"icon-512x512.png",revision:"c6608e8d85f9bdbf43d055fdbc6501f0"},{url:"manifest.webmanifest",revision:"08f7600bfe103910937de3a7db5e5f98"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
