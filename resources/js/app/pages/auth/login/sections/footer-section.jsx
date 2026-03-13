export default function FooterSection() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: "Login Portal", href: "/login" },
        { name: "Register", href: "/register" },
        { name: "Track Request", href: "/track-request" },
        { name: "File Blotter", href: "/file-blotter" },
        { name: "Announcements", href: "/announcements" },
        { name: "Contact", href: "#contact" },
    ];

    const legalLinks = [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Data Protection Policy", href: "/data-protection" },
        { name: "Accessibility Statement", href: "/accessibility" },
    ];

    return (
        <footer className="bg-slate-100 dark:bg-[#0f1a2e] border-t border-slate-200 dark:border-white/10 pt-14 pb-8 px-6 md:px-10 text-slate-800 dark:text-white">
            <div className="max-w-7xl mx-auto">
                {/* TOP GRID */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 md:gap-16 mb-12">
                    {/* BRAND SECTION */}
                    <div>
                        <div className="flex items-center gap-4 mb-5">
                            <img
                                src="/images/brgy-ll-logo.png"
                                alt="Official logo of Barangay II"
                                className="w-14 h-14 object-cover"
                            />

                            <div>
                                <div className="font-serif font-bold text-lg">
                                    Barangay II
                                </div>
                                <div className="font-mono text-[10px] tracking-widest text-slate-400 dark:text-white/50">
                                    San Carlos City , Negros Occidental
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed max-w-sm">
                            The official digital management system of Barangay
                            II. Committed to transparent, accessible, and modern
                            public service delivery.
                        </p>
                    </div>

                    {/* QUICK LINKS */}
                    <nav aria-label="Quick Links">
                        <div className="font-mono text-xs tracking-widest text-yellow-600 mb-5">
                            QUICK LINKS
                        </div>

                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-slate-500 dark:text-white/60 text-sm transition-colors hover:text-yellow-500"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* LEGAL LINKS */}
                    <nav aria-label="Legal Links">
                        <div className="font-mono text-xs tracking-widest text-yellow-600 mb-5">
                            LEGAL
                        </div>

                        <ul className="space-y-2.5">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-slate-500 dark:text-white/60 text-sm transition-colors hover:text-yellow-500"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-slate-200 dark:border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-slate-400 dark:text-white/40 text-xs text-center md:text-left">
                        © {currentYear} Barangay II Management System. All
                        rights reserved.
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center md:text-right">
                        <span className="font-mono text-xs text-slate-400 dark:text-white/40 tracking-wider">
                            v2.1.0
                        </span>

                        <span className="text-slate-400 dark:text-white/40 text-xs">
                            Developed by{" "}
                            <span className="text-yellow-500 font-medium">
                                BSIT 4 - Group 1 Solutions
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
