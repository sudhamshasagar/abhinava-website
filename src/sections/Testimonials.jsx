import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote:
      'Abhinava understood our requirements clearly and transformed our ideas into a practical digital solution.',
    name: 'Client Name',
    role: 'Business Owner',
    company: 'Organization Name',
  },
  {
    quote:
      'The entire process was thoughtful, responsive and focused on solving the actual needs of our business.',
    name: 'Client Name',
    role: 'Founder',
    company: 'Organization Name',
  },
  {
    quote:
      'A reliable technology partner who took the time to understand our requirements and deliver a solution around them.',
    name: 'Client Name',
    role: 'Business Owner',
    company: 'Organization Name',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12 lg:py-36">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
            Client voices
          </p>

          <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Trust is built through the work.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-charcoal/60 sm:text-lg">
            We value the people and organizations who have trusted us with
            their ideas, challenges and projects.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="mt-16 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={`${testimonial.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
              }}
              className="flex min-h-[360px] flex-col bg-ivory p-8 sm:p-10"
            >
              <Quote
                size={28}
                strokeWidth={1}
                className="text-gold"
              />

              <blockquote className="mt-8 flex-1 font-display text-2xl leading-relaxed text-charcoal sm:text-[1.7rem]">
                “{testimonial.quote}”
              </blockquote>

              <div className="mt-10 border-t border-border pt-6">
                <p className="text-sm font-medium text-charcoal">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-xs tracking-wide text-charcoal/45">
                  {testimonial.role}
                </p>

                <p className="mt-1 text-xs tracking-wide text-gold">
                  {testimonial.company}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="font-display text-xl italic text-charcoal/55 sm:text-2xl">
            Every project begins with trust.
          </p>
        </motion.div>

      </div>
    </section>
  )
}