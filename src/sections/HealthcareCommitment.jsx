import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Plus, Minus, Heart, Stethoscope, FileCheck2, Pill } from 'lucide-react'

const journeySteps = [
  {
    num: '01',
    icon: Stethoscope,
    title: 'Identify',
    desc: 'We coordinate with hospitals, diagnostic centres, and medical shops, including through formal MOUs, to locate genuine medical needs.',
  },
  {
    num: '02',
    icon: FileCheck2,
    title: 'Verify',
    desc: 'Every case is evaluated rigorously against actual medical records and verified urgency before any disbursement.',
  },
  {
    num: '03',
    icon: Pill,
    title: 'Support',
    desc: 'Funds go directly toward prescriptions, lab diagnostics, surgeries, or critical care requirements without administrative overhead.',
  },
]

export default function HealthcareCommitment() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <article id="healthcare" className="bg-sand relative overflow-hidden py-24 sm:py-32 lg:py-20">
      
      {/* Background Sacred Motif */}
      <div className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.025] select-none">
        <svg width="600" height="600" viewBox="0 0 200 200" fill="none" className="text-charcoal">
          <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100 5V195M5 100H195" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">

        {/* ==========================================
            CHAPTER HEADER (Editorial Manuscript Style)
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-charcoal/40">
            <Heart size={12} strokeWidth={1.5} />
            <span>Rooted in Seva & Devotion</span>
          </div>

          <h2 className="mt-4 font-display text-4xl font-normal tracking-tight text-charcoal sm:text-5xl lg:text-6xl [text-wrap:balance]">
            Where your project <span className="font-serif italic text-charcoal/70">finds its true purpose.</span>
          </h2>
        </motion.div>

        {/* ==========================================
            THE 70% MANIFESTO CARD (Centerpiece)
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-16 rounded-3xl border border-charcoal/15 bg-white/60 p-8 shadow-xl shadow-charcoal/[0.02] backdrop-blur-md sm:p-14"
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            
            <div className="flex items-baseline justify-center gap-1 lg:col-span-4 lg:justify-start">
              <span className="font-display text-[7rem] font-medium leading-none tracking-tighter text-charcoal sm:text-[8.5rem]">
                70
              </span>
              <span className="font-display text-4xl text-charcoal/30 sm:text-5xl">
                %
              </span>
            </div>

            <div className="space-y-4 lg:col-span-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal/40">
                Our Non-Negotiable Commitment
              </p>
              <h3 className="font-display text-2xl font-medium leading-snug text-charcoal sm:text-3xl [text-wrap:balance]">
                Of every project fee is committed entirely to <span className="font-serif italic text-charcoal/70">healthcare assistance.</span>
              </h3>
              <p className="text-xs leading-relaxed text-charcoal/65 sm:text-sm text-justify hyphens-auto [text-wrap:pretty]">
                This is not an optional campaign or a separate charity fund. It is the core financial architecture of Abhinava. When you build with us, your investment directly transforms into life-saving medicines, essential diagnostics, and critical surgeries for those without means.
              </p>
            </div>

          </div>
        </motion.div>

        {/* ==========================================
            THE JOURNEY OF ALLOCATION (Sequential Flow)
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-16"
        >
          <div className="text-center mb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal/40">
              The Journey of Every Allocation
            </p>
            <h4 className="mt-2 font-display text-xl font-medium text-charcoal">
              Simple, transparent, and direct.
            </h4>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {journeySteps.map((step) => {
              const Icon = step.icon
              return (
                <div 
                  key={step.num}
                  className="relative flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-white/40 p-6 sm:p-8 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs italic text-charcoal/40 tracking-widest">{step.num}</span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/5 text-charcoal/70">
                        <Icon size={16} strokeWidth={1.5} />
                      </div>
                    </div>
                    <h5 className="mt-6 font-display text-lg font-medium text-charcoal">{step.title}</h5>
                    <p className="mt-2 text-xs leading-relaxed text-charcoal/60 text-justify hyphens-auto [text-wrap:pretty]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* ==========================================
            WHAT IT SUPPORTS & ACCOUNTING (Split Panels)
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-16 grid gap-8 sm:grid-cols-2"
        >
          {/* Panel 1: Public Ledger */}
          <div className="rounded-3xl border border-charcoal/10 bg-white/40 p-8 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal/40">
                Absolute Transparency
              </p>
              <h4 className="mt-2 font-display text-xl font-medium text-charcoal">
                Nothing hidden. Everything accounted for.
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-charcoal/65 text-justify hyphens-auto [text-wrap:pretty]">
                Every project contribution and subsequent healthcare disbursement is recorded on our public ledger, complete with verification receipts while strictly protecting recipient privacy.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="#ledger"
                className="group inline-flex items-center gap-2 border-b border-charcoal/20 pb-1 text-xs font-medium text-charcoal transition-colors hover:border-charcoal"
              >
                View Public Ledger
                <ArrowUpRight size={14} strokeWidth={1.5} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* Panel 2: The 30% Operation */}
          <div className="rounded-3xl border border-charcoal/10 bg-white/40 p-8 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal/40">
                Sustaining Operations
              </p>
              <h4 className="mt-2 font-display text-xl font-medium text-charcoal">
                What about the remaining 30%?
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-charcoal/65 text-justify hyphens-auto [text-wrap:pretty]">
                The remaining 30% sustains Abhinava — funding our engineers, core infrastructure, research, and technical development. Third-party cloud and infrastructure costs are billed separately as agreed with clients.
              </p>
            </div>
            <div className="mt-8">
              <span className="text-xs font-serif italic text-charcoal/50">
                Clean economics. Purpose-driven work.
              </span>
            </div>
          </div>
        </motion.div>

        {/* ==========================================
            SHRIDHARA SWAMY INSPIRATION (Editorial Story Toggle)
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-16 rounded-3xl border border-charcoal/15 bg-white/60 p-8 backdrop-blur-md sm:p-10"
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex w-full items-center justify-between text-left"
            aria-expanded={isExpanded}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal/40">
                The Origin of Our Vow
              </p>
              <span className="mt-2 block font-serif text-xl font-medium italic text-charcoal transition-colors group-hover:text-charcoal/60 sm:text-2xl">
                Shridhara Swamy & The Vision of Free Healing
              </span>
            </div>

            <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-charcoal/15 bg-white transition-colors group-hover:bg-charcoal/5">
              {isExpanded ? (
                <Minus size={15} strokeWidth={1.5} className="text-charcoal/60" />
              ) : (
                <Plus size={15} strokeWidth={1.5} className="text-charcoal/60" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-8 border-t border-charcoal/10 pt-8">
                  <div className="border-l-2 border-charcoal/20 pl-6 space-y-4">
                    <p className="text-xs leading-relaxed text-charcoal/75 sm:text-sm text-justify hyphens-auto [text-wrap:pretty]">
                      Our mission is deeply inspired by <strong className="font-medium text-charcoal">Shridhara Swamy</strong>, a revered spiritual saint whose ultimate dream was to establish a sanctuary of healing — a hospital where Ayurvedic, Allopathic, Homeopathic, and all branches of medicine would be provided completely free of cost to everyone in need, without financial barriers.
                    </p>
                    <p className="text-xs leading-relaxed text-charcoal/70 sm:text-sm text-justify hyphens-auto [text-wrap:pretty]">
                      Abhinava is our humble attempt to channel our technical craft and enterprise expertise in service of that magnificent vision. If our code can help a business scale, and through that same work, heal a human life, then our labor becomes true seva.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </article>
  )
}