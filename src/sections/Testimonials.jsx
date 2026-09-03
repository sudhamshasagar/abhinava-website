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
    <section id="testimonials" className="bg-paper py-24 sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center text-center sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-charcoal/40"
          >
            Client Voices
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl font-medium tracking-tight text-charcoal sm:text-4xl lg:text-5xl [text-wrap:balance]"
          >
            Trust is built <span className="font-serif italic text-charcoal/70">through the work.</span>
          </motion.h2>
        </div>

        {/* ==========================================
            EDITORIAL ASYMMETRICAL SPREAD (All visible at once)
        ========================================== */}
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={`${testimonial.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
              }}
              /* 
                Each card uses a distinct architectural layout:
                - Card 01: Clean minimal glass panel
                - Card 02: Slightly elevated / darker tint to break monotony
                - Card 03: Outlined bordered aesthetic
              */
              className={`relative flex flex-col justify-between p-8 sm:p-10 transition-all duration-500 hover:-translate-y-1 ${
                index === 1 
                  ? 'rounded-3xl bg-charcoal text-ivory shadow-xl shadow-charcoal/10 lg:-translate-y-4' 
                  : 'rounded-3xl border border-charcoal/10 bg-white/50 backdrop-blur-sm'
              }`}
            >
              <div>
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote 
                    size={28} 
                    strokeWidth={1.2} 
                    className={index === 1 ? 'text-ivory/30' : 'text-charcoal/30'} 
                  />
                </div>

                {/* Quote Text */}
                <blockquote className={`font-display text-lg leading-relaxed sm:text-xl [text-wrap:pretty] ${
                  index === 1 ? 'text-ivory/90' : 'text-charcoal/80'
                }`}>
                  “{testimonial.quote}”
                </blockquote>
              </div>

              {/* Author Footer */}
              <div className={`mt-10 border-t pt-6 ${
                index === 1 ? 'border-ivory/15' : 'border-charcoal/10'
              }`}>
                <p className={`font-serif text-base font-medium ${
                  index === 1 ? 'text-ivory' : 'text-charcoal'
                }`}>
                  {testimonial.name}
                </p>

                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className={index === 1 ? 'text-ivory/50' : 'text-charcoal/50'}>
                    {testimonial.role}
                  </span>
                  <span className={index === 1 ? 'text-ivory/30' : 'text-charcoal/30'}>•</span>
                  <span className={`font-medium ${index === 1 ? 'text-ivory/80' : 'text-charcoal/80'}`}>
                    {testimonial.company}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="font-display text-sm tracking-widest uppercase text-charcoal/40 sm:text-base">
            Every project begins with trust.
          </p>
        </motion.div>

      </div>
    </section>
  )
}