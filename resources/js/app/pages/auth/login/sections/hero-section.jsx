import { Link } from "@inertiajs/react";
import { useState, useEffect, useCallback } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
    ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

// ─── Static Data ──────────────────────────────────────────────────────────────

const barangayHighlights = [
    {
        id: 1,
        image: "/images/highlights/barangay-hall.jpg",
        title: "Modern Barangay Hall",
        description: "Your community center for all barangay services",
        alt: "Barangay Hall",
        tag: "Infrastructure",
    },
    {
        id: 2,
        image: "/images/highlights/community-event.jpg",
        title: "Community Events",
        description: "Bringing residents together through meaningful activities",
        alt: "Community Event",
        tag: "Community",
    },
    {
        id: 3,
        image: "/images/highlights/digital-services.jpg",
        title: "Digital Services",
        description: "Access barangay services anytime, anywhere",
        alt: "Digital Services",
        tag: "Technology",
    },
    {
        id: 4,
        image: "/images/highlights/health-center.jpg",
        title: "Health & Wellness",
        description: "Quality healthcare services for every resident",
        alt: "Health Center",
        tag: "Healthcare",
    },
];

const ctaButtons = [
    { href: "/auth/login",    label: "Login to Portal",       icon: "🔐", primary: true  },
    { href: "/auth/register", label: "Register as Resident",  icon: "📝", primary: false },
    { href: "#track",         label: "Track Request",          icon: "🔍", primary: false },
    { href: "#blotter",       label: "File Blotter",           icon: "⚖️", primary: false },
];

const stats = [
    { value: "7,016+", label: "Residents Served" },
    { value: "98%",    label: "Satisfaction Rate" },
    { value: "24/7",   label: "Digital Access"   },
    { value: "4.9★",   label: "Average Rating"   },
];

