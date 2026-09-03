import {
  FolderKanban,
  MessageSquareQuote,
  HeartHandshake,
  BriefcaseBusiness,
  ArrowUpRight,
} from 'lucide-react'

const sections = [
  {
    title: 'Projects',
    description:
      'Manage the projects presented across the Abhinava portfolio.',
    path: '/admin/projects',
    icon: FolderKanban,
  },
  {
    title: 'Testimonials',
    description:
      'Manage client testimonials and their public visibility.',
    path: '/admin/testimonials',
    icon: MessageSquareQuote,
  },
  {
    title: 'What We Do',
    description:
      'Manage the services and capabilities presented by Abhinava.',
    path: '/admin/services',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Healthcare Ledger',
    description:
      'Manage healthcare allocations, utilisation and supporting records.',
    path: '/admin/ledger',
    icon: HeartHandshake,
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen px-6 py-8 sm:px-8 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="border-b border-black/10 pb-8">

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b7a42]">
            Abhinava Administration
          </p>

          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-black/45">
            Manage the content and information that powers the Abhinava
            digital presence.
          </p>

        </div>


        {/* Management sections */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">

          {sections.map((section) => {
            const Icon = section.icon

            return (
              <a
                key={section.title}
                href={section.path}
                className="group rounded-2xl border border-black/10 bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-lg"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0ede6]">
                    <Icon
                      size={19}
                      strokeWidth={1.4}
                    />
                  </div>

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.4}
                    className="text-black/25 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black"
                  />

                </div>

                <h2 className="mt-8 font-display text-2xl">
                  {section.title}
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-black/45">
                  {section.description}
                </p>

              </a>
            )
          })}

        </div>


        {/* Principle */}
        <div className="mt-8 rounded-2xl border border-[#9b7a42]/15 bg-[#f0ede6] p-7">

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b7a42]">
            Administration Principle
          </p>

          <p className="mt-4 max-w-3xl font-display text-2xl leading-relaxed text-black/70 sm:text-3xl">
            What is published here should be accurate, transparent and
            worthy of the trust placed in Abhinava.
          </p>

        </div>

      </div>

    </div>
  )
}