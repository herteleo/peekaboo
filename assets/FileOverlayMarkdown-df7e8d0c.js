import{d as o,j as n,n as l,Q as r,w as i,o as m,c as p,O as c}from"./index-3e1b3bae.js";import{m as d}from"./marked.esm-be3d53b0.js";const u=["innerHTML"],_=o({__name:"FileOverlayMarkdown",setup(f){const a=n(""),s=l(()=>{var e;return((e=r.value)==null?void 0:e.type)==="markdown"&&r.value.file});return i(s,async e=>{e&&(a.value=d.parse(await e.text(),{headerIds:!1}))},{immediate:!0}),(e,t)=>(m(),p("div",{innerHTML:a.value,class:"prose prose-invert m-8 max-h-full w-full max-w-screen-md overflow-auto bg-slate-900 p-8 shadow-2xl prose-a:text-teal-600 prose-pre:bg-black prose-img:rounded",onClick:t[0]||(t[0]=c(()=>{},["stop"]))},null,8,u))}});export{_ as default};
