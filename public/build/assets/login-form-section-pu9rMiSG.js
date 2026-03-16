import{P as g,r as x,j as e,W as c}from"./app-BpBVYyRW.js";import{F as m,a as b}from"./index-Qj4mR9xY.js";import"./iconBase-DnkGfY9A.js";function w(){const{data:a,setData:t,post:s,processing:n,errors:r}=g({email:"",password:"",remember:!1}),[o,l]=x.useState(!1),p=()=>l(i=>!i),d=i=>{i.preventDefault(),s(route("auth.login"))};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

                .login-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    display: flex;
                    position: relative;
                    overflow: hidden;
                }

                .login-bg {
                    position: absolute;
                    inset: 0;
                    background: url('/images/barangay-b.png') center/cover no-repeat;
                    z-index: 0;
                }

                .login-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg,
                        rgba(4, 16, 38, 0.88) 0%,
                        rgba(10, 30, 70, 0.75) 50%,
                        rgba(4, 16, 38, 0.92) 100%
                    );
                }

                /* floating orbs */
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    pointer-events: none;
                    z-index: 1;
                    animation: floatOrb 8s ease-in-out infinite;
                }
                .orb-1 {
                    width: 420px; height: 420px;
                    background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
                    top: -100px; left: -120px;
                    animation-delay: 0s;
                }
                .orb-2 {
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%);
                    bottom: -80px; right: -80px;
                    animation-delay: -4s;
                }

                @keyframes floatOrb {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                }

                /* grid pattern overlay */
                .grid-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 48px 48px;
                }

                .login-panel {
                    position: relative;
                    z-index: 10;
                    margin: auto;
                    width: 100%;
                    max-width: 480px;
                    padding: 16px;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.055);
                    backdrop-filter: blur(28px) saturate(1.6);
                    -webkit-backdrop-filter: blur(28px) saturate(1.6);
                    border: 1px solid rgba(255, 255, 255, 0.13);
                    border-radius: 28px;
                    padding: 36px 28px 32px;
                    box-shadow:
                        0 32px 80px rgba(0,0,0,0.45),
                        0 0 0 1px rgba(255,255,255,0.06) inset,
                        0 1px 0 rgba(255,255,255,0.18) inset;
                    animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(28px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                .logo-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 36px;
                }

                .logo-ring {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.08);
                    border: 1.5px solid rgba(255,255,255,0.18);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 8px rgba(99,102,241,0.07);
                }

                .logo-ring img {
                    width: 56px;
                    height: 56px;
                    object-fit: contain;
                    border-radius: 50%;
                }

                .login-title {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #ffffff;
                    text-align: center;
                    letter-spacing: -0.01em;
                    line-height: 1.2;
                }

                .login-subtitle {
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.45);
                    text-align: center;
                    margin-top: 4px;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }

                /* divider line under title */
                .title-divider {
                    width: 40px;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent);
                    margin: 10px auto 0;
                    border-radius: 2px;
                }

                /* field group */
                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin-bottom: 22px;
                }

                .field-label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.6);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                }

                .field-input-wrap {
                    position: relative;
                }

                .field-input-wrap input {
                    width: 100%;
                    background: rgba(255,255,255,0.07);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 12px;
                    padding: 14px 18px;
                    font-size: 0.95rem;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }

                .field-input-wrap input::placeholder {
                    color: rgba(255,255,255,0.22);
                }

                .field-input-wrap input:focus {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(99,102,241,0.65);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
                }

                .pw-toggle {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: rgba(255,255,255,0.35);
                    display: flex;
                    align-items: center;
                    transition: color 0.2s;
                    padding: 0;
                }

                .pw-toggle:hover {
                    color: rgba(255,255,255,0.75);
                }

                /* remember + forgot row */
                .meta-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                }

                .remember-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }

                .remember-label input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    accent-color: #6366f1;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .remember-label span {
                    font-size: 0.82rem;
                    color: rgba(255,255,255,0.55);
                }

                .forgot-link {
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: rgba(139,148,255,0.85);
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .forgot-link:hover {
                    color: #a5b4fc;
                }

                /* submit button */
                .btn-signin {
                    width: 100%;
                    padding: 15px;
                    border-radius: 12px;
                    border: none;
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.35), 0 1px 0 rgba(255,255,255,0.12) inset;
                    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
                    position: relative;
                    overflow: hidden;
                }

                .btn-signin::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
                }

                .btn-signin:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(99,102,241,0.45);
                }

                .btn-signin:active:not(:disabled) {
                    transform: translateY(0);
                }

                .btn-signin:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                /* separator */
                .sep {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 28px 0 20px;
                }

                .sep-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.1);
                }

                .sep-text {
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.35);
                    white-space: nowrap;
                    letter-spacing: 0.06em;
                }

                /* register button */
                .btn-register {
                    width: 100%;
                    padding: 12px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.07);
                    border: 1px solid rgba(255,255,255,0.13);
                    color: rgba(255,255,255,0.8);
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    text-decoration: none;
                    cursor: pointer;
                    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
                    letter-spacing: 0.02em;
                }

                .btn-register:hover {
                    background: rgba(255,255,255,0.12);
                    border-color: rgba(255,255,255,0.22);
                    color: #fff;
                    transform: translateY(-1px);
                }

                .btn-register svg {
                    width: 18px;
                    height: 18px;
                    flex-shrink: 0;
                }

                /* Responsive Design */
                @media (min-width: 640px) {
                    .login-panel {
                        max-width: 520px;
                        padding: 24px;
                    }
                    .glass-card {
                        padding: 48px 48px 44px;
                    }
                    .logo-ring {
                        width: 90px;
                        height: 90px;
                    }
                    .logo-ring img {
                        width: 62px;
                        height: 62px;
                    }
                    .login-title {
                        font-size: 2rem;
                    }
                    .field-input-wrap input {
                        padding: 15px 20px;
                        font-size: 1rem;
                    }
                    .btn-signin {
                        padding: 16px;
                        font-size: 0.95rem;
                    }
                }

                @media (min-width: 768px) {
                    .login-panel {
                        max-width: 580px;
                    }
                    .glass-card {
                        padding: 52px 52px 48px;
                    }
                    .logo-ring {
                        width: 100px;
                        height: 100px;
                    }
                    .logo-ring img {
                        width: 70px;
                        height: 70px;
                    }
                    .login-title {
                        font-size: 2.25rem;
                    }
                    .login-subtitle {
                        font-size: 0.9rem;
                    }
                    .field-label {
                        font-size: 0.78rem;
                    }
                    .field-group {
                        gap: 24px;
                    }
                }

                @media (min-width: 1024px) {
                    .login-panel {
                        max-width: 640px;
                    }
                    .glass-card {
                        padding: 56px 56px 52px;
                    }
                    .logo-ring {
                        width: 110px;
                        height: 110px;
                    }
                    .logo-ring img {
                        width: 78px;
                        height: 78px;
                    }
                    .login-title {
                        font-size: 2.5rem;
                    }
                    .field-input-wrap input {
                        padding: 16px 22px;
                        font-size: 1.05rem;
                    }
                    .btn-signin {
                        padding: 18px;
                        font-size: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .login-panel {
                        padding: 12px;
                    }
                    .glass-card { 
                        padding: 32px 24px 28px;
                        border-radius: 24px;
                    }
                    .logo-ring {
                        width: 70px;
                        height: 70px;
                    }
                    .logo-ring img {
                        width: 48px;
                        height: 48px;
                    }
                    .login-title {
                        font-size: 1.5rem;
                    }
                    .login-subtitle {
                        font-size: 0.75rem;
                    }
                    .field-label {
                        font-size: 0.7rem;
                    }
                    .field-input-wrap input {
                        padding: 12px 14px;
                        font-size: 0.9rem;
                    }
                    .btn-signin {
                        padding: 13px;
                        font-size: 0.85rem;
                    }
                    .btn-register {
                        padding: 11px;
                        font-size: 0.85rem;
                    }
                }

                @media (max-width: 360px) {
                    .glass-card { 
                        padding: 28px 20px 24px;
                    }
                    .login-title {
                        font-size: 1.35rem;
                    }
                    .field-group {
                        gap: 16px;
                    }
                }
            `}),e.jsxs("div",{className:"login-root",children:[e.jsx("div",{className:"login-bg"}),e.jsx("div",{className:"grid-overlay"}),e.jsx("div",{className:"orb orb-1"}),e.jsx("div",{className:"orb orb-2"}),e.jsx("div",{className:"login-panel",children:e.jsxs("div",{className:"glass-card",children:[e.jsx("a",{href:"/",children:e.jsxs("div",{className:"logo-wrap",children:[e.jsx("div",{className:"logo-ring",children:e.jsx("img",{src:"/images/brgy-ll-logo.png",alt:"Barangay Logo"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"login-title",children:"Welcome Back"}),e.jsx("p",{className:"login-subtitle",children:"Barangay Portal"}),e.jsx("div",{className:"title-divider"})]})]})}),e.jsxs("form",{onSubmit:d,children:[e.jsxs("div",{className:"field-group",children:[e.jsxs("div",{children:[e.jsx("label",{className:"field-label",htmlFor:"email",children:"Username / Email Address"}),e.jsx("div",{className:"field-input-wrap",children:e.jsx("input",{id:"email",name:"email",type:"email",value:a.email,onChange:i=>t("email",i.target.value),autoComplete:"email",style:r.email?{borderColor:"rgba(239,68,68,0.7)"}:{}})}),r.email&&e.jsx("p",{style:{color:"#f87171",fontSize:"0.82rem",marginTop:"6px"},children:r.email})]}),e.jsxs("div",{children:[e.jsx("label",{className:"field-label",htmlFor:"password",children:"Password"}),e.jsxs("div",{className:"field-input-wrap",children:[e.jsx("input",{id:"password",name:"password",type:o?"text":"password",value:a.password,onChange:i=>t("password",i.target.value),autoComplete:"current-password",style:{paddingRight:"44px",...r.password?{borderColor:"rgba(239,68,68,0.7)"}:{}}}),e.jsx("button",{type:"button",onClick:p,className:"pw-toggle",children:o?e.jsx(m,{size:15}):e.jsx(b,{size:15})})]}),r.password&&e.jsx("p",{style:{color:"#f87171",fontSize:"0.82rem",marginTop:"6px"},children:r.password})]})]}),e.jsxs("div",{className:"meta-row",children:[e.jsxs("label",{className:"remember-label",children:[e.jsx("input",{type:"checkbox",checked:a.remember,onChange:i=>t("remember",i.target.checked)}),e.jsx("span",{children:"Remember me"})]}),e.jsx("a",{href:"#",className:"forgot-link",children:"Forgot password?"})]}),e.jsx("button",{type:"submit",className:"btn-signin",disabled:n,children:n?"Signing in…":"Sign In"})]}),e.jsxs("div",{className:"sep",children:[e.jsx("div",{className:"sep-line"}),e.jsx("span",{className:"sep-text",children:"Don't have an account?"}),e.jsx("div",{className:"sep-line"})]}),e.jsx(c,{href:"/auth/register",className:"btn-register",children:"Create an Account"})]})})]})]})}export{w as default};
