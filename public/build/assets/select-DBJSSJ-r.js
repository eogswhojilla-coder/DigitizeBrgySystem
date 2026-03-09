import{j as e}from"./app-BxbCW42X.js";function b({label:c,name:s,value:p,register:l,onChange:x,options:i=[],disabled:h=!1,required:u=!1,iconLeft:t,iconRight:a,error:r,multiple:o=!1}){const d=l&&typeof l=="object"&&"onChange"in l;return e.jsxs("div",{className:"w-full",children:[e.jsxs("div",{className:"relative",children:[t&&e.jsx("div",{className:"absolute left-2 top-1/2 -translate-y-1/2 text-gray-500",children:t}),e.jsxs("select",{...d?l:{},multiple:o,disabled:h,required:u,...!d&&{value:p!==void 0?p:"",onChange:x},id:s,name:s,className:`peer text-black placeholder-transparent w-full py-2.5 px-5 border bg-white rounded-md focus:outline-none transition-all appearance-none
                        ${t?"pl-10":""}
                        ${a?"pr-10":""}
                        ${r?"border-red-500":""}
                        ${o?"h-32":""}  // Optional: taller for multiple
                    `,children:[!o&&e.jsx("option",{value:"",disabled:!0}),i.map(n=>e.jsx("option",{value:n.value,children:n.label},n.value))]}),e.jsx("label",{htmlFor:s,className:`absolute left-2.5 px-2.5 transition-all bg-white text-sm -top-3
                        peer-placeholder-shown:text-base
                        peer-placeholder-shown:text-gray-500
                        peer-placeholder-shown:top-2.5
                        peer-focus:-top-3
                        peer-focus:text-sm
                        peer-focus:text-blue-600
                    `,children:c}),a&&e.jsx("div",{className:"absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none",children:a})]}),r&&e.jsx("p",{className:"text-sm text-red-500 mt-1 ml-1",children:r})]})}export{b as S};
