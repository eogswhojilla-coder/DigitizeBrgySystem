export default function ContactSection() {
    const contactData = {
        address:
            "Don Juan Road, San Carlos City, Negros Occidental 6127, Philippines",
        phone1: "+63 (02) 8123-4567",
        phone2: "+63 917 123 4567",
        email: "brgy.two@email.gov.ph",
        officeHours: [
            "Monday – Friday: 8:00 AM – 5:00 PM",
            "Saturday: 8:00 AM – 12:00 PM",
            "Sunday & Holidays: Closed",
        ],
        mapLink:
            "https://www.google.com/maps/search/?api=1&query=Barangay+San+Isidro+Quezon+City",
    };

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-slate-950 text-slate-200"
        >
            {/* Background Decor */}
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-yellow-500/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-10">
                {/* Section Header */}
                <div className="max-w-3xl mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold tracking-widest uppercase mb-4 border border-yellow-500/20">
                        Reach Out
                    </span>
                    <h2
                        id="contact-heading"
                        className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
                    >
                        Contact the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                            Barangay Hall
                        </span>
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                        Have questions or need assistance? Visit us at the
                        barangay hall or reach out through any of the channels
                        below. We're here to serve you.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-start">
                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        {/* Address */}
                        <div className="group p-5 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-yellow-500/30 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-all duration-300">
                                    📍
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-yellow-500 mb-2 uppercase">
                                        Address
                                    </div>
                                    <address className="text-slate-300 text-sm not-italic leading-relaxed">
                                        {contactData.address}
                                    </address>
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="group p-5 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-yellow-500/30 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-all duration-300">
                                    📞
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-yellow-500 mb-2 uppercase">
                                        Phone
                                    </div>
                                    <div className="text-slate-300 text-sm space-y-1">
                                        <a
                                            href="tel:+630281234567"
                                            className="hover:text-yellow-400 block transition-colors"
                                        >
                                            {contactData.phone1}
                                        </a>
                                        <a
                                            href="tel:+639171234567"
                                            className="hover:text-yellow-400 block transition-colors"
                                        >
                                            {contactData.phone2}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="group p-5 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-yellow-500/30 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-all duration-300">
                                    ✉️
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-yellow-500 mb-2 uppercase">
                                        Email
                                    </div>
                                    <a
                                        href={`mailto:${contactData.email}`}
                                        className="text-slate-300 text-sm hover:text-yellow-400 transition-colors"
                                    >
                                        {contactData.email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Office Hours */}
                        <div className="group p-5 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-yellow-500/30 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-all duration-300">
                                    🕐
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-yellow-500 mb-2 uppercase">
                                        Office Hours
                                    </div>
                                    <div className="text-slate-300 text-sm space-y-1">
                                        {contactData.officeHours.map(
                                            (hour, i) => (
                                                <div key={i}>{hour}</div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Card */}
                    <div className="relative group h-full min-h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-sm">
                        {/* Map Placeholder with Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                            {/* Decorative Map Grid Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                            </div>
                            
                            {/* Center Location Marker */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 animate-ping absolute inset-0" />
                                    <div className="w-16 h-16 rounded-full bg-yellow-500/30 flex items-center justify-center border-2 border-yellow-500 relative z-10">
                                        <span className="text-2xl">📍</span>
                                    </div>
                                </div>
                                <div className="mt-4 px-4 py-2 bg-slate-900/90 backdrop-blur rounded-lg border border-white/10 text-center">
                                    <div className="text-sm font-bold text-white">
                                        Barangay Hall
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        San Carlos City
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Action Button */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <a
                                href={contactData.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/25"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                Open in Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}