import { ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const pageDetails = {
  '/admin/testimonials': {
    title: 'Testimonial Management',
    description:
      'Manage client testimonials that appear on the public website.',
  },

  '/admin/services': {
    title: 'What We Do Management',
    description:
      'Manage the services and capabilities presented by Abhinava.',
  },

  '/admin/ledger': {
    title: 'Healthcare Ledger Management',
    description:
      'Manage healthcare allocations, utilisation and supporting records.',
  },

  '/admin/footer': {
    title: 'Footer Management',
    description:
      'Manage contact information, links, language options and footer content.',
  },
}

export default function AdminPlaceholder() {
  const location = useLocation()

  const details =
    pageDetails[location.pathname] || {
      title: 'Administration',
      description: 'Manage Abhinava.',
    }

  return (
    <div className="min-h-screen px-6 py-8 sm:px-8 lg:px-10">

      <div className="mx-auto max-w-5xl">

        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-xs text-black/40 transition hover:text-black"
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>

        <div className="mt-12 rounded-2xl border border-black/10 bg-white p-8 sm:p-12">

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b7a42]">
            Abhinava Administration
          </p>

          <h1 className="mt-4 font-display text-4xl sm:text-5xl">
            {details.title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-black/45">
            {details.description}
          </p>

          <div className="mt-10 border-t border-black/[0.06] pt-6">

            <p className="text-xs uppercase tracking-[0.2em] text-black/25">
              Coming next
            </p>

            <p className="mt-3 text-sm text-black/45">
              This management module will be built according to the
              workflow you define.

            </p>

          </div>

        </div>

      </div>

    </div>
  )
}