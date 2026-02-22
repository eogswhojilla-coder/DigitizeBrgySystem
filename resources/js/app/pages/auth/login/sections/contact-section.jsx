export default function ContactSection() {
  return (
    <section id="contact" className="min-h-screen py-24 px-10 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
      <div className="section-label">Get in Touch</div>
      <h2 className="section-title">
        Contact the<br />
        <span className="text-yellow-600">Barangay Hall</span>
      </h2>
      <div className="divider" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
        <div className="flex flex-col gap-7">
          {[
            { icon: "📍", label: "Address", value: "123 Rizal Street, Brgy. San Isidro, Quezon City, Metro Manila 1100" },
            { icon: "📞", label: "Phone", value: "+63 (02) 8123-4567\n+63 917 123 4567" },
            { icon: "✉️", label: "Email", value: "brgy.sanisidro@email.gov.ph" },
            { icon: "🕐", label: "Office Hours", value: "Monday – Friday: 8:00 AM – 5:00 PM\nSaturday: 8:00 AM – 12:00 PM\nSunday & Holidays: Closed" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
              <div>
                <div className="font-mono text-[11px] tracking-widest text-yellow-600 mb-1.5">{label.toUpperCase()}</div>
                <div className="text-white/75 text-sm leading-relaxed whitespace-pre-line">{value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/10 h-96 bg-white/5 flex items-center justify-center flex-col gap-3">
          <div className="text-5xl">🗺️</div>
          <div className="font-serif text-xl font-bold">Location Map</div>
          <div className="text-slate-400 text-sm">Barangay San Isidro, Quezon City</div>
          <button className="btn-outline mt-2 text-sm">Open in Google Maps ↗</button>
        </div>
      </div>
      </div>
    </section>
  );
}
