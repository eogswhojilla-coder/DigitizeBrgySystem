import React, { useState } from "react";

export default function AnnouncementsSection({ announcements = [] }) {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);

    // Fallback announcements if backend data is empty
    const fallbackAnnouncements = [
        {
            id: 1,
            title: "Community Clean-Up Drive — February 2026",
            date: "February 15, 2026",
            description:
                "All residents are encouraged to participate in the monthly clean-up drive scheduled this Saturday, 6:00 AM at the covered court area. Bring gloves and wear comfortable attire.",
            image: null,
        },
        {
            id: 2,
            title: "Free Medical Mission — Brgy. San Isidro",
            date: "February 10, 2026",
            description:
                "In partnership with the City Health Office, a free medical and dental mission will be held at the Barangay Hall. Registration begins at 7:00 AM on a first-come, first-served basis.",
            image: null,
        },
        {
            id: 3,
            title: "Barangay Assembly Meeting Notice",
            date: "February 5, 2026",
            description:
                "The quarterly barangay assembly is set for February 28, 2026. All registered residents are enjoined to attend and participate in community planning and budget review discussions.",
            image: null,
        },
    ];

    // Function to strip HTML tags and get plain text
    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    // Use backend announcements if available, otherwise use fallback
    const displayAnnouncements =
        announcements.length > 0 ? announcements : fallbackAnnouncements;

    // Limit announcements to 6 initially
    const visibleAnnouncements = showAllAnnouncements
        ? displayAnnouncements
        : displayAnnouncements.slice(0, 6);

    const openModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedAnnouncement(null), 300);
    };

    return (
        <section
            id="announcements"
            className="relative min-h-screen flex items-center overflow-hidden
                    bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50
                    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
                    text-slate-900 dark:text-slate-100"
            style={{
                backgroundImage: "url('/images/converted_image.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70" />

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-green-500/10 dark:bg-green-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[100px] -z-10" />

            <div className="px-6 md:px-12 lg:px-16 xl:px-20">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-sm mb-6
              bg-transparent border-l-2 border-green-600 dark:border-green-500"
                    >
                        <span className="text-[10px] font-black tracking-[0.2em] text-green-800 dark:text-green-400 uppercase">
                            Latest Updates
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 drop-shadow-sm">
                        Community <br />
                        <span className="text-green-700 dark:text-green-400">
                            Announcements
                        </span>
                    </h2>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed drop-shadow-sm">
                        Stay informed with the latest news, events, and updates
                        from your barangay administration.
                    </p>
                </div>

                {/* Announcements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleAnnouncements.map((a, index) => (
                        <div
                            key={a.id}
                            className="group relative rounded-2xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-300 dark:border-slate-700/50 hover:border-green-500/50 dark:hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent blur-xl" />
                            </div>

                            {/* Image Section (if available) */}
                            {a.image && (
                                <div className="relative h-48 -mx-6 -mt-6 overflow-hidden">
                                    <img
                                        src={a.image}
                                        alt={a.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                                </div>
                            )}

                            {/* Card Content */}
                            <div className="relative z-10 p-6">
                                {/* Date Badge */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="font-mono text-xs tracking-widest text-green-400 uppercase">
                                        {a.date}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors">
                                    {a.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors line-clamp-3">
                                    {stripHtml(a.description)}
                                </p>

                                {/* Action Button */}
                                <button
                                    onClick={() => openModal(a)}
                                    className="group/btn flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
                                >
                                    <span>Read Full Announcement</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="group-hover/btn:translate-x-1 transition-transform"
                                    >
                                        <path d="M5 12h14" />
                                        <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Card Border Gradient */}
                            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                {displayAnnouncements.length > 6 && (
                    <div className="mt-16 text-center">
                        <button
                            onClick={() =>
                                setShowAllAnnouncements(!showAllAnnouncements)
                            }
                            className="group relative px-8 py-4 rounded-xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-300 dark:border-slate-700/50 text-slate-700 dark:text-white font-medium hover:bg-white/80 dark:hover:bg-slate-800/60 hover:border-green-500/50 dark:hover:border-green-500/50 transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {showAllAnnouncements
                                    ? "Show Less"
                                    : "View All Announcements"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`transition-transform ${showAllAnnouncements ? "rotate-180" : "group-hover:translate-x-1"}`}
                                >
                                    {showAllAnnouncements ? (
                                        <>
                                            <path d="m18 15-6-6-6 6" />
                                        </>
                                    ) : (
                                        <>
                                            <path d="M5 12h14" />
                                            <path d="m12 5 7 7-7 7" />
                                        </>
                                    )}
                                </svg>
                            </span>
                            {/* Button Glow */}
                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent blur-lg" />
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Announcement Modal */}
            {isModalOpen && selectedAnnouncement && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>

                        {/* Modal Image */}
                        {selectedAnnouncement.image && (
                            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                                <img
                                    src={selectedAnnouncement.image}
                                    alt={selectedAnnouncement.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                            </div>
                        )}

                        {/* Modal Content */}
                        <div className="p-6 md:p-8">
                            {/* Date Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="font-mono text-xs tracking-widest text-green-400 uppercase">
                                    {selectedAnnouncement.date}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                                {selectedAnnouncement.title}
                            </h2>

                            {/* Full Description */}
                            <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                                {selectedAnnouncement.description.includes(
                                    "<",
                                ) ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: selectedAnnouncement.description,
                                        }}
                                        className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-green-600 dark:prose-a:text-green-400 prose-strong:text-slate-900 dark:prose-strong:text-white"
                                    />
                                ) : (
                                    <p className="text-base md:text-lg">
                                        {selectedAnnouncement.description}
                                    </p>
                                )}
                            </div>

                            {/* Close Button at Bottom */}
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 font-medium border border-green-500/20 hover:border-green-500/30 transition-all duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
