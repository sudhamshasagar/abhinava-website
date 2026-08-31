import { motion } from 'framer-motion'

export default function Mission() {
  return (
    <section id="mission" className="bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
              Our Mission
            </p>

            <div className="mt-7 h-px w-16 bg-gold/50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            <h2 className="max-w-4xl font-display text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              A mission to enable a vision.
            </h2>

            <div className="mt-9 max-w-3xl space-y-6 text-base leading-8 text-charcoal/65 sm:text-lg">
              <p>
                Abhinava exists with a simple purpose: to use the knowledge,
                skills and opportunities placed in our hands to enable a
                larger vision of service.
              </p>

              <p>
                Inspired by the vision of the saints and the dream of
                Shridhara Swamy, we seek to build something that extends
                beyond our own success.
              </p>
            </div>

            <div className="mt-12 border-l border-gold/50 pl-6">
              <p className="font-display text-2xl italic leading-relaxed text-charcoal sm:text-3xl">
                Technology is our means.
                <br />
                Service is our purpose.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}