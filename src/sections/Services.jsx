import { motion } from 'framer-motion'
import {
  Globe2,
  Code2,
  Workflow,
  Layers3,
  BarChart3,
} from 'lucide-react'

const services = [
  {
    number: '01',
    icon: Globe2,
    title: 'Website Development',
    description:
      'Professional, fast and responsive websites that help your business build trust, showcase what you offer and turn visitors into enquiries and customers.',
  },
  {
    number: '02',
    icon: Code2,
    title: 'Custom Software',
    description:
      'Software built around the way your business actually works — helping you replace spreadsheets, disconnected tools and manual processes with one system designed for your needs.',
  },
  {
    number: '03',
    icon: Layers3,
    title: 'CRM & Business Systems',
    description:
      'Centralize customers, sales, purchases, inventory, employees, operations and reports in secure business systems built for your industry — including jewelry, retail, manufacturing and service businesses.',
  },
  // {
  //   number: '04',
  //   icon: BarChart3,
  //   title: 'Data & Analytics',
  //   description:
  //     'Turn your business data into clear dashboards, reports and actionable insights so you can understand performance, identify opportunities and make better decisions.',
  // },
]

export default function Services() {
  return (
    <section
      id="services"
      className="overflow-hidden bg-ivory py-12 sm:py-32 lg:py-12"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="mx-auto mb-11 flex max-w-2xl flex-col items-center text-center lg:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-charcoal/40"
          >
            What We Do
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-charcoal sm:text-5xl"
          >
            Technology that works
            <span className="font-serif italic text-charcoal/70">
              {' '}for your business.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-5 max-w-xl text-sm leading-7 text-charcoal/55 sm:text-base"
          >
            From your first website to the systems that run your
            operations, we build practical technology around the
            needs of your business.
          </motion.p>
        </div>

        {/* ==========================================
            STATIONERY CARDS GRID
        ========================================== */}
        {/* 
          Using flex-wrap with highly specific calc() widths.
          This guarantees exactly 4 items across on Desktop, 2 on Tablet, 1 on Mobile.
          The 5th item elegantly centers itself on the bottom row.
        */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon

            return (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                // Responsive sizing logic
                className="group relative w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
              >
                {/* 
                  BACK LAYER (The subtle shadow/paper stack effect)
                  This provides the "creative aesthetic" without distorting the text boundaries.
                */}
                <div className="absolute inset-0 rounded-xl border border-charcoal/10 bg-charcoal/[0.02] transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-[1.02]" />

                {/* 
                  FRONT LAYER (The actual readable card) 
                */}
                <div className="relative flex h-full flex-col justify-between rounded-xl border border-charcoal/10 bg-white/70 px-6 py-8 backdrop-blur-md transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-charcoal/5 sm:px-7">
                  
                  {/* Top: Icon & Number Lockup */}
                  <div className="mb-10 flex items-start justify-between border-b border-charcoal/5 pb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-charcoal/[0.03] text-charcoal/60 transition-colors duration-500 group-hover:bg-charcoal/5 group-hover:text-charcoal/80">
                      <Icon size={20} strokeWidth={1.25} />
                    </div>
                    
                    <span className="font-serif text-sm italic text-charcoal/30 transition-colors duration-500 group-hover:text-charcoal/50">
                      {service.number}
                    </span>
                  </div>

                  {/* Bottom: Title & Justified Description */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="mb-4 font-display text-xl font-medium text-charcoal">
                      {service.title}
                    </h3>

                    {/* Paragraphs justified as requested to form perfectly neat blocks */}
                    <p className="mt-auto w-full text-justify text-[13px] leading-relaxed text-charcoal/60 hyphens-auto">
                      {service.description}
                    </p>
                  </div>

                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}