import { motion } from 'framer-motion'
import { ArrowRight, Heart } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-ivory pt-26 pb-5 sm:pt-32 sm:pb-20 lg:min-h-[calc(100vh-1px)] lg:pt-32 lg:pb-16">
      <div className="mx-auto flex min-h-full w-full max-w-7xl items-center px-6 sm:px-8 lg:px-12">

        <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">

          {/* ==========================================
              LEFT — MAIN BUSINESS MESSAGE
          ========================================== */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-5 flex items-center gap-2"
            >
              <Heart
                size={14}
                className="text-charcoal/40"
                strokeWidth={1.5}
              />

              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/60 sm:text-xs">
                Technology with a purpose
              </span>
            </motion.div>


            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-display text-[2.7rem] font-medium leading-[1.03] tracking-tight text-charcoal sm:text-5xl md:text-6xl lg:text-[4.6rem] xl:text-7xl"
            >
              Build something
              <br />

              <span className="font-light italic text-charcoal/80">
                meaningful.
              </span>
            </motion.h1>


            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-5 max-w-xl text-justify text-sm leading-6 text-charcoal/70 sm:mt-6 sm:text-base sm:leading-7 lg:text-left hyphens-auto"
            >
              Tell us what your business needs. We turn your ideas,
              problems and everyday processes into practical websites,
              custom software and business systems built around the way
              you work.
            </motion.p>


            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.28 }}
              className="mt-3 max-w-xl text-justify text-sm leading-6 text-charcoal/55 sm:text-base sm:leading-7 lg:text-left hyphens-auto"
            >
              And when you build with us, your project becomes part of
              something beyond business — supporting healthcare for
              people in need.
            </motion.p>


            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.38 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:mt-9 lg:justify-start"
            >

              <a
                href="#contact"
                className="group flex items-center gap-3 bg-charcoal px-7 py-4 text-sm font-medium text-ivory transition-all duration-300 hover:bg-charcoal/90 hover:shadow-xl hover:shadow-charcoal/10"
              >
                Let's build together

                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>


              <a
                href="#work"
                className="text-sm font-medium text-charcoal/60 transition-colors duration-300 hover:text-charcoal"
              >
                See our work
              </a>

            </motion.div>

          </div>


          {/* ==========================================
              RIGHT — HEALTHCARE PURPOSE
          ========================================== */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="w-full"
          >

            <div className="relative bg-charcoal/[0.035] px-7 py-8 sm:px-10 sm:py-9 lg:px-10 lg:py-10">

              {/* Architectural accent */}
              <div className="absolute left-0 top-0 h-[2px] w-14 bg-charcoal/20" />


              {/* Label */}
              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/[0.05]">
                  <Heart
                    size={15}
                    className="text-charcoal/60"
                    strokeWidth={1.5}
                  />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-charcoal/45">
                  Our commitment
                </span>

              </div>


              {/* Main emotional message */}
              <h2 className="max-w-md font-serif text-3xl font-medium leading-tight text-charcoal sm:text-4xl">
                Your project can help someone heal.
              </h2>


              <p className="mt-5 text-justify text-sm leading-6 text-charcoal/65 sm:text-base sm:leading-7 lg:text-left hyphens-auto">
                We commit 70% of every project fee to healthcare assistance
                for people in need. The remaining 30% supports the work
                and growth of Abhinava.
              </p>


              <p className="mt-3 text-justify text-sm leading-6 text-charcoal/55 sm:text-base sm:leading-7 lg:text-left hyphens-auto">
                Your project therefore creates value twice — first for
                your business, and then through a contribution towards
                someone else's healthcare.
              </p>


              <a
                href="#healthcare"
                className="group mt-6 inline-flex items-center gap-2 border-b border-charcoal/20 pb-1 text-sm font-medium text-charcoal transition-colors hover:border-charcoal"
              >
                See where the 70% goes

                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}