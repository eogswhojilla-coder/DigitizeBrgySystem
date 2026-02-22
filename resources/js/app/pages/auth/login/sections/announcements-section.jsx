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
    <section id="announcements" className="min-h-screen py-24 px-10 flex items-center bg-blue-900/10 border-y border-blue-900/20">
      <div className="max-w-7xl mx-auto w-full">
      <div className="section-label">Latest Updates</div>
      <h2 className="section-title">
        Community<br />
        <span className="text-green-600">Announcements</span>
      </h2>
      <div className="divider" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayAnnouncements.map((a) => (
          <div key={a.id} className="announce-card">
            {a.image && (
              <div className="mb-4 -mx-7 -mt-7 rounded-t-xl overflow-hidden">
                <img 
                  src={a.image} 
                  alt={a.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="font-mono text-[11px] text-yellow-600 tracking-widest mb-3">
              {a.date.toUpperCase()}
            </div>
            <h3 className="font-serif text-xl font-bold mb-3.5 leading-tight">{a.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
              {stripHtml(a.description)}
            </p>
            <button className="bg-transparent border-none text-green-600 font-semibold text-sm cursor-pointer p-0 font-serif hover:underline">
              Read Full Announcement →
            </button>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <button className="btn-outline">View All Announcements</button>
      </div>
      </div>
    </section>
  );
}
