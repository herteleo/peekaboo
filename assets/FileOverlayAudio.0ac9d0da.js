import{d as r,c,w as n,i as o,j as i,k as l,x as u,y as p}from"./vendor.870a6cb0.js";import{h as a}from"./index.3cc748a1.js";const m=["src"],k=r({setup(f){const s=c(()=>{var t;return((t=a.value)==null?void 0:t.type)==="audio"&&URL.createObjectURL(a.value.file)});return n(s,(t,e)=>{e&&e.startsWith("blob:")&&URL.revokeObjectURL(e)}),(t,e)=>o(s)?(i(),l("audio",{key:0,src:o(s),class:"shadow-2xl",onClick:e[0]||(e[0]=u(()=>{},["stop"])),controls:"",autoplay:""},null,8,m)):p("",!0)}});export{k as default};