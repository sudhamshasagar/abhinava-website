import { ArrowUpRight } from 'lucide-react'

const navigation = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Mission', href: '#mission' },
  { label: 'Impact', href: '#impact' },
  { label: 'Testimonials', href: '#testimonials' },
]

const participate = [
  { label: 'Contribution', href: '#contribution' },
  { label: 'Japa Contribution', href: '#japa' },
  { label: 'Start a Project', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* Main footer */}
        <div className="grid gap-16 border-b border-ivory/10 py-20 lg:grid-cols-[1.4fr_0.6fr_0.6fr] lg:py-24">

          {/* Brand */}
          <div>
            <a
              href="/"
              className="font-display text-3xl font-semibold tracking-[0.18em]"
            >
              ABHINAVA
            </a>

            <p className="mt-6 max-w-md font-display text-2xl leading-relaxed text-ivory/75 sm:text-3xl">
              Technology with a purpose.
            </p>

            <p className="mt-6 max-w-md text-sm leading-7 text-ivory/45">
              We build software, websites and digital solutions for businesses,
              while creating opportunities to support healthcare for people in
              need.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-light">
              Explore
            </p>

            <nav className="mt-6 flex flex-col gap-4">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="w-fit text-sm text-ivory/55 transition-colors duration-300 hover:text-ivory"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Participate */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-light">
              Be part of it
            </p>

            <nav className="mt-6 flex flex-col gap-4">
              {participate.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex w-fit items-center gap-2 text-sm text-ivory/55 transition-colors duration-300 hover:text-ivory"
                >
                  {item.label}

                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.3}
                    className="opacity-50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              ))}
            </nav>
          </div>

        </div>

        {/* Prayer / philosophy */}
        <div className="py-16 text-center sm:py-20">

          <p className="font-display text-2xl italic text-ivory/70 sm:text-3xl">
            May the work in our hands become a means of service.
          </p>

          <p className="mt-5 text-xs tracking-[0.25em] text-gold-light">
            LOKĀḤ SAMASTĀḤ SUKHINO BHAVANTU
          </p>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 border-t border-ivory/10 py-7 text-xs text-ivory/35 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} Abhinava. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="transition-colors hover:text-ivory/70"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition-colors hover:text-ivory/70"
            >
              Terms
            </a>
          </div>

          <p>
            English · ಕನ್ನಡ · हिन्दी
          </p>

        </div>

      </div>
    </footer>
  )
}