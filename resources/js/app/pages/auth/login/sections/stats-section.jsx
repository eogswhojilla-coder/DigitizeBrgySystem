import { useState, useEffect, useRef } from "react";

function useCountUp(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

function AnimatedCounter({ target, label, suffix = "", icon }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const count = useCountUp(target, 2200, visible);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setVisible(true);
            },
            { threshold: 0.3 },
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className="flex flex-col items-center p-8 rounded-2xl bg-white border border-gray-200 shadow-lg"
        >
            <span className="text-4xl mb-3">{icon}</span>
            <div className="text-5xl font-black mb-2 font-serif text-yellow-700">
                {count.toLocaleString()}
                {suffix}
            </div>
            <div className="text-sm font-medium tracking-widest uppercase text-center text-gray-500">
                {label}
            </div>
        </div>
    );
}

export default function StatsSection() {
    return (
        <section className="min-h-screen bg-gray-100 border-y border-gray-200 py-24 px-10 flex items-center">
            <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-16">
                    <div className="section-label flex justify-center">
                        By The Numbers
                    </div>
                    <h2 className="section-title">Barangay at a Glance</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatedCounter
                        target={12847}
                        label="Registered Residents"
                        icon="👥"
                    />
                    <AnimatedCounter
                        target={4320}
                        label="Certificates Issued"
                        suffix="+"
                        icon="📋"
                    />
                    <AnimatedCounter
                        target={48}
                        label="Active Announcements"
                        icon="📢"
                    />
                    <AnimatedCounter
                        target={216}
                        label="Blotter Reports Filed"
                        icon="⚖️"
                    />
                </div>
            </div>
        </section>
    );
}
