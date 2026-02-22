import { Link } from "@inertiajs/react";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Button from "@/app/_components/button";

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
    { value: "12K+", label: "Residents Served" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Digital Access" },
];

export default function HeroSection({ highlights }) {
    // Use highlights from backend or fallback to default hardcoded data
    const displayHighlights = highlights && highlights.length > 0 ? highlights : barangayHighlights;
    
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [progress, setProgress] = useState(0);

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

    const slide = displayHighlights[activeIndex];

    return (
        <>
            <style>{`
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
            `}</style>

            <div className="hero-root">
                <div className="top-bar" />

                <div className="hero-content">
                    {/* Left Column */}
                    <div className="hero-left">
                        <div className="eyebrow">
                            <span className="eyebrow-badge">
                                Official Portal
                            </span>
                            <span className="eyebrow-line" />
                        </div>

                        <h1 className="hero-title">
                            Barangay II
                            <span className="accent">Management System</span>
                        </h1>

                        <div className="hero-divider">
                            <span className="divider-dot" />
                            <span className="divider-line" />
                        </div>

                        <p className="hero-desc">
                            Fast, transparent, and fully digital — empowering
                            every resident with accessible, efficient, and
                            accountable barangay services at your fingertips.
                        </p>

                        {/* Stats */}
                        <div className="stats-row">
                            {stats.map((s) => (
                                <div key={s.label} className="stat-item">
                                    <span className="stat-value">
                                        {s.value}
                                    </span>
                                    <span className="stat-label">
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Carousel */}
                    <div className="hero-right">
                        <div className="carousel-frame">
                            {displayHighlights.map((s, index) => (
                                <div
                                    key={s.id}
                                    className={`carousel-slide ${index === activeIndex && !isTransitioning ? "active" : "inactive"}`}
                                >
                                    <img
                                        src={s.image}
                                        alt={s.alt}
                                        onError={(e) => {
                                            e.target.src = s.unsplashId 
                                                ? `https://images.unsplash.com/photo-${s.unsplashId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`
                                                : 'https://via.placeholder.com/1200x600?text=Barangay+Highlight';
                                        }}
                                    />
                                    <div className="slide-overlay" />
                                    <div className="slide-info">
                                        <span className="slide-tag">
                                            {s.tag}
                                        </span>
                                        <h3 className="slide-title">
                                            {s.title}
                                        </h3>
                                        <p className="slide-desc">
                                            {s.description}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Slide counter */}
                            <div className="slide-counter">
                                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                                {String(displayHighlights.length).padStart(
                                    2,
                                    "0",
                                )}
                            </div>

                            {/* Navigation Arrows */}
                            <div className="carousel-nav">
                                <button
                                    onClick={goToPrevious}
                                    className="nav-btn"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeftIcon />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="nav-btn"
                                    aria-label="Next slide"
                                >
                                    <ChevronRightIcon />
                                </button>
                            </div>

                            {/* Progress Indicators */}
                            <div className="slide-indicators">
                                {displayHighlights.map((_, index) => (
                                    <button
                                        key={index}
                                        className="indicator"
                                        onClick={() => changeSlide(index)}
                                        aria-label={`Go to slide ${index + 1}`}
                                    >
                                        <div
                                            className={`indicator-bar ${index === activeIndex ? "active" : "inactive"}`}
                                        >
                                            {index === activeIndex && (
                                                <div
                                                    className="indicator-fill"
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
                    </div>
                </div>
            </div>
        </>
    );
}
