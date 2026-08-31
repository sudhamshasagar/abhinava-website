import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function HealthcareCommitment() {
  return (
    <section id="healthcare" className="bg-sand">
      <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
              Where your project makes a difference
            </p>

            <div className="mt-8 flex items-baseline gap-2">
              <span className="font-display text-[8rem] font-medium leading-none tracking-tight sm:text-[10rem]">
                70
              </span>

              <span className="font-display text-5xl text-gold sm:text-6xl">
                %
              </span>
            </div>

            <p className="mt-5 max-w-md font-display text-2xl leading-relaxed text-charcoal/75 sm:text-3xl">
              of every project fee is committed to healthcare assistance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              A simple commitment. Clearly accounted for.
            </h2>

            <div className="mt-7 space-y-5 text-base leading-8 text-charcoal/60 sm:text-lg">
              <p>
                When you entrust Abhinava with a project, 70% of the project
                fee is committed toward healthcare assistance for people in
                need.
              </p>

              <p>
                This support may help provide medicines, medical treatment or
                assistance toward surgery, according to genuine need and
                available resources.
              </p>

              <p>
                The remaining 30% supports the continued work and operation of
                Abhinava. Infrastructure and third-party service costs are
                handled separately as agreed with the client.
              </p>
            </div>

            <div className="mt-9 border-t border-charcoal/10 pt-7">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-charcoal/40">
                    Transparency
                  </p>

                  <p className="mt-2 text-sm text-charcoal/65">
                    Follow allocations, utilization and receipts.
                  </p>
                </div>

                <a
                  href="#ledger"
                  className="group flex shrink-0 items-center gap-2 text-sm text-charcoal"
                >
                  Public ledger
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}