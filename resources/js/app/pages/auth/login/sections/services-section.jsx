const services = [
  {
    icon: "📋",
    title: "Request Certificate",
    desc: "Barangay clearance, residency, indigency, and more — issued digitally with verification.",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    hoverColor: "hover:bg-blue-500/20",
    iconBg: "bg-blue-500/20",
  },
  {
    icon: "📢",
    title: "Announcements",
    desc: "Stay informed with real-time community bulletins, advisories, and event notices.",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    hoverColor: "hover:bg-green-500/20",
    iconBg: "bg-green-500/20",
  },
  {
    icon: "⚖️",
    title: "File Blotter / Complaint",
    desc: "Report incidents, disputes, or violations securely through our official blotter system.",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    hoverColor: "hover:bg-purple-500/20",
    iconBg: "bg-purple-500/20",
  },
  {
    icon: "🏠",
    title: "Resident Portal",
    desc: "Manage your resident profile, view transaction history, and track all requests.",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    hoverColor: "hover:bg-red-500/20",
    iconBg: "bg-red-500/20",
  },
  {
    icon: "📅",
    title: "Schedule Appointment",
    desc: "Book a slot for barangay consultations, clearance pickup, or official meetings.",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    hoverColor: "hover:bg-orange-500/20",
    iconBg: "bg-orange-500/20",
  },
  {
    icon: "📦",
    title: "Inventory Request",
    desc: "Request community supplies, relief goods, or barangay equipment through the system.",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
    hoverColor: "hover:bg-teal-500/20",
    iconBg: "bg-teal-500/20",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-slate-950 text-slate-200"
    >
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold tracking-widest uppercase mb-4 border border-yellow-500/20">
            Quick Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            What Can We Help <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
              You With?
            </span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Access a wide range of barangay services digitally. From requesting
            certificates to filing complaints, we've got you covered.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, index) => (
            <div
              key={index}
              className={`group relative p-6 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 ${s.hoverColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20`}
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-${s.iconBg.replace('bg-', '')}/10 to-transparent blur-xl`} />
              </div>

              {/* Card Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="relative mb-5">
                  <div
                    className={`w-14 h-14 rounded-xl ${s.iconBg} flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {s.icon}
                  </div>
                  {/* Decorative dot */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
                  {s.desc}
                </p>

                {/* Action Button */}
                <button className="group/btn flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-yellow-400 transition-colors">
                  <span>Proceed</span>
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

              {/* Card Border Gradient (subtle) */}
              <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-4">
            Can't find what you're looking for?
          </p>
          <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-yellow-500/30 transition-all duration-300">
            View All Services →
          </button>
        </div>
      </div>
    </section>
  );
}