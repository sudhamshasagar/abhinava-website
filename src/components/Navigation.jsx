import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Mission', href: '#mission' },
  { label: 'Impact', href: '#impact' },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [open])

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 sm:px-8 lg:px-12">
        
        {/* Brand */}
        <a href="/" className="flex shrink-0 items-center">
          <img
            src={`${import.meta.env.BASE_URL}logonew2.png`}
            alt="Abhinava Softwares"
            className="h-10 w-auto object-contain sm:h-12"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">
          <nav className="flex items-center gap-8" aria-label="Main navigation">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-charcoal/60 transition-colors duration-300 hover:text-charcoal"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <a
            href="#contact"
            className="rounded bg-charcoal px-6 py-2.5 text-sm font-medium text-ivory transition-colors duration-300 hover:bg-charcoal/80"
          >
            Let's talk
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-charcoal md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={24} strokeWidth={1.2} /> : <Menu size={24} strokeWidth={1.2} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 top-[88px] z-40 bg-ivory px-6 py-8 sm:px-8 md:hidden">
          <nav className="flex flex-col gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-light text-charcoal"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-4 w-fit rounded bg-charcoal px-8 py-3 text-sm font-medium text-ivory"
            >
              Let's talk
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}