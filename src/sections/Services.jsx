import { motion } from 'framer-motion'
import {
  Globe2,
  Code2,
  Workflow,
  Layers3,
  Gem,
} from 'lucide-react'

const services = [
  {
    number: '01',
    icon: Globe2,
    title: 'Website Development',
    description:
      'Thoughtful, responsive websites that give businesses and organizations a clear and credible digital presence.',
  },
  {
    number: '02',
    icon: Code2,
    title: 'Custom Software Development',
    description:
      'Purpose-built software designed around your workflows, requirements and the way your organization operates.',
  },
  {
    number: '03',
    icon: Workflow,
    title: 'Business Automation',
    description:
      'Digital workflows that simplify repetitive processes, reduce manual effort and improve operational consistency.',
  },
  {
    number: '04',
    icon: Layers3,
    title: 'CRM & Business Systems',
    description:
      'Secure systems for managing customers, operations, inventory, employees, reporting and other core business processes.',
  },
  {
    number: '05',
    icon: Gem,
    title: 'Jewelry Business Solutions',
    description:
      'Specialized technology for jewelry businesses, shaped around inventory, gold management, sales, purchases and operational workflows.',
  },
]

export default function Services() {
  return (
    <section id="services" className="bg-ivory">
      <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
            What we do
          </p>

          <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Ideas, built into reality.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-charcoal/60 sm:text-lg">
            From a digital presence to a complete business system, we design
            and develop technology around the way your organization actually
            works.
          </p>
        </motion.div>

        <div className="mt-16 border-t border-border">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="group grid gap-6 border-b border-border py-8 transition-colors duration-300 hover:bg-paper sm:grid-cols-[70px_70px_1fr] sm:items-center sm:px-5"
              >
                <span className="text-xs tracking-widest text-charcoal/35">
                  {service.number}
                </span>

                <Icon
                  size={24}
                  strokeWidth={1.25}
                  className="text-gold transition-transform duration-300 group-hover:scale-105"
                />

                <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr] sm:gap-10">
                  <h3 className="font-display text-2xl sm:text-3xl">
                    {service.title}
                  </h3>

                  <p className="max-w-xl text-sm leading-7 text-charcoal/55 sm:text-base">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}