export default function ContactSection() {
    const contactData = {
        address:
            "Don Juan Subd., Pres. Quirino St., Brgy. II, Barangay Hall, San Carlos City, Negros Occidental, Philippines",
        phone1: "   729-8353 ",
        email: "barangay_two@yahoo.com",
        officeHours: [
            "Monday – Friday: 8:00 AM – 5:00 PM",
            "Saturday: 8:00 AM – 12:00 PM",
            "Sunday & Holidays: Closed",
        ],
        mapLink:
            "https://www.google.com/maps/search/?api=1&query=Don+Juan+Subd+Pres+Quirino+St+Brgy+II+Barangay+Hall+San+Carlos+City+Negros+Occidental+Philippines",
    };

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200"
            style={{
                backgroundImage: "url('/images/contact (2).png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70" />

            {/* Background Decor */}
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-yellow-500/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-0 dark:opacity-20 -z-10" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
                {/* Section Header */}
                <div className="max-w-3xl mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs font-bold tracking-widest uppercase mb-4 border border-yellow-500/20">
                        Reach Out
                    </span>
                    <h2
                        id="contact-heading"
                        className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 drop-shadow-sm"
                    >
                        Contact the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-700 dark:from-yellow-400 dark:to-amber-600">
                            Barangay Hall
                        </span>
                    </h2>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl drop-shadow-sm">
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
                        <div className="group p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-yellow-500/30 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-xl group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-all duration-300">
                                    📍
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-yellow-600 dark:text-yellow-500 mb-2 uppercase">
                                        Address
                                    </div>
                                    <address className="text-slate-600 dark:text-slate-300 text-sm not-italic leading-relaxed">
                                        {contactData.address}
                                    </address>
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="group p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-yellow-500/30 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-xl group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-all duration-300">
                                    📞
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-yellow-600 dark:text-yellow-500 mb-2 uppercase">
                                        Telephone
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-300 text-sm space-y-1">
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
                        <div className="group p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-yellow-500/30 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-xl group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-all duration-300">
                                    ✉️
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-yellow-600 dark:text-yellow-500 mb-2 uppercase">
                                        Email
                                    </div>
                                    <a
                                        href={`mailto:${contactData.email}`}
                                        className="text-slate-600 dark:text-slate-300 text-sm hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                                    >
                                        {contactData.email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Office Hours */}
                        <div className="group p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-yellow-500/30 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-xl group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-all duration-300">
                                    🕐
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-yellow-600 dark:text-yellow-500 mb-2 uppercase">
                                        Office Hours
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-300 text-sm space-y-1">
                                        {contactData.officeHours.map(
                                            (hour, i) => (
                                                <div key={i}>{hour}</div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Card */}
                    <div className="relative group h-full min-h-[400px] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/50">
                        {/* Embedded Google Map */}
                        <iframe
                            title="Barangay II Hall Location"
                            src="https://maps.google.com/maps?q=Don+Juan+Subd+Pres+Quirino+St+Brgy+II+Barangay+Hall+San+Carlos+City+Negros+Occidental+Philippines&t=&z=16&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, position: "absolute", inset: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                        {/* Floating Action Button */}
                        <div className="absolute bottom-6 left-6 right-6 z-10">
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

                {/* Emergency Contacts Section */}
                <div className="mt-16 pt-16 border-t border-slate-200 dark:border-white/10">
                    <div className="mb-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-red-500/10 text-red-600 dark:text-red-500 text-xs font-bold tracking-widest uppercase mb-4 border border-red-500/20">
                            Emergency
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 drop-shadow-sm">
                            Emergency Hotlines
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl drop-shadow-sm">
                            For urgent matters and emergencies, contact these
                            emergency response services available 24/7.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Emergency 911 */}
                        <div className="group p-6 rounded-2xl bg-white dark:bg-white/5 border border-red-200 dark:border-red-500/30 hover:border-red-400 dark:hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-xl group-hover:bg-red-500/20 transition-all duration-300">
                                    🚨
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-red-500 dark:text-red-400 mb-2 uppercase">
                                        Emergency
                                    </div>
                                    <div className="text-slate-900 dark:text-white font-bold text-lg mb-1">
                                        Emergency 911
                                    </div>
                                    <div className="text-slate-400 text-sm mb-2">
                                        National emergency hotline
                                    </div>
                                    <div className="text-red-400 font-bold text-lg">
                                        911
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="group p-6 rounded-2xl bg-white dark:bg-white/5 border border-orange-200 dark:border-orange-500/30 hover:border-orange-400 dark:hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-orange-200 dark:border-orange-500/30 flex items-center justify-center text-xl group-hover:bg-orange-500/20 transition-all duration-300">
                                    🚒
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-orange-500 dark:text-orange-400 mb-2 uppercase">
                                        Fire Emergency
                                    </div>
                                    <div className="text-slate-900 dark:text-white font-bold text-lg mb-1">
                                        BFP San Carlos
                                    </div>
                                    <div className="text-slate-400 text-sm mb-2">
                                        Bureau of Fire Protection
                                    </div>
                                    <div className="text-orange-400 font-bold text-lg">
                                        (034) 729-3331
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CDRRMO */}
                        <div className="group p-6 rounded-2xl bg-white dark:bg-white/5 border border-blue-200 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-xl group-hover:bg-blue-500/20 transition-all duration-300">
                                    ⚠️
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-blue-500 dark:text-blue-400 mb-2 uppercase">
                                        Disaster Response
                                    </div>
                                    <div className="text-slate-900 dark:text-white font-bold text-lg mb-1">
                                        CDRRMO
                                    </div>
                                    <div className="text-slate-400 text-sm mb-2">
                                        City Disaster Risk Reduction
                                    </div>
                                    <div className="text-blue-400 font-bold text-lg">
                                        +63 925-786-6243
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PNP */}
                        <div className="group p-6 rounded-2xl bg-white dark:bg-white/5 border border-green-200 dark:border-green-500/30 hover:border-green-400 dark:hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-green-200 dark:border-green-500/30 flex items-center justify-center text-xl group-hover:bg-green-500/20 transition-all duration-300">
                                    👮
                                </div>
                                <div>
                                    <div className="font-mono text-xs tracking-widest text-green-500 dark:text-green-400 mb-2 uppercase">
                                        Police Emergency
                                    </div>
                                    <div className="text-slate-900 dark:text-white font-bold text-lg mb-1">
                                        PNP San Carlos
                                    </div>
                                    <div className="text-slate-400 text-sm mb-2">
                                        Philippine National Police
                                    </div>
                                    <div className="text-green-400 font-bold text-lg">
                                        (034) 312-5166
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
