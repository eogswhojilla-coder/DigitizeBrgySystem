import { Link } from "@inertiajs/react";
import { useState, useEffect, useCallback } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
    ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

const barangayHighlights = [
    {
        id: 1,
        image: "/images/highlights/barangay-hall.jpg",
        title: "Modern Barangay Hall",
        description: "Your community center for all barangay services",
        alt: "Barangay Hall",
        tag: "Infrastructure",
        unsplashId: "1497436072909-60f360e1d4b1",
    },
    {
        id: 2,
        image: "/images/highlights/community-event.jpg",
        title: "Community Events",
        description:
            "Bringing residents together through meaningful activities",
        alt: "Community Event",
        tag: "Community",
        unsplashId: "1493246507139-91e8fad9978e",
    },
    {
        id: 3,
        image: "/images/highlights/digital-services.jpg",
        title: "Digital Services",
        description: "Access barangay services anytime, anywhere",
        alt: "Digital Services",
        tag: "Technology",
        unsplashId: "1518623489648-a173ef7824f3",
    },
    {
        id: 4,
        image: "/images/highlights/health-center.jpg",
        title: "Health & Wellness",
        description: "Quality healthcare services for every resident",
        alt: "Health Center",
        tag: "Healthcare",
        unsplashId: "1581092795360-fd1ca04f0952",
    },
];

const ctaButtons = [
    {
        href: "/auth/login",
        label: "Login to Portal",
        icon: "🔐",
        primary: true,
    },
    {
        href: "/auth/register",
        label: "Register as Resident",
        icon: "📝",
        primary: false,
    },
    { href: "#track", label: "Track Request", icon: "🔍", primary: false },
    { href: "#blotter", label: "File Blotter", icon: "⚖️", primary: false },
];

