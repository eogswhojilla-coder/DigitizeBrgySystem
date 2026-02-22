export default function AboutSection() {
  return (
    <section id="about" className="min-h-screen bg-white/5 border-y border-white/10 py-24 flex items-center">
      <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-2 gap-20 items-center w-full">
        <div>
          <div className="section-label">About Us</div>
          <h2 className="section-title">
            Serving the Community<br />
            <span className="text-yellow-600">Since 1965</span>
          </h2>
          <div className="divider" />
          <p className="text-gray-300 leading-relaxed text-base mb-8">
            Barangay San Isidro has been at the heart of our local community, delivering responsive and compassionate governance. Our barangay management system modernizes access to public services, ensuring every resident can engage with their local government efficiently, transparently, and from anywhere.
          </p>
          <div className="flex flex-col gap-4">
            {[
              { label: "Barangay Captain", value: "Hon. Eduardo T. Reyes" },
              { label: "Contact Number", value: "+63 (02) 8123-4567" },
              { label: "Email Address", value: "brgy.sanisidro@email.gov.ph" },
              { label: "Office Hours", value: "Mon–Fri, 8:00 AM – 5:00 PM" },
              { label: "Address", value: "123 Rizal St., Brgy. San Isidro, Quezon City" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4 items-start">
                <span className="font-mono text-[11px] tracking-wider text-yellow-600 min-w-[140px] pt-0.5">{label.toUpperCase()}</span>
                <span className="text-white/85 text-[15px]">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-gradient-to-br from-slate-800 to-emerald-900/50 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-8xl mb-6">🏛️</div>
            <h3 className="font-serif text-3xl font-bold mb-2">Barangay San Isidro</h3>
            <p className="text-slate-400 text-xs tracking-widest font-mono">QUEZON CITY, NCR</p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-600 to-green-500 mx-auto my-6" />
            <p className="text-white/60 text-sm leading-relaxed">
              "A community united in progress, rooted in integrity, and committed to uplifting every resident's quality of life."
            </p>
            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="font-mono text-[11px] text-green-500 tracking-widest">POPULATION</div>
              <div className="font-serif text-4xl font-black text-yellow-500">12,847</div>
              <div className="text-sm text-slate-400">Registered Residents</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
