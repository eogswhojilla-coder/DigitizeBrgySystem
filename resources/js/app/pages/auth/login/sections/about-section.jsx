import { useState } from "react";

export default function AboutSection() {
    const [imgError, setImgError] = useState(false);
    const barangayData = {
        captain: "Hon. Francis R. Eusebio",
        contact: "729-8353",
        email: "barangay_two@yahoo.com",
        officeHours: "Mon–Fri, 8:00 AM – 5:00 PM",
        address:
            "Don Juan Subd., Pres. Quirino St., Brgy. II, Barangay Hall, San Carlos City, Negros Occidental, Philippines",
        population: "7016",
    };

    return (
        <section
            id="about"
            aria-labelledby="about-heading"
            className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-yellow-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20 -z-10" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400/15 dark:bg-amber-500/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/15 dark:bg-blue-500/5 rounded-full blur-[80px] -z-10" />

            <div className="px-6 md:px-12 lg:px-16 xl:px-20 grid md:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
                {/* Left Content */}
                <div className="space-y-8">
                    {/* Header */}
                    <div>
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-sm mb-6
                            bg-transparent border-l-2 border-amber-600 dark:border-amber-500">
                            <span className="text-[10px] font-black tracking-[0.2em] text-amber-700 dark:text-amber-500 uppercase">
                                About Us
                            </span>
                        </div>
                        <h2
                            id="about-heading"
                            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
                        >
                            Serving the{" "}
                            <span className="text-amber-600 dark:text-amber-500">
                                Community
                            </span>
                            <br />
                            Since 1965
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-500 dark:to-amber-400 rounded-full" />
                    </div>

                    {/* Description */}
                    <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                        Barangay 2 has been at the heart of our local community,
                        delivering responsive and compassionate governance. Our
                        barangay management system modernizes access to public
                        services, ensuring every resident can engage with their
                        local government efficiently, transparently, and from
                        anywhere.
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                        {[
                            {
                                label: "Barangay Captain",
                                value: barangayData.captain,
                            },
                            {
                                label: "Contact Number",
                                value: barangayData.contact,
                            },
                            {
                                label: "Email Address",
                                value: barangayData.email,
                            },
                            {
                                label: "Office Hours",
                                value: barangayData.officeHours,
                            },
                            {
                                label: "Address",
                                value: barangayData.address,
                                span: "sm:col-span-2",
                            },
                        ].map(({ label, value, span = "" }) => (
                            <div
                                key={label}
                                className={`p-4 rounded-lg bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-300 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/60 hover:border-slate-400 dark:hover:border-slate-600/50 transition-all duration-200 ${span}`}
                            >
                                <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-amber-600 dark:text-amber-500 mb-1.5">
                                    {label}
                                </div>
                                <div className="text-sm text-slate-700 dark:text-slate-300 break-words font-medium">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Content - Info Card */}
                <div className="relative">
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-blue-400/20 dark:from-amber-500/10 dark:to-blue-500/10 rounded-3xl blur-2xl -z-10" />

                    <div className="relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-slate-300 dark:border-slate-700/50 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                        {/* Logo Section */}
                        <div className="text-center mb-8">
                            {!imgError && (
                                <div className="relative inline-block mb-6">
                                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-500/20 dark:to-amber-600/20 border-2 border-amber-400 dark:border-amber-500/30 flex items-center justify-center p-4 shadow-lg">
                                        <img
                                            src="/images/brgy-ll-logo.png"
                                            alt="Official logo of Barangay II"
                                            className="w-full h-full object-contain"
                                            onError={() => setImgError(true)}
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-white"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
                                Barangay II
                            </h3>
                            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em]">
                                San Carlos City, Negros Occidental
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 dark:via-amber-500/30 to-transparent mb-8" />

                        {/* Mission Statement */}
                        <div className="text-center mb-8">
                            <div className="text-4xl mb-4 text-amber-500/30">"</div>
                            <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                A community united in progress, rooted in
                                integrity, and committed to uplifting every
                                resident's quality of life.
                            </p>
                            <div className="text-4xl mt-4 text-amber-500/30">
                                "
                            </div>
                        </div>

                        {/* Population Stats */}
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-500/10 dark:to-amber-600/10 border-2 border-amber-300 dark:border-amber-500/30 p-6 text-center shadow-lg">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-500 dark:to-amber-400" />
                            <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-amber-700 dark:text-amber-500 mb-2">
                                Population
                            </div>
                            <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-1 tabular-nums">
                                {barangayData.population}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                Registered Residents
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