const stats = [
    { value: "7016+", label: "Residents Served" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Digital Access" },
];

export default function HeroSection({ highlights }) {
    const displayHighlights =
        highlights && highlights.length > 0 ? highlights : barangayHighlights;

    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(null);

    const SLIDE_DURATION = 5000;

    const changeSlide = useCallback((newIndex) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveIndex(newIndex);
            setIsTransitioning(false);
            setProgress(0);
        }, 400);
    }, []);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) return 0;
                return p + 100 / (SLIDE_DURATION / 50);
            });
        }, 50);
        return () => clearInterval(progressInterval);
    }, [activeIndex]);

    useEffect(() => {
        const interval = setInterval(() => {
            changeSlide((activeIndex + 1) % displayHighlights.length);
        }, SLIDE_DURATION);
        return () => clearInterval(interval);
    }, [activeIndex, changeSlide, displayHighlights.length]);

    const goToPrevious = () => {
        changeSlide(
            activeIndex === 0 ? displayHighlights.length - 1 : activeIndex - 1,
        );
    };

    const goToNext = () => {
        changeSlide((activeIndex + 1) % displayHighlights.length);
    };

    const openModal = (slide) => {
        setSelectedSlide(slide);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSlide(null);
    };

    const navigateModalSlide = (direction) => {
        let newIndex;
        const currentIdx = displayHighlights.findIndex(
            (s) => s.id === selectedSlide.id,
        );

        if (direction === "prev") {
            newIndex =
                currentIdx === 0
                    ? displayHighlights.length - 1
                    : currentIdx - 1;
        } else {
            newIndex =
                currentIdx === displayHighlights.length - 1
                    ? 0
                    : currentIdx + 1;
        }

        setSelectedSlide(displayHighlights[newIndex]);
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isModalOpen) return;
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowLeft") navigateModalSlide("prev");
            if (e.key === "ArrowRight") navigateModalSlide("next");
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen, selectedSlide]);

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center overflow-hidden bg-gray-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-0 dark:opacity-20 -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/10 dark:bg-yellow-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] -z-10" />

            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-100 dark:from-slate-900 via-yellow-500 to-gray-100 dark:to-slate-900" />

            <div className="max-w-7xl mx-auto px-6 md:px-10 w-full py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 dark:border-yellow-500/20">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                            <span className="text-xs font-bold tracking-widest text-yellow-600 dark:text-yellow-500 uppercase">
                                Official Portal
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
                            Barangay II{" "}
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                                Management System
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                            Fast, transparent, and fully digital — empowering
                            every resident with accessible, efficient, and
                            accountable barangay services at your fingertips.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {ctaButtons.map((btn, index) => (
                                <Link
                                    key={index}
                                    href={btn.href}
                                    className={`group relative px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden ${
                                        btn.primary
                                            ? "bg-yellow-500 text-slate-950 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/25"
                                            : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-yellow-500/30"
                                    }`}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <span>{btn.icon}</span>
                                        <span>{btn.label}</span>
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                            <div className="grid grid-cols-3 gap-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Carousel */}
                    <div className="relative">
                        {/* Main Carousel Frame */}
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-white/10 shadow-2xl group">
                            {displayHighlights.map((s, index) => (
                                <div
                                    key={s.id}
                                    className={`absolute inset-0 transition-all duration-500 ${
                                        index === activeIndex &&
                                        !isTransitioning
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-105"
                                    }`}
                                >
                                    {/* Clickable Image Container */}
                                    <div
                                        className="relative w-full h-full cursor-pointer"
                                        onClick={() => openModal(s)}
                                    >
                                        <img
                                            src={s.image}
                                            alt={s.alt}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.parentElement.innerHTML = `
                                                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                                                        <div class="text-center text-slate-500">
                                                            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <p class="text-sm font-medium">Image Unavailable</p>
                                                        </div>
                                                    </div>
                                                `;
                                            }}
                                        />

                                        {/* Hover Overlay with Expand Icon */}
                                        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                            <div className="w-16 h-16 rounded-full bg-yellow-500/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                <ArrowsPointingOutIcon className="w-8 h-8 text-slate-950" />
                                            </div>
                                        </div>

                                        {/* Gradient Overlay - pointer-events-none */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />

                                        {/* Slide Content - pointer-events-none */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pointer-events-none">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                                                    {s.tag}
                                                </span>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                                {s.title}
                                            </h3>
                                            <p className="text-sm text-slate-400">
                                                {s.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:bg-yellow-500 hover:text-slate-950 hover:border-yellow-500 transition-all duration-300 z-10"
                                aria-label="Previous slide"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:bg-yellow-500 hover:text-slate-950 hover:border-yellow-500 transition-all duration-300 z-10"
                                aria-label="Next slide"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>

                            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-white">
                                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                                {String(displayHighlights.length).padStart(
                                    2,
                                    "0",
                                )}
                            </div>

                            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                                {displayHighlights.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => changeSlide(index)}
                                        className="group"
                                        aria-label={`Go to slide ${index + 1}`}
                                    >
                                        <div
                                            className={`h-1 rounded-full transition-all duration-300 ${
                                                index === activeIndex
                                                    ? "w-8 bg-yellow-500"
                                                    : "w-2 bg-white/30 hover:bg-white/50"
                                            }`}
                                        >
                                            {index === activeIndex && (
                                                <div
                                                    className="h-full bg-yellow-400 rounded-full transition-all duration-100"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-yellow-500/5 dark:from-yellow-500/10 to-blue-500/5 dark:to-blue-500/10 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
            {isModalOpen && selectedSlide && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md"
                        onClick={closeModal}
                    />

                    <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <button
                            onClick={() => navigateModalSlide("prev")}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:bg-yellow-500 hover:text-slate-950 hover:border-yellow-500 transition-all duration-300"
                            aria-label="Previous image"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => navigateModalSlide("next")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:bg-yellow-500 hover:text-slate-950 hover:border-yellow-500 transition-all duration-300"
                            aria-label="Next image"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>

                        {/* Image Container */}
                        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                            {/* Image Section */}
                            <div className="lg:w-2/3 h-64 lg:h-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <img
                                    src={selectedSlide.image}
                                    alt={selectedSlide.alt}
                                    className="w-full h-full object-contain max-h-[50vh] lg:max-h-[85vh]"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.parentElement.innerHTML = `
                                            <div class="flex items-center justify-center h-full min-h-[300px]">
                                                <div class="text-center text-slate-500">
                                                    <svg class="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                    <p class="text-lg font-medium">Image Unavailable</p>
                                                </div>
                                            </div>
                                        `;
                                    }}
                                />
                            </div>

                            {/* Details Section */}
                            <div className="lg:w-1/3 p-6 md:p-8 flex flex-col justify-center bg-white/50 dark:bg-slate-900/50">
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-xs font-bold tracking-widest uppercase mb-4">
                                        {selectedSlide.tag}
                                    </span>
                                    <h2
                                        id="modal-title"
                                        className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4"
                                    >
                                        {selectedSlide.title}
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {selectedSlide.description}
                                    </p>
                                </div>

                                {/* Image Counter */}
                                <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                                    <span className="font-mono">
                                        {String(
                                            displayHighlights.findIndex(
                                                (s) =>
                                                    s.id === selectedSlide.id,
                                            ) + 1,
                                        ).padStart(2, "0")}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                                    <span className="font-mono">
                                        {String(
                                            displayHighlights.length,
                                        ).padStart(2, "0")}
                                    </span>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                                    <button className="w-full py-3 px-4 rounded-xl bg-yellow-500 text-slate-950 font-medium hover:bg-yellow-400 transition-colors duration-300">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}