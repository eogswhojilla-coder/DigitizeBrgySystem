const services = [
  { icon: "📋", title: "Request Certificate", desc: "Barangay clearance, residency, indigency, and more — issued digitally with verification.", bgColor: "bg-blue-900/20", borderColor: "border-blue-900/30" },
  { icon: "📢", title: "Announcements", desc: "Stay informed with real-time community bulletins, advisories, and event notices.", bgColor: "bg-green-900/20", borderColor: "border-green-900/30" },
  { icon: "⚖️", title: "File Blotter / Complaint", desc: "Report incidents, disputes, or violations securely through our official blotter system.", bgColor: "bg-purple-900/20", borderColor: "border-purple-900/30" },
  { icon: "🏠", title: "Resident Portal", desc: "Manage your resident profile, view transaction history, and track all requests.", bgColor: "bg-red-900/20", borderColor: "border-red-900/30" },
  { icon: "📅", title: "Schedule Appointment", desc: "Book a slot for barangay consultations, clearance pickup, or official meetings.", bgColor: "bg-orange-900/20", borderColor: "border-orange-900/30" },
  { icon: "📦", title: "Inventory Request", desc: "Request community supplies, relief goods, or barangay equipment through the system.", bgColor: "bg-teal-900/20", borderColor: "border-teal-900/30" },
];

export default function ServicesSection() {
  return (
    <section id="services" className="min-h-screen py-24 px-10 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
      <div className="section-label">Quick Services</div>
      <h2 className="section-title">
        What Can We Help<br />
        <span className="text-green-600">You With?</span>
      </h2>
      <div className="divider" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (   
          <div key={i} className="service-card">
            <div className={`w-14 h-14 rounded-xl ${s.bgColor} ${s.borderColor} border flex items-center justify-center text-3xl mb-5`}>
              {s.icon}
            </div>
            <h3 className="font-serif text-xl font-bold mb-2.5">{s.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{s.desc}</p>
            <button className="bg-transparent border border-green-600 text-green-600 px-6 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-250 hover:bg-green-600 hover:text-white font-serif">
              Proceed →
            </button>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
