import{d as r,n,P as a,w as c,b as o,o as i,c as l,O as u,g as p}from"./index.248ffe55.js";const d=["src"],f=r({__name:"FileOverlayAudio",setup(m){const s=n(()=>{var t;return((t=a.value)==null?void 0:t.type)==="audio"&&URL.createObjectURL(a.value.file)});return c(s,(t,e)=>{e&&e.startsWith("blob:")&&URL.revokeObjectURL(e)}),(t,e)=>o(s)?(i(),l("audio",{key:0,src:o(s),class:"shadow-2xl",onClick:e[0]||(e[0]=u(()=>{},["stop"])),controls:"",autoplay:""},null,8,d)):p("",!0)}});export{f as default};
