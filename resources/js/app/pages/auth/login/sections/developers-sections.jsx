"use client";

import { useState } from "react";
import { FaReact } from "react-icons/fa";

export default function DevelopersSection() {
    const [imgErrors, setImgErrors] = useState({});

    const developers = [
        {
            id: 1,
            name: "Wacky D. Hojilla",
            role: "Programmer",
            description:
                "Develops and maintains the system’s core features, ensuring efficiency, functionality, and reliability.",
            image: "/images/1.png",
        },
        {
            id: 2,
            name: "Janvee M. Romano",
            role: "Team Leader / System Analyst",
            description:
                "Analyzes project data to support decisions while leading the team and ensuring smooth coordination and timely completion of tasks.",
            image: "/images/3.png",
        },
        {
            id: 3,
            name: "Ayesha Marga Dela Cruz",
            role: "Researcher",
            description:
                "Conducts research and gathers relevant information to ensure the system meets technical standards and user needs.",
            image: "/images/2.png",
        },
    ];

    const handleImageError = (id) => {
        setImgErrors((prev) => ({ ...prev, [id]: true }));
    };

    const getInitials = (name) =>
        name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

    return (
        <section
            id="developers"
            aria-labelledby="developers-heading"
            className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
        >
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20 -z-10" />

            <div className="px-6 md:px-12 lg:px-16 xl:px-20">
                {/* Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-sm mb-6
                        bg-transparent border-l-2 border-amber-600 dark:border-amber-500">
                        <span className="text-[10px] font-black tracking-[0.2em] text-amber-700 dark:text-amber-500 uppercase">
                            The Crew
                        </span>
                    </div>
                    <h2
                        id="developers-heading"
                        className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6"
                    >
                        Meet the{" "}
                        <span className="text-amber-600 dark:text-amber-500">
                            Developers
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        The dedicated minds behind the Barangay Management
                        System. We combine technical expertise with community
                        passion to build impactful solutions.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {developers.map((dev) => (
                        <div
                            key={dev.id}
                            className="group relative p-1 rounded-2xl bg-gradient-to-b from-amber-500/20 dark:from-amber-500/10 to-transparent hover:from-amber-500/40 dark:hover:from-amber-500/20 transition-all duration-500"
                        >
                            {/* Card Content */}
                            <div className="relative h-full bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl rounded-xl p-8 flex flex-col items-center text-center border border-slate-300 dark:border-slate-700/50 transition-colors duration-300 hover:bg-white/80 dark:hover:bg-slate-800/60">
                                {/* Glow Effect behind image */}
                                <div className="absolute top-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/40 transition-all duration-500" />

                                {/* Image Container */}
                                <div className="relative mb-6 mt-2">
                                    <div className="w-32 h-32 rounded-full p-1 bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-800 group-hover:ring-amber-500/50 transition-all duration-500 overflow-hidden relative z-10">
                                        {!imgErrors[dev.id] ? (
                                            <img
                                                src={dev.image}
                                                alt={`${dev.name}`}
                                                className="w-full h-full rounded-full object-cover"
                                                onError={() =>
                                                    handleImageError(dev.id)
                                                }
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                                <span className="text-3xl font-bold text-white">
                                                    {getInitials(dev.name)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Online/Status Indicator (Decorative) */}
                                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 z-20" />
                                </div>

                                {/* Info */}
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                    {dev.name}
                                </h3>
                                <p className="text-xs font-mono text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-4 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                    {dev.role}
                                </p>

                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {dev.description}
                                </p>
                                <div className="mt-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center hover:bg-amber-600 hover:text-white cursor-pointer transition-all">
                                        <FaReact className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
