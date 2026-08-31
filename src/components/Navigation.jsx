import { useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Mission', href: '#mission' },
  { label: 'Impact', href: '#impact' },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-12">

        {/* Brand */}
        <a
          href="/"
          className="shrink-0 font-display text-xl font-semibold tracking-[0.14em] text-charcoal sm:text-2xl"
        >
          ABHINAVA SOFTWARES
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">

          {/* Navigation Pill */}
          <nav className="flex items-center rounded-full border border-charcoal/10 bg-white/40 p-1.5 backdrop-blur-sm">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-charcoal/55 transition-all duration-300 hover:bg-charcoal hover:text-ivory"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="#contact"
            className="group flex items-center gap-3 bg-charcoal px-5 py-3 text-sm font-medium text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-charcoal/90"
          >
            <span>Start a Project</span>

            <span className="flex h-6 w-6 items-center justify-center border border-ivory/20">
              <ArrowUpRight
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center border border-charcoal/10 text-charcoal md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? (
            <X size={21} strokeWidth={1.4} />
          ) : (
            <Menu size={21} strokeWidth={1.4} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="mx-6 border border-charcoal/10 bg-ivory/95 p-3 backdrop-blur-md sm:mx-8 md:hidden">
          <nav className="flex flex-col">

            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-charcoal/10 px-4 py-4 text-sm font-medium text-charcoal/65 transition-colors duration-300 last:border-b-0 hover:text-charcoal"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-3 bg-charcoal px-5 py-4 text-sm font-medium text-ivory"
            >
              <span>Start a Project</span>

              <span className="flex h-6 w-6 items-center justify-center border border-ivory/20">
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.4}
                />
              </span>
            </a>

          </nav>
        </div>
      )}
    </header>
  )
}