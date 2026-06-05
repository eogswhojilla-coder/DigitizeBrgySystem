import{r as t,b as k,j as e}from"./app-BG-h0MKt.js";import{c as n}from"./createLucideIcon-BSD0jAK2.js";import{X as _}from"./x-D4mZEic2.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],C=n("arrow-down",A);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]],u=n("bot",$);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],P=n("send",D);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]],q=n("sparkles",U);function L(){const[b,p]=t.useState(!1),[o,l]=t.useState([{id:0,text:"Hello! 👋 Welcome to the Barangay AI Assistant. How can I help you today?",isUser:!1}]),[i,m]=t.useState(""),[a,d]=t.useState(!1),[y,j]=t.useState([]),[v,N]=t.useState(""),[f,M]=t.useState(!0),w=t.useRef(null);t.useEffect(()=>{const s=`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;N(s),S()},[]),t.useEffect(()=>{var s;(s=w.current)==null||s.scrollIntoView({behavior:"smooth"})},[o,a]);const S=async()=>{try{const s=await k.get("/api/chatbot/prompts");s.data.success&&j(s.data.prompts)}catch(s){console.error("Failed to fetch prompts:",s)}},c=async(s=null)=>{const x=s||i.trim();if(!x)return;f&&M(!1);const I={id:Date.now(),text:x,isUser:!0};l(r=>[...r,I]),m(""),d(!0);try{const r=await k.post("/api/chatbot/send",{message:x,session_id:v});if(d(!1),r.data.success){const h={id:Date.now()+1,text:r.data.response,isUser:!1,messageId:r.data.message_id};l(g=>[...g,h])}}catch(r){d(!1);const h={id:Date.now()+1,text:"Sorry, I'm having trouble connecting right now. Please try again later.",isUser:!1};l(g=>[...g,h]),console.error("Failed to send message:",r)}},z=s=>{c(s)};return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"fixed bottom-6 right-6 z-[9999]",children:e.jsx("button",{onClick:()=>p(s=>!s),"aria-label":"Toggle chat",className:`transition-transform hover:scale-105 active:scale-95 \r
            focus:outline-none`,children:b?e.jsx("div",{className:`w-16 h-16 flex items-center justify-center rounded-full\r
              bg-blue-700 text-white shadow-xl hover:bg-blue-800`,children:e.jsx(C,{size:28})}):e.jsx("img",{src:"/images/chatbot.png",alt:"Ask for Help - Chat Bot",className:"w-auto h-24 object-contain drop-shadow-2xl animate-bounce [animation-duration:2s]"})})}),b&&e.jsxs("div",{className:`fixed bottom-24 right-6 z-[9998]\r
            w-[380px] flex flex-col rounded-2xl overflow-hidden\r
            border border-gray-200 dark:border-gray-700\r
            bg-white dark:bg-gray-900 shadow-xl`,style:{height:550},children:[e.jsxs("div",{className:"bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-3 flex items-center gap-3",children:[e.jsx("div",{className:`w-9 h-9 rounded-full bg-white/20\r
              flex items-center justify-center`,children:e.jsx(u,{size:18,className:"text-white"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("p",{className:"text-white font-semibold text-sm flex items-center gap-1",children:["Barangay AI Assistant",e.jsx(q,{size:12,className:"text-yellow-300"})]}),e.jsxs("p",{className:"text-blue-200 text-xs flex items-center gap-1",children:[e.jsx("span",{className:`w-2 h-2 rounded-full bg-green-400\r
                  inline-block animate-pulse`}),"Online & Ready to Help"]})]}),e.jsx("button",{onClick:()=>p(!1),className:"text-white/80 hover:text-white transition-colors","aria-label":"Close",children:e.jsx(_,{size:18})})]}),e.jsxs("div",{className:`flex-1 overflow-y-auto p-4 space-y-3\r
            bg-gray-50 dark:bg-gray-800`,children:[o.map(s=>e.jsxs("div",{className:`flex items-end gap-2
                  ${s.isUser?"flex-row-reverse":""}`,children:[!s.isUser&&e.jsx("div",{className:`w-7 h-7 rounded-full bg-blue-700\r
                    flex items-center justify-center flex-shrink-0`,children:e.jsx(u,{size:13,className:"text-white"})}),e.jsx("div",{className:`max-w-[85%] px-3 py-2.5 text-sm
                    leading-relaxed rounded-2xl whitespace-pre-line
                    ${s.isUser?"bg-blue-700 text-white rounded-br-sm":`bg-white dark:bg-gray-700
                         text-gray-900 dark:text-gray-100
                         border border-gray-200 dark:border-gray-600
                         rounded-bl-sm shadow-sm`}`,children:s.text})]},s.id)),a&&e.jsxs("div",{className:"flex items-end gap-2",children:[e.jsx("div",{className:`w-7 h-7 rounded-full bg-blue-700\r
                  flex items-center justify-center flex-shrink-0`,children:e.jsx(u,{size:13,className:"text-white"})}),e.jsx("div",{className:`bg-white dark:bg-gray-700 border\r
                  border-gray-200 dark:border-gray-600 px-4 py-3\r
                  rounded-2xl rounded-bl-sm flex gap-1`,children:[0,1,2].map(s=>e.jsx("span",{className:`w-2 h-2 rounded-full bg-blue-600\r
                        animate-bounce`,style:{animationDelay:`${s*.15}s`}},s))})]}),f&&y.length>0&&o.length===1&&e.jsxs("div",{className:"space-y-2 pt-2",children:[e.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 font-medium px-1",children:"Quick Questions:"}),e.jsx("div",{className:"grid grid-cols-1 gap-2",children:y.slice(0,6).map(s=>e.jsx("button",{onClick:()=>z(s.question),className:`text-left px-3 py-2 text-xs bg-white dark:bg-gray-700\r
                        border border-gray-200 dark:border-gray-600 rounded-lg\r
                        hover:bg-blue-50 dark:hover:bg-gray-600\r
                        hover:border-blue-300 dark:hover:border-blue-500\r
                        transition-colors text-gray-700 dark:text-gray-200`,children:s.question},s.id))})]}),e.jsx("div",{ref:w})]}),e.jsxs("div",{className:`p-3 border-t border-gray-200\r
            dark:border-gray-700 bg-white dark:bg-gray-900`,children:[e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx("input",{type:"text",value:i,onChange:s=>m(s.target.value),onKeyDown:s=>s.key==="Enter"&&!s.shiftKey&&c(),placeholder:"Type your question…",disabled:a,className:`flex-1 px-4 py-2.5 rounded-full text-sm\r
                  border border-gray-200 dark:border-gray-600\r
                  bg-gray-50 dark:bg-gray-800\r
                  text-gray-900 dark:text-gray-100\r
                  placeholder:text-gray-400 dark:placeholder:text-gray-500\r
                  outline-none focus:ring-2 focus:ring-blue-500\r
                  disabled:opacity-50 disabled:cursor-not-allowed\r
                  transition-all`}),e.jsx("button",{onClick:()=>c(),disabled:a||!i.trim(),"aria-label":"Send",className:`w-10 h-10 rounded-full bg-blue-700 text-white\r
                  flex items-center justify-center flex-shrink-0\r
                  hover:bg-blue-800 active:scale-95 transition-all\r
                  disabled:opacity-50 disabled:cursor-not-allowed\r
                  disabled:hover:bg-blue-700`,children:e.jsx(P,{size:16})})]}),e.jsx("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2",children:"Powered by Barangay AI Assistant"})]})]})]})}export{L as default};
