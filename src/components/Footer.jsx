import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">

        {/* ==========================================
            BRAND + NAVIGATION (Compact & Organized)
        ========================================== */}
        <div className="grid gap-8 border-b border-ivory/10 pb-8 lg:grid-cols-12 lg:items-center">

          {/* Brand & Essential Contact (Span 7) */}
          <div className="lg:col-span-7">
            <a
              href="/"
              className="font-display text-lg font-semibold tracking-[0.18em]"
            >
              ABHINAVA SOFTWARES
            </a>

            <p className="mt-3 text-xs leading-relaxed text-ivory/65 sm:text-sm text-justify hyphens-auto [text-wrap:pretty]">
              Every business begins with a purpose. We believe technology should help that purpose grow — not simply make things faster, but make meaningful work possible.
            </p>

            <p className="mt-2 text-xs leading-relaxed text-ivory/65 sm:text-sm text-justify hyphens-auto [text-wrap:pretty]">
              At Abhinava, we build websites, software and business systems with care, while dedicating a part of what our work creates towards healthcare for people who need it.
            </p>

            {/* Tight Contact Row */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ivory/60">
              <a
                href="tel:6362770214"
                className="flex items-center gap-2 transition-colors hover:text-ivory"
              >
                <Phone size={12} strokeWidth={1.5} className="text-gold-light" />
                <span>6362770214</span>
              </a>

              <a
                href="mailto:sudhamsha@abhinava.site"
                className="flex items-center gap-2 transition-colors hover:text-ivory"
              >
                <Mail size={12} strokeWidth={1.5} className="text-gold-light" />
                <span>sudhamsha@abhinava.site</span>
              </a>

              <div className="flex items-center gap-2 text-ivory/50">
                <MapPin size={12} strokeWidth={1.5} className="text-gold-light" />
                <span>Sagar, Karnataka</span>
              </div>

              <a
                href="mailto:abhinavasoftwares@gmail.com"
                className="text-ivory/45 underline underline-offset-2 transition-colors hover:text-ivory/80"
              >
                abhinavasoftwares@gmail.com
              </a>
            </div>
          </div>

          {/* Navigation Links (Span 5) - Organized with justify-end on desktop */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:col-span-5 lg:flex lg:justify-end lg:gap-12">

            {/* Explore */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-light">
                Explore
              </p>
              <nav className="mt-3 flex flex-col gap-2 text-xs text-ivory/55">
                <a href="#work" className="transition-colors hover:text-ivory">Our Work</a>
                <a href="#services" className="transition-colors hover:text-ivory">Services</a>
                <a href="#mission" className="transition-colors hover:text-ivory">Our Mission</a>
                <a href="#impact" className="transition-colors hover:text-ivory">Our Impact</a>
                <a href="#testimonials" className="transition-colors hover:text-ivory">What People Say</a>
              </nav>
            </div>

            {/* Participate */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-light">
                Be a part
              </p>
              <nav className="mt-3 flex flex-col gap-2 text-xs text-ivory/55">
                <a href="#contribution" className="group flex items-center gap-1 transition-colors hover:text-ivory">
                  Support Healthcare
                  <ArrowUpRight size={11} strokeWidth={1.3} className="opacity-40 transition-opacity group-hover:opacity-100" />
                </a>
                <a href="#japa" className="group flex items-center gap-1 transition-colors hover:text-ivory">
                  Japa Contribution
                  <ArrowUpRight size={11} strokeWidth={1.3} className="opacity-40 transition-opacity group-hover:opacity-100" />
                </a>
                <a href="#contact" className="group flex items-center gap-1 transition-colors hover:text-ivory">
                  Start a Project
                  <ArrowUpRight size={11} strokeWidth={1.3} className="opacity-40 transition-opacity group-hover:opacity-100" />
                </a>
              </nav>
            </div>

          </div>

        </div>

        {/* ==========================================
            CLOSING THOUGHT
        ========================================== */}
        <div className="border-b border-ivory/10 py-6 text-center">
          <p className="mx-auto max-w-xl font-serif text-sm italic leading-relaxed text-ivory/80 sm:text-base [text-wrap:balance]">
            “May whatever we build become useful to someone, and may that usefulness become a form of seva.”
          </p>

          <div className="mt-2 flex flex-col items-center gap-0.5">
            <span className="font-serif text-xs tracking-widest text-gold-light">
              लोकाः समस्ताः सुखिनो भवन्तु
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/35">
              LOKĀḤ SAMASTĀḤ SUKHINO BHAVANTU
            </span>
          </div>
        </div>

        {/* ==========================================
            FINAL BAR
        ========================================== */}
        <div className="flex flex-col gap-3 pt-5 text-center text-[11px] text-ivory/35 lg:flex-row lg:items-center lg:justify-between lg:text-left">
          
          <div>
            <span>Vande Shri Guru Parampara</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 lg:items-end">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#" className="transition-colors hover:text-ivory/70">Privacy</a>
              <a href="#" className="transition-colors hover:text-ivory/70">Terms</a>
              <span className="text-ivory/20">·</span>
              <span>English · ಕನ್ನಡ · हिन्दी</span>
            </div>
            <p className="text-ivory/30">© {new Date().getFullYear()} Abhinava Softwares. All rights reserved.</p>
          </div>

        </div>

      </div>
    </footer>
  )
}