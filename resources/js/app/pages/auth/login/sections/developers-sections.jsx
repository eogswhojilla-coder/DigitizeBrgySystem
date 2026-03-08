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
            className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-gray-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200"
        >
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-0 dark:opacity-20 -z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold tracking-widest uppercase mb-4 border border-yellow-500/20">
                        The Crew
                    </span>
                    <h2
                        id="developers-heading"
                        className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
                    >
                        Meet the{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                            Developers
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
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
                            className="group relative p-1 rounded-2xl bg-gradient-to-b from-slate-200 dark:from-white/10 to-slate-100 dark:to-white/0 hover:from-yellow-500/50 transition-all duration-500"
                        >
                            {/* Card Content */}
                            <div className="relative h-full bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-xl p-8 flex flex-col items-center text-center border border-slate-200 dark:border-white/5 transition-colors duration-300 hover:bg-slate-50 dark:hover:bg-slate-900/100">
                                {/* Glow Effect behind image */}
                                <div className="absolute top-12 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl group-hover:bg-yellow-500/40 transition-all duration-500" />

                                {/* Image Container */}
                                <div className="relative mb-6 mt-2">
                                    <div className="w-32 h-32 rounded-full p-1 bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 group-hover:ring-yellow-500/50 transition-all duration-500 overflow-hidden relative z-10">
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
                                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 z-20" />
                                </div>

                                {/* Info */}
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
                                    {dev.name}
                                </h3>
                                <p className="text-xs font-mono text-yellow-500 uppercase tracking-widest mb-4 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                                    {dev.role}
                                </p>

                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {dev.description}
                                </p>
                                <div className="mt-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow-500 hover:text-black cursor-pointer transition-all">
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
