import{r,j as e}from"./app-BE-LrTTj.js";import"./index-GRQmbTFN.js";function b({title:s,titleId:i,...a},o){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":i},a),s?r.createElement("title",{id:i},s):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15.75 19.5 8.25 12l7.5-7.5"}))}const u=r.forwardRef(b);function v({title:s,titleId:i,...a},o){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":i},a),s?r.createElement("title",{id:i},s):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m8.25 4.5 7.5 7.5-7.5 7.5"}))}const y=r.forwardRef(v),w=[{id:1,image:"/images/highlights/barangay-hall.jpg",title:"Modern Barangay Hall",description:"Your community center for all barangay services",alt:"Barangay Hall",tag:"Infrastructure",unsplashId:"1497436072909-60f360e1d4b1"},{id:2,image:"/images/highlights/community-event.jpg",title:"Community Events",description:"Bringing residents together through meaningful activities",alt:"Community Event",tag:"Community",unsplashId:"1493246507139-91e8fad9978e"},{id:3,image:"/images/highlights/digital-services.jpg",title:"Digital Services",description:"Access barangay services anytime, anywhere",alt:"Digital Services",tag:"Technology",unsplashId:"1518623489648-a173ef7824f3"},{id:4,image:"/images/highlights/health-center.jpg",title:"Health & Wellness",description:"Quality healthcare services for every resident",alt:"Health Center",tag:"Healthcare",unsplashId:"1581092795360-fd1ca04f0952"}],j=[{value:"12K+",label:"Residents Served"},{value:"98%",label:"Satisfaction Rate"},{value:"24/7",label:"Digital Access"}];function S({highlights:s}){const i=s&&s.length>0?s:w,[a,o]=r.useState(0),[x,d]=r.useState(!1),[h,c]=r.useState(0),p=5e3,l=r.useCallback(t=>{d(!0),setTimeout(()=>{o(t),d(!1),c(0)},400)},[]);r.useEffect(()=>{const t=setInterval(()=>{c(n=>n>=100?0:n+100/(p/50))},50);return()=>clearInterval(t)},[a]),r.useEffect(()=>{const t=setInterval(()=>{l((a+1)%i.length)},p);return()=>clearInterval(t)},[a,l,i.length]);const f=()=>{l(a===0?i.length-1:a-1)},m=()=>{l((a+1)%i.length)};return i[a],e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

                .hero-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #f5f6fa;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }

                /* Subtle official seal watermark */
                .hero-root::before {
                    content: '';
                    position: absolute;
                    top: -120px;
                    right: -120px;
                    width: 500px;
                    height: 500px;
                    border-radius: 50%;
                    border: 60px solid rgba(30, 58, 138, 0.04);
                    pointer-events: none;
                    z-index: 0;
                }
                .hero-root::after {
                    content: '';
                    position: absolute;
                    top: -80px;
                    right: -80px;
                    width: 380px;
                    height: 380px;
                    border-radius: 50%;
                    border: 40px solid rgba(30, 58, 138, 0.04);
                    pointer-events: none;
                    z-index: 0;
                }

                /* Top accent bar */
                .top-bar {
                    width: 100%;
                    height: 4px;
                    background: linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #facc15 100%);
                    position: relative;
                    z-index: 10;
                }

                /* Main content grid */
                .hero-content {
                    position: relative;
                    z-index: 2;
                    flex: 1;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0;
                    max-width: 1400px;
                    width: 100%;
                    margin: 0 auto;
                    padding: 64px 48px 48px;
                    align-items: center;
                }

                /* Left side */
                .hero-left {
                    padding-right: 60px;
                    display: flex;
                    flex-direction: column;
                    gap: 28px;
                }

                .eyebrow {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .eyebrow-badge {
                    background: #1e3a8a;
                    color: #fff;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    border-radius: 2px;
                }

                .eyebrow-line {
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, #1e3a8a44, transparent);
                }

                .hero-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(40px, 5.5vw, 76px);
                    font-weight: 900;
                    line-height: 1.05;
                    color: #0d1b3e;
                    margin: 0;
                    letter-spacing: -0.02em;
                }

                .hero-title .accent {
                    color: #2563eb;
                    display: block;
                }

                .hero-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .divider-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #facc15;
                    flex-shrink: 0;
                }

                .divider-line {
                    height: 1px;
                    width: 60px;
                    background: #d1d5db;
                }

                .hero-desc {
                    font-size: 16px;
                    color: #4b5563;
                    line-height: 1.75;
                    font-weight: 300;
                    max-width: 420px;
                    margin: 0;
                }

                /* CTA buttons */
                .cta-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    max-width: 440px;
                }

                .cta-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    text-decoration: none;
                    border: 1.5px solid transparent;
                    font-family: 'DM Sans', sans-serif;
                    white-space: nowrap;
                    justify-content: center;
                }

                .cta-btn-icon {
                    font-size: 15px;
                    flex-shrink: 0;
                }

                .cta-btn.primary {
                    background: #1e3a8a;
                    color: #fff;
                    border-color: #1e3a8a;
                    grid-column: span 2;
                    padding: 14px 16px;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                }

                .cta-btn.primary:hover {
                    background: #1d4ed8;
                    border-color: #1d4ed8;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(30,58,138,0.25);
                }

                .cta-btn.secondary {
                    background: #fff;
                    color: #1e3a8a;
                    border-color: #d1d5db;
                }

                .cta-btn.secondary:hover {
                    border-color: #1e3a8a;
                    background: #eff6ff;
                    transform: translateY(-1px);
                }

                /* Stats row */
                .stats-row {
                    display: flex;
                    gap: 28px;
                    padding-top: 8px;
                    border-top: 1px solid #e5e7eb;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .stat-value {
                    font-family: 'Playfair Display', serif;
                    font-size: 22px;
                    font-weight: 700;
                    color: #0d1b3e;
                    line-height: 1;
                }

                .stat-label {
                    font-size: 11px;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 500;
                }

                /* Right side - Carousel */
                .hero-right {
                    position: relative;
                }

                .carousel-frame {
    position: relative;
    width: 100%;
    height: 600px; /* increased height */
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
        0 0 0 1px rgba(0,0,0,0.06),
        0 32px 100px rgba(30,58,138,0.18),
        0 12px 32px rgba(0,0,0,0.12);
}

                /* Decorative corner accent */
                .carousel-frame::before {
                    content: '';
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: calc(100% + 16px);
                    height: calc(100% + 16px);
                    border: 1.5px solid rgba(30,58,138,0.12);
                    border-radius: 16px;
                    z-index: -1;
                    pointer-events: none;
                }

                .carousel-slide {
                    position: absolute;
                    inset: 0;
                    transition: opacity 0.4s ease, transform 0.4s ease;
                }

                .carousel-slide.active {
                    opacity: 1;
                    transform: scale(1);
                }

                .carousel-slide.inactive {
                    opacity: 0;
                    transform: scale(1.02);
                }

                .carousel-slide img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .slide-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to top,
                        rgba(13,27,62,0.88) 0%,
                        rgba(13,27,62,0.3) 50%,
                        transparent 100%
                    );
                }

                .slide-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .slide-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(250,204,21,0.9);
                    color: #0d1b3e;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    padding: 3px 8px;
                    border-radius: 2px;
                    width: fit-content;
                    margin-bottom: 4px;
                }

                .slide-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 22px;
                    font-weight: 700;
                    color: #fff;
                    margin: 0;
                    line-height: 1.2;
                }

                .slide-desc {
                    font-size: 13px;
                    color: rgba(255,255,255,0.75);
                    margin: 0;
                    font-weight: 300;
                }

                /* Carousel controls */
                .carousel-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    padding: 0 14px;
                    pointer-events: none;
                    z-index: 10;
                }

                .nav-btn {
                    pointer-events: all;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.95);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
                    transition: all 0.15s ease;
                }

                .nav-btn:hover {
                    background: #fff;
                    transform: scale(1.08);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }

                .nav-btn svg {
                    width: 16px;
                    height: 16px;
                    color: #1e3a8a;
                }

                /* Slide indicators with progress */
                .slide-indicators {
                    position: absolute;
                    bottom: 28px;
                    right: 28px;
                    z-index: 20;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    align-items: flex-end;
                }

                .indicator {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    background: none;
                    border: none;
                    padding: 0;
                }

                .indicator-bar {
                    height: 2px;
                    border-radius: 2px;
                    background: rgba(255,255,255,0.3);
                    position: relative;
                    overflow: hidden;
                    transition: width 0.3s ease;
                }

                .indicator-bar.active {
                    width: 32px;
                }

                .indicator-bar.inactive {
                    width: 16px;
                }

                .indicator-fill {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    background: #facc15;
                    border-radius: 2px;
                }

                /* Slide counter */
                .slide-counter {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    z-index: 10;
                    background: rgba(13,27,62,0.7);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 4px;
                    padding: 6px 10px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #fff;
                    letter-spacing: 0.08em;
                }

                /* Mobile styles */
                @media (max-width: 1024px) {
                    .hero-content {
                        grid-template-columns: 1fr;
                        padding: 48px 24px 40px;
                        gap: 40px;
                    }

                    .hero-left {
                        padding-right: 0;
                        order: 2;
                        text-align: center;
                        align-items: center;
                    }

                    .hero-right {
                        order: 1;
                    }

                    .eyebrow {
                        justify-content: center;
                    }

                    .eyebrow-line {
                        display: none;
                    }

                    .hero-desc {
                        text-align: center;
                    }

                    .cta-grid {
                        width: 100%;
                        max-width: 360px;
                    }

                    .stats-row {
                        justify-content: center;
                    }

                    .hero-title {
                        text-align: center;
                    }
                }

                @media (max-width: 480px) {
                    .hero-content {
                        padding: 36px 16px 32px;
                    }

                    .cta-grid {
                        grid-template-columns: 1fr;
                        max-width: 280px;
                    }

                    .cta-btn.primary {
                        grid-column: span 1;
                    }
                }
            `}),e.jsxs("div",{className:"hero-root",children:[e.jsx("div",{className:"top-bar"}),e.jsxs("div",{className:"hero-content",children:[e.jsxs("div",{className:"hero-left",children:[e.jsxs("div",{className:"eyebrow",children:[e.jsx("span",{className:"eyebrow-badge",children:"Official Portal"}),e.jsx("span",{className:"eyebrow-line"})]}),e.jsxs("h1",{className:"hero-title",children:["Barangay II",e.jsx("span",{className:"accent",children:"Management System"})]}),e.jsxs("div",{className:"hero-divider",children:[e.jsx("span",{className:"divider-dot"}),e.jsx("span",{className:"divider-line"})]}),e.jsx("p",{className:"hero-desc",children:"Fast, transparent, and fully digital — empowering every resident with accessible, efficient, and accountable barangay services at your fingertips."}),e.jsx("div",{className:"stats-row",children:j.map(t=>e.jsxs("div",{className:"stat-item",children:[e.jsx("span",{className:"stat-value",children:t.value}),e.jsx("span",{className:"stat-label",children:t.label})]},t.label))})]}),e.jsx("div",{className:"hero-right",children:e.jsxs("div",{className:"carousel-frame",children:[i.map((t,n)=>e.jsxs("div",{className:`carousel-slide ${n===a&&!x?"active":"inactive"}`,children:[e.jsx("img",{src:t.image,alt:t.alt,onError:g=>{g.target.style.display="none",g.target.parentElement.innerHTML='<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700"><div class="text-center text-white p-8"><svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="text-lg font-semibold">Image Unavailable</p></div></div>'}}),e.jsx("div",{className:"slide-overlay"}),e.jsxs("div",{className:"slide-info",children:[e.jsx("span",{className:"slide-tag",children:t.tag}),e.jsx("h3",{className:"slide-title",children:t.title}),e.jsx("p",{className:"slide-desc",children:t.description})]})]},t.id)),e.jsxs("div",{className:"slide-counter",children:[String(a+1).padStart(2,"0")," /"," ",String(i.length).padStart(2,"0")]}),e.jsxs("div",{className:"carousel-nav",children:[e.jsx("button",{onClick:f,className:"nav-btn","aria-label":"Previous slide",children:e.jsx(u,{})}),e.jsx("button",{onClick:m,className:"nav-btn","aria-label":"Next slide",children:e.jsx(y,{})})]}),e.jsx("div",{className:"slide-indicators",children:i.map((t,n)=>e.jsx("button",{className:"indicator",onClick:()=>l(n),"aria-label":`Go to slide ${n+1}`,children:e.jsx("div",{className:`indicator-bar ${n===a?"active":"inactive"}`,children:n===a&&e.jsx("div",{className:"indicator-fill",style:{width:`${h}%`}})})},n))})]})})]})]})]})}export{S as default};
