export default function AnnouncementsSection({ announcements = [] }) {
  // Fallback announcements if backend data is empty
  const fallbackAnnouncements = [
    { 
      id: 1,
      title: "Community Clean-Up Drive — February 2026", 
      date: "February 15, 2026", 
      description: "All residents are encouraged to participate in the monthly clean-up drive scheduled this Saturday, 6:00 AM at the covered court area. Bring gloves and wear comfortable attire.",
      image: null
    },
    { 
      id: 2,
      title: "Free Medical Mission — Brgy. San Isidro", 
      date: "February 10, 2026", 
      description: "In partnership with the City Health Office, a free medical and dental mission will be held at the Barangay Hall. Registration begins at 7:00 AM on a first-come, first-served basis.",
      image: null
    },
    { 
      id: 3,
      title: "Barangay Assembly Meeting Notice", 
      date: "February 5, 2026", 
      description: "The quarterly barangay assembly is set for February 28, 2026. All registered residents are enjoined to attend and participate in community planning and budget review discussions.",
      image: null
    },
  ];

  // Function to strip HTML tags and get plain text
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Use backend announcements if available, otherwise use fallback
  const displayAnnouncements = announcements.length > 0 ? announcements : fallbackAnnouncements;

  return (
    <section 
      id="announcements" 
      className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-slate-950 text-slate-200"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-green-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-green-500/10 text-green-400 text-xs font-bold tracking-widest uppercase mb-4 border border-green-500/20">
            Latest Updates
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Community <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Announcements
            </span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Stay informed with the latest news, events, and updates from your barangay administration.
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAnnouncements.map((a, index) => (
            <div
              key={a.id}
              className="group relative rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 overflow-hidden"
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
                      e.target.style.display = 'none';
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
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-green-400 transition-colors">
                  {a.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors line-clamp-3">
                  {stripHtml(a.description)}
                </p>

                {/* Action Button */}
                <button className="group/btn flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-green-400 transition-colors">
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
        <div className="mt-16 text-center">
          <button className="group relative px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              View All Announcements
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
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
            {/* Button Glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent blur-lg" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}