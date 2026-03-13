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
// const {
//     statsData,
//     genderData,
//     ageGroupData,
//     monthlyActivityData,
//     blotterStatusData,
//     familyDistributionData,
//     inventoryData,
//     recentTransactions,
//     activityFeed,
// } = usePage().props;

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
            className="group relative p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20"
        >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent blur-xl" />
            </div>

            {/* Icon Container */}
            <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all duration-300">
                    {icon}
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-2xl border border-yellow-500/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
            </div>

            {/* Counter Number */}
            <div className="text-center mb-3">
                <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                    {count.toLocaleString()}
                    <span className="text-yellow-500">{suffix}</span>
                </div>
            </div>

            {/* Label */}
            <div className="text-center">
                <div className="text-xs font-mono tracking-widest text-yellow-500 uppercase mb-1">
                    {label}
                </div>
            </div>

            {/* Card Border Gradient */}
            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </div>
    );
}

export default function StatsSection() {
    return (
        <section className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-gray-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-0 dark:opacity-20 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold tracking-widest uppercase mb-4 border border-yellow-500/20">
                        By The Numbers
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                        Barangay <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                            At a Glance
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                        A snapshot of our community's growth, engagement, and
                        impact through the years.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatedCounter
                        // value={statsData.totalResidents.value}
                        // change={statsData.totalResidents.change}
                        target={7084}
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

                {/* Bottom Stats Summary */}
                <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-yellow-500/10 to-amber-600/10 border border-yellow-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                                <span className="text-yellow-500">99%</span>
                            </div>
                            <div className="text-sm text-slate-400">
                                Resident Satisfaction
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                                <span className="text-yellow-500">24/7</span>
                            </div>
                            <div className="text-sm text-slate-400">
                                Digital Services Available
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                                <span className="text-yellow-500">15+</span>
                            </div>
                            <div className="text-sm text-slate-400">
                                Years of Dedicated Service
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
