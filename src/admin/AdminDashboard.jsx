import { Link } from 'react-router-dom'
import {
  FolderKanban,
  MessageSquareQuote,
  HeartHandshake,
  BriefcaseBusiness,
  PanelBottom,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const sections = [
  {
    title: 'Projects',
    description: 'Manage case studies, tech stacks, and live deployments.',
    path: '/admin/projects',
    icon: FolderKanban,
    tag: 'Portfolio',
  },
  {
    title: 'Testimonials',
    description: 'Control client quotes, author credentials, and visibility.',
    path: '/admin/testimonials',
    icon: MessageSquareQuote,
    tag: 'Reputation',
  },
  {
    title: 'What We Do',
    description: 'Define services, capabilities, and business offerings.',
    path: '/admin/services',
    icon: BriefcaseBusiness,
    tag: 'Capabilities',
  },
  {
    title: 'Healthcare Ledger',
    description: 'Track 70% community allocations and financial records.',
    path: '/admin/ledger',
    icon: HeartHandshake,
    tag: 'Commitment',
  },
  {
    title: 'Footer Settings',
    description: 'Manage legal notices, social handles, and contact points.',
    path: '/admin/footer',
    icon: PanelBottom,
    tag: 'Navigation',
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* COMPACT HEADER */}
        <header className="flex flex-col gap-2 border-b border-black/[0.08] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#9b7a42]" />
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.25em] text-[#9b7a42]">
                Control Hub
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-[#242321] sm:text-3xl">
              Overview & Modules
            </h1>
          </div>

          <p className="max-w-md text-xs text-black/50 sm:text-right">
            Manage publication channels, content directories, and live data records.
          </p>
        </header>

        {/* COMPACT SECTION TILES */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon

            return (
              <Link
                key={section.title}
                to={section.path}
                className="group relative flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c6a15b]/60 hover:shadow-sm sm:p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0ede6] text-[#242321] transition-colors group-hover:bg-[#242321] group-hover:text-white">
                      <Icon size={16} strokeWidth={1.5} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-black/40">
                        {section.tag}
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="text-black/30 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black"
                      />
                    </div>
                  </div>

                  <h2 className="mt-4 font-display text-lg font-medium text-[#242321]">
                    {section.title}
                  </h2>

                  <p className="mt-1.5 text-xs leading-relaxed text-black/50">
                    {section.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 border-t border-black/[0.04] pt-2.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#9b7a42] transition-colors group-hover:text-[#242321]">
                  <span>Open Module</span>
                  <span>→</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* PRINCIPLE STRIP */}
        <div className="flex items-start gap-3 rounded-xl border border-[#9b7a42]/20 bg-[#f0ede6]/60 p-4 sm:items-center sm:p-4.5">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#9b7a42]/15 text-[#9b7a42] sm:mt-0">
            <ShieldCheck size={16} strokeWidth={1.8} />
          </div>

          <div className="flex-1">
            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#9b7a42]">
              Administrative Standard
            </span>
            <p className="mt-0.5 text-xs leading-relaxed text-black/70 sm:text-[13px]">
              What is published here should be accurate, transparent, and worthy of the trust placed in Abhinava.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}