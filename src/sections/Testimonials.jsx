import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Loader2, X, ArrowRight, Building2, User } from 'lucide-react'
import { getPublishedTestimonials } from '../firebase/testimonials'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTestimonial, setActiveTestimonial] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const data = await getPublishedTestimonials()
        if (mounted) {
          setTestimonials(data || [])
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      mounted = false
    }
  }, [])

  // Lock body scroll when popup is active
  useEffect(() => {
    if (activeTestimonial) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setActiveTestimonial(null)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
    document.body.style.overflow = ''
  }, [activeTestimonial])

  if (loading) {
    return (
      <section id="testimonials" className="bg-[#f7f5f0] py-20 sm:py-28">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#9b7837]" />
          <p className="font-mono text-xs uppercase tracking-widest text-black/40">
            Gathering client voices...
          </p>
        </div>
      </section>
    )
  }

  if (!testimonials.length) {
    return null
  }

  return (
    <>
      <section id="testimonials" className="bg-[#f7f5f0] py-16 sm:py-24 lg:py-32 text-[#242321]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          
          {/* HEADER */}
          <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center sm:mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b7837]"
            >
              Client Voices
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl"
            >
              Trust is built <span className="font-serif italic text-black/60">through the work.</span>
            </motion.h2>
          </div>

          {/* COMPACT RESPONSIVE GRID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {testimonials.map((item, index) => {
              const isLong = item.quote && item.quote.length > 130

              return (
                <motion.article
                  key={item.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-5 shadow-2xs transition-all duration-300 hover:border-[#c6a15b]/60 hover:shadow-sm sm:p-6"
                >
                  <div>
                    {/* Top quote icon & index badge */}
                    <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                      <Quote size={20} strokeWidth={1.5} className="text-[#9b7837]" />
                      <span className="font-mono text-[9px] uppercase tracking-wider text-black/35">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Truncated Quote snippet */}
                    <blockquote className="mt-3.5 font-display text-sm leading-relaxed text-[#242321]/80 sm:text-[15px] line-clamp-3">
                      “{item.quote}”
                    </blockquote>

                    {/* Read More Trigger */}
                    {isLong ? (
                      <button
                        type="button"
                        onClick={() => setActiveTestimonial(item)}
                        className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#9b7837] hover:text-[#242321] transition-colors"
                      >
                        Read full review <ArrowRight size={10} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveTestimonial(item)}
                        className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] text-black/40 hover:text-black transition-colors"
                      >
                        Details <ArrowRight size={10} />
                      </button>
                    )}
                  </div>

                  {/* Author / Client Strip */}
                  <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#242321]">
                        {item.name}
                      </p>
                      <p className="truncate text-[10px] text-black/50">
                        {item.role || 'Client'}
                        {item.company ? ` • ${item.company}` : ''}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTestimonial(item)}
                      aria-label={`Open details for ${item.name}`}
                      className="rounded-full bg-[#f7f5f0] p-1.5 text-black/40 transition hover:bg-[#242321] hover:text-white"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.article>
              )
            })}
          </div>

          {/* FOOTER ACCENT */}
          <div className="mt-12 text-center sm:mt-16">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/35">
              Verified Client Endorsements
            </span>
          </div>

        </div>
      </section>

      {/* ADAPTIVE POPUP / BOTTOM SHEET */}
      <AnimatePresence>
        {activeTestimonial && (
          <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setActiveTestimonial(null)}
              className="fixed inset-0 bg-[#121110]/60 backdrop-blur-xs"
            />

            {/* Modal Box (Bottom Sheet on Mobile, Centered Card on Large) */}
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative z-10 flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-black/10 bg-[#f7f5f0] shadow-2xl lg:rounded-2xl lg:border-black/[0.08]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile grab handle indicator */}
              <div className="flex justify-center pt-2.5 pb-1 lg:hidden">
                <div className="h-1 w-10 rounded-full bg-black/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-black/[0.06] bg-white/70 px-5 py-3.5 sm:px-6">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c6a15b]" />
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#9b7837]">
                    Client Testimony
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTestimonial(null)}
                  className="rounded-full bg-black/[0.05] p-1.5 text-black/60 transition hover:bg-black hover:text-white"
                  aria-label="Close quote dialog"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                <div className="flex items-start gap-3">
                  
                  <blockquote className="font-display text-lg leading-relaxed text-[#242321] sm:text-xl sm:leading-loose">
                    “{activeTestimonial.quote}”
                  </blockquote>
                </div>

                {/* Profile Box */}
                <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-[#9b7837]" />
                        <h4 className="font-serif text-base font-semibold text-[#242321]">
                          {activeTestimonial.name}
                        </h4>
                      </div>
                      <p className="mt-0.5 text-xs text-black/55 pl-5">
                        {activeTestimonial.role || 'Client'}
                      </p>
                    </div>

                    {activeTestimonial.company && (
                      <div className="flex items-center gap-1.5 rounded-lg border border-black/[0.06] bg-[#f7f5f0] px-3 py-1.5 text-xs font-medium text-[#242321]/80">
                        <Building2 size={13} className="text-[#9b7837]" />
                        <span>{activeTestimonial.company}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom dismissal toolbar */}
              <div className="border-t border-black/[0.06] bg-white/60 px-5 py-3 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => setActiveTestimonial(null)}
                  className="rounded-lg bg-[#242321] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-black"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}