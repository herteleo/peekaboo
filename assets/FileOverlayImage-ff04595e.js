import{d as n,n as o,T as s,w as r,b as c,o as l,c as i,g as m}from"./index-b1ef84b1.js";const _=["src"],d=n({__name:"FileOverlayImage",setup(u){const t=o(()=>{var e;return((e=s.value)==null?void 0:e.type)==="image"&&URL.createObjectURL(s.value.file)});return r(t,(e,a)=>{a&&a.startsWith("blob:")&&URL.revokeObjectURL(a)}),(e,a)=>c(t)?(l(),i("img",{key:0,src:c(t),class:"max-h-screen shadow-2xl",loading:"lazy",decoding:"async"},null,8,_)):m("",!0)}});export{d as default};