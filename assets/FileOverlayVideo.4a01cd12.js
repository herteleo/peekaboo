import{d as r,c,w as n,i as o,j as i,k as l,x as m,y as p}from"./vendor.870a6cb0.js";import{h as a}from"./index.3cc748a1.js";const u=["src"],h=r({setup(d){const s=c(()=>{var t;return((t=a.value)==null?void 0:t.type)==="video"&&URL.createObjectURL(a.value.file)});return n(s,(t,e)=>{e&&e.startsWith("blob:")&&URL.revokeObjectURL(e)}),(t,e)=>o(s)?(i(),l("video",{key:0,src:o(s),class:"max-h-screen shadow-2xl",onClick:e[0]||(e[0]=m(()=>{},["stop"])),controls:"",autoplay:"",muted:""},null,8,u)):p("",!0)}});export{h as default};