const SLIDE_DURATION = 5000;
const TRANSITION_MS   = 400;
function NavButton({ onClick, direction, label, size = "sm" }) {
    const dim = size === "lg" ? "w-12 h-12" : "w-10 h-10";
    const ico = size === "lg" ? "w-6 h-6"   : "w-5 h-5";
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className={`${dim} rounded-full flex items-center justify-center
                bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm
                border border-slate-300 dark:border-slate-700
                text-slate-700 dark:text-slate-300 shadow-lg
                hover:bg-amber-500 hover:text-white hover:border-amber-500
                active:scale-95 transition-all duration-200`}
        >
            {direction === "prev"
                ? <ChevronLeftIcon  className={ico} />
                : <ChevronRightIcon className={ico} />}
        </button>
    );
}
function TagPill({ label }) {
    return (
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-[0.18em] uppercase
            bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30
            text-amber-800 dark:text-amber-400">
            {label}
        </span>
    );
}
function ImageFallback({ large }) {
    return (
        <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800">
            <div className="text-center text-slate-400 dark:text-slate-500">
                <svg className={`${large ? "w-20 h-20" : "w-14 h-14"} mx-auto mb-3 opacity-40`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Image Unavailable</p>
            </div>
        </div>
    );
}
function LightboxModal({ slides, selectedSlide, onClose, onNavigate }) {
    const currentIdx = slides.findIndex((s) => s.id === selectedSlide.id);
    const [imgError, setImgError] = useState(false);

    // Reset error state on slide change
    useEffect(() => { setImgError(false); }, [selectedSlide]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape")      onClose();
            if (e.key === "ArrowLeft")   onNavigate("prev");
            if (e.key === "ArrowRight")  onNavigate("next");
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose, onNavigate]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            role="dialog" aria-modal="true" aria-labelledby="modal-title"
        >
            <div
                className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md"
                onClick={onClose}
            />
            <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col lg:flex-row
                bg-white dark:bg-slate-900 rounded-2xl overflow-hidden
                border border-slate-300 dark:border-slate-700
                shadow-[0_32px_80px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full
                        bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700
                        flex items-center justify-center
                        text-slate-600 dark:text-slate-300
                        hover:bg-red-500 hover:text-white hover:border-red-500
                        transition-all duration-200"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
                <div className="lg:w-2/3 h-60 lg:h-auto min-h-[260px] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {imgError
                        ? <ImageFallback large />
                        : <img
                            key={selectedSlide.id}
                            src={selectedSlide.image}
                            alt={selectedSlide.alt}
                            className="w-full h-full object-contain max-h-[50vh] lg:max-h-[85vh]"
                            onError={() => setImgError(true)}
                          />
                    }

                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                        <div className="pointer-events-auto">
                            <NavButton onClick={() => onNavigate("prev")} direction="prev" label="Previous image" size="lg" />
                        </div>
                        <div className="pointer-events-auto">
                            <NavButton onClick={() => onNavigate("next")} direction="next" label="Next image" size="lg" />
                        </div>
                    </div>
                </div>

                {/* Detail Pane */}
                <div className="lg:w-1/3 p-7 md:p-10 flex flex-col justify-between
                    bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l
                    border-slate-200 dark:border-slate-800">

                    <div className="space-y-4">
                        <TagPill label={selectedSlide.tag} />
                        <h2 id="modal-title"
                            className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
                            {selectedSlide.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                            {selectedSlide.description}
                        </p>
                    </div>

                    <div className="mt-8 space-y-5">
                        {/* Counter */}
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-slate-500">
                            <span>{String(currentIdx + 1).padStart(2, "0")}</span>
                            <span className="flex-1 h-px bg-slate-300 dark:bg-slate-800" />
                            <span>{String(slides.length).padStart(2, "0")}</span>
                        </div>

                        <button className="w-full py-3 px-4 rounded-xl
                            bg-amber-600 dark:bg-amber-500 text-white dark:text-slate-950 font-semibold text-sm
                            hover:bg-amber-500 dark:hover:bg-amber-400 active:scale-[.98]
                            transition-all duration-200 shadow-sm">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HeroSection({ highlights }) {
    const slides = highlights?.length ? highlights : barangayHighlights;

    const [activeIndex,    setActiveIndex]    = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [progress,       setProgress]       = useState(0);
    const [modalSlide,     setModalSlide]      = useState(null);

    // ── slide change ──
    const changeSlide = useCallback((idx) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveIndex(idx);
            setIsTransitioning(false);
            setProgress(0);
        }, TRANSITION_MS);
    }, []);

    // ── auto-progress bar ──
    useEffect(() => {
        const id = setInterval(() => {
            setProgress((p) => (p >= 100 ? 0 : p + 100 / (SLIDE_DURATION / 50)));
        }, 50);
        return () => clearInterval(id);
    }, [activeIndex]);

    // ── auto-advance ──
    useEffect(() => {
        const id = setInterval(
            () => changeSlide((activeIndex + 1) % slides.length),
            SLIDE_DURATION,
        );
        return () => clearInterval(id);
    }, [activeIndex, changeSlide, slides.length]);

    const goTo     = (idx) => changeSlide((idx + slides.length) % slides.length);
    const openModal  = (s) => setModalSlide(s);
    const closeModal = ()  => setModalSlide(null);
    const navigateModal = useCallback((dir) => {
        setModalSlide((cur) => {
            const idx = slides.findIndex((s) => s.id === cur.id);
            const next = dir === "prev" ? (idx - 1 + slides.length) % slides.length : (idx + 1) % slides.length;
            return slides[next];
        });
    }, [slides]);

    return (
        <>
            <section
                id="hero"
                className="relative min-h-screen flex items-center overflow-hidden
                    bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50
                    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
                    text-slate-900 dark:text-slate-100"
                style={{
                    backgroundImage: "url('/images/CARTOON_BACKGROUND.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* ── Overlays & Atmospheric Effects ── */}
                <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/70" />

                {/* Warm glow top */}
                <div className="absolute top-0 left-1/3 w-[700px] h-[500px]
                    bg-amber-400/15 dark:bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
                {/* Cool glow bottom-right */}
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px]
                    bg-blue-400/15 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                {/* ── Content ── */}
                <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 xl:px-20 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 items-center">

                        {/* ── Left: Copy ── */}
                        <div className="space-y-6 max-w-2xl">

                            {/* Official badge */}
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-sm
                                bg-transparent border-l-2 border-amber-600 dark:border-amber-500">
                                <span className="text-[10px] font-black tracking-[0.2em] text-amber-700 dark:text-amber-500 uppercase">
                                    Official Digital Portal
                                </span>
                            </div>

                            {/* Headline */}
                            <div>
                                <h1 className="text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-black leading-[1.1] text-slate-900 dark:text-white">
                                    Barangay{" "}
                                    <span className="text-amber-600 dark:text-amber-500">
                                        Management
                                    </span>
                                    {" "}System
                                </h1>
                            </div>

                            {/* Body */}
                            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 max-w-xl">
                                Fast, transparent, and fully digital — empowering every resident
                                with accessible, efficient, and accountable barangay services
                                at your fingertips.
                            </p>

                            {/* CTA buttons */}
                            <div className="flex flex-wrap gap-3">
                                {ctaButtons.map((btn, i) => (
                                    <Link
                                        key={i}
                                        href={btn.href}
                                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg
                                            text-sm font-semibold active:scale-[.97]
                                            transition-all duration-200
                                            ${btn.primary
                                                ? "bg-amber-600 dark:bg-amber-500 text-white dark:text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-500 dark:hover:bg-amber-400"
                                                : "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/80"
                                            }`}
                                    >
                                        <span className="text-base leading-none">{btn.icon}</span>
                                        <span>{btn.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                                {stats.map((stat, i) => (
                                    <div key={i} className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-300 dark:border-slate-700/50 rounded-lg p-4
                                        hover:bg-white/80 dark:hover:bg-slate-800/60 hover:border-slate-400 dark:hover:border-slate-600/50 transition-all duration-200">
                                        <div className="text-2xl md:text-3xl font-black text-amber-600 dark:text-amber-500 tabular-nums">
                                            {stat.value}
                                        </div>
                                        <div className="mt-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-600 dark:text-slate-400">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Right: Carousel ── */}
                        <div className="relative w-full">
                            <div className="absolute -z-10 inset-0 scale-110
                                bg-gradient-to-br from-amber-200/20 to-blue-200/20
                                dark:from-amber-400/10 dark:to-sky-400/10
                                rounded-3xl blur-3xl" />

                            {/* Carousel frame */}
                            <div className="relative aspect-[16/12] rounded-2xl overflow-hidden     
                                bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm
                                border border-slate-300 dark:border-slate-700/50
                                shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                                group">

                                {/* Slides */}
                                {slides.map((s, i) => (
                                    <SlideItem
                                        key={s.id}
                                        slide={s}
                                        active={i === activeIndex && !isTransitioning}
                                        onClick={() => openModal(s)}
                                    />
                                ))}

                                {/* ── Carousel Controls ── */}
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                    <NavButton onClick={() => goTo(activeIndex - 1)} direction="prev" label="Previous slide" />
                                </div>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                                    <NavButton onClick={() => goTo(activeIndex + 1)} direction="next" label="Next slide" />
                                </div>

                                {/* Slide counter badge */}
                                <div className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-md
                                    bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm
                                    border border-slate-300 dark:border-slate-700
                                    text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 shadow-lg">
                                    {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                                </div>

                                {/* Dot / progress indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {slides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => changeSlide(i)}
                                            aria-label={`Go to slide ${i + 1}`}
                                            className="group/dot"
                                        >
                                            <div className={`h-[3px] rounded-full transition-all duration-300 overflow-hidden
                                                ${i === activeIndex ? "w-8 bg-amber-500/30" : "w-2 bg-white/25 hover:bg-white/40"}`}>
                                                {i === activeIndex && (
                                                    <div
                                                        className="h-full bg-amber-500 rounded-full"
                                                        style={{ width: `${progress}%`, transition: "width 50ms linear" }}
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Bottom Rule ── */}
                <div className="absolute bottom-0 inset-x-0 h-px
                    bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
            </section>

            {/* ── Lightbox Modal ── */}
            {modalSlide && (
                <LightboxModal
                    slides={slides}
                    selectedSlide={modalSlide}
                    onClose={closeModal}
                    onNavigate={navigateModal}
                />
            )}
        </>
    );
}

// ── Slide Item ─────────────────────────────────────────────────────────────────

function SlideItem({ slide, active, onClick }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className={`absolute inset-0 transition-all duration-500
            ${active ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
            <div
                className="relative w-full h-full cursor-zoom-in"
                onClick={onClick}
            >
                {imgError
                    ? <ImageFallback />
                    : <img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                }

                {/* Hover expand hint */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center
                        scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        <ArrowsPointingOutIcon className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Caption overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10 pointer-events-none">
                    <TagPill label={slide.tag} />
                    <h3 className="mt-3 text-2xl md:text-3xl font-black text-white leading-tight">
                        {slide.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300/80 leading-relaxed max-w-sm">
                        {slide.description}
                    </p>
                </div>
            </div>
        </div>
    );
}