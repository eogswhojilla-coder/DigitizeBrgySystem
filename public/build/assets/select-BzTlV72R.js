import{j as e}from"./app-BE-LrTTj.js";function m({label:p,name:l,value:n,register:d,onChange:c,options:x=[],disabled:i=!1,required:u=!1,iconLeft:t,iconRight:s,error:a,multiple:r=!1}){return e.jsxs("div",{className:"w-full",children:[e.jsxs("div",{className:"relative",children:[t&&e.jsx("div",{className:"absolute left-2 top-1/2 -translate-y-1/2 text-gray-500",children:t}),e.jsxs("select",{...d,multiple:r,disabled:i,required:u,value:n,onChange:c,id:l,name:l,className:`peer text-black placeholder-transparent w-full py-2.5 px-5 border bg-white rounded-md focus:outline-none transition-all appearance-none
                        ${t?"pl-10":""}
                        ${s?"pr-10":""}
                        ${a?"border-red-500":""}
                        ${r?"h-32":""}  // Optional: taller for multiple
                    `,children:[!r&&e.jsx("option",{value:"",selected:!0,disabled:!0}),x.map(o=>e.jsx("option",{value:o.value,children:o.label},o.value))]}),e.jsx("label",{htmlFor:l,className:`absolute left-2.5 px-2.5 transition-all bg-white text-sm -top-3
                        peer-placeholder-shown:text-base
                        peer-placeholder-shown:text-gray-500
                        peer-placeholder-shown:top-2.5
                        peer-focus:-top-3
                        peer-focus:text-sm
                        peer-focus:text-blue-600
                    `,children:p}),s&&e.jsx("div",{className:"absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none",children:s})]}),a&&e.jsx("p",{className:"text-sm text-red-500 mt-1 ml-1",children:a})]})}export{m as S};
