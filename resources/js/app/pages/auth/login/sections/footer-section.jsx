export default function FooterSection() {
    return (
        <footer className="bg-[#0f1a2e] border-t border-white/10 pt-16 pb-8 px-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-16 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-700 to-green-600 flex items-center justify-center text-2xl">
                                🏛️
                            </div>
                            <div>
                                <div className="font-serif font-bold text-base text-white">
                                    Barangay San Isidro
                                </div>
                                <div className="font-mono text-[10px] tracking-wider text-white/40">
                                    QUEZON CITY
                                </div>
                            </div>
                        </div>
                        <p className="text-white/45 text-sm leading-relaxed max-w-xs">
                            The official digital management system of
                            Barangay San Isidro. Committed to transparent,
                            accessible, and modern public service delivery.
                        </p>
                    </div>
                    <div>
                        <div className="font-mono text-[11px] tracking-widest text-yellow-700 mb-5">
                            QUICK LINKS
                        </div>
                        {[
                            "Login Portal",
                            "Register",
                            "Track Request",
                            "File Blotter",
                            "Announcements",
                            "Contact",
                        ].map((l) => (
                            <div
                                key={l}
                                className="text-white/50 text-sm mb-2.5 cursor-pointer transition-colors hover:text-green-600"
                            >
                                {l}
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="font-mono text-[11px] tracking-widest text-yellow-700 mb-5">
                            LEGAL
                        </div>
                        {[
                            "Privacy Policy",
                            "Terms & Conditions",
                            "Data Protection Policy",
                            "Accessibility Statement",
                        ].map((l) => (
                            <div
                                key={l}
                                className="text-white/50 text-sm mb-2.5 cursor-pointer transition-colors hover:text-green-600"
                            >
                                {l}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/10 pt-7 flex flex-wrap justify-between items-center gap-4">
                    <div className="text-white/30 text-xs">
                        © 2026 Barangay San Isidro Management System. All
                        rights reserved.
                    </div>
                    <div className="flex gap-6 items-center">
                        <span className="font-mono text-[11px] text-white/25 tracking-wider">
                            v2.1.0
                        </span>
                        <span className="text-white/30 text-xs">
                            Developed by{" "}
                            <span className="text-yellow-700">
                                BarangayTech Solutions
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
