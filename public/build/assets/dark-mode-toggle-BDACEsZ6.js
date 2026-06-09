import{r as c,j as e}from"./app-Dx3Z0Z1K.js";import{c as a}from"./createLucideIcon-Dv_gBBHV.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],d=a("moon",n);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],l=a("sun",m);function h(){const[t,s]=c.useState(()=>document.documentElement.classList.contains("dark")),r=()=>{const o=!t;s(o),o?(document.documentElement.classList.add("dark"),localStorage.setItem("darkMode","true")):(document.documentElement.classList.remove("dark"),localStorage.setItem("darkMode","false"))};return e.jsx("button",{onClick:r,className:"p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors mt-0.1",title:t?"Switch to Light Mode":"Switch to Dark Mode",children:t?e.jsx(l,{className:"w-5 h-5"}):e.jsx(d,{className:"w-5 h-5"})})}export{h as D};
