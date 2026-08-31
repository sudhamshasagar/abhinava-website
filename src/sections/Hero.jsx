import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ivory">
      <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-24">

        <div className="mx-auto max-w-5xl text-center">

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-7 text-xs font-medium uppercase tracking-[0.45em] text-gold sm:text-sm"
          >
            Technology with a purpose
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-6xl font-medium leading-[0.92] tracking-tight sm:text-7xl lg:text-[7.5rem]"
          >
            Build something
            <br />
            <span className="italic">meaningful.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mx-auto mt-9 max-w-2xl text-base leading-8 text-charcoal/65 sm:text-lg"
          >
            We build software, websites and digital solutions that help
            businesses move forward — while turning the opportunities created
            through our work into healthcare assistance for people in need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href="#contact"
              className="group flex items-center gap-3 bg-charcoal px-7 py-3.5 text-sm text-ivory transition-all duration-300 hover:bg-charcoal/90"
            >
              Start a Project
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <a
              href="#work"
              className="px-7 py-3.5 text-sm text-charcoal/65 transition-colors duration-300 hover:text-charcoal"
            >
              Explore our work
            </a>
          </motion.div>
        </div>

        <motion.a
          href="#mission"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-charcoal/35"
          aria-label="Scroll to mission"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Discover
          </span>
          <ArrowDown size={15} strokeWidth={1} />
        </motion.a>

      </div>
    </section>
  )
}