import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import projects from '../data/projects'

export default function Projects() {
  const featuredProject = projects.find((project) => project.featured)
  const otherProjects = projects.filter((project) => !project.featured)

  return (
    <section id="work" className="bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12 lg:py-36">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
            Selected Work
          </p>

          <h2 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Built with intention.
          </h2>

          <p className="mt-7 max-w-2xl text-base leading-8 text-charcoal/60 sm:text-lg">
            A selection of websites, software and digital platforms created
            through our journey.
          </p>
        </motion.div>


        {/* Featured Project */}
        {featuredProject && (
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="mt-16"
          >
            <div className="grid overflow-hidden border border-border bg-ivory lg:grid-cols-[1.45fr_0.55fr]">

              {/* Visual */}
              <div className="flex min-h-[420px] items-center justify-center bg-sand p-8 sm:p-12 lg:min-h-[560px] lg:p-16">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">
                    {featuredProject.category}
                  </p>

                  <h3 className="mt-5 font-display text-5xl text-charcoal/25 sm:text-6xl">
                    {featuredProject.title}
                  </h3>

                  <p className="mt-4 text-sm text-charcoal/35">
                    Project preview
                  </p>
                </div>
              </div>

              {/* Information */}
              <div className="flex flex-col justify-between border-t border-border p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">

                <div>
                  <p className="text-xs tracking-[0.3em] text-charcoal/35">
                    {featuredProject.number}
                  </p>

                  <h3 className="mt-7 font-display text-4xl leading-tight sm:text-5xl">
                    {featuredProject.title}
                  </h3>

                  <p className="mt-6 text-sm leading-7 text-charcoal/55 sm:text-base">
                    {featuredProject.description}
                  </p>
                </div>

                <a
                  href={featuredProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-12 flex w-fit items-center gap-3 border-b border-charcoal/20 pb-2 text-sm text-charcoal transition-colors hover:border-gold hover:text-gold"
                >
                  Visit Project

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>

              </div>
            </div>
          </motion.article>
        )}


        {/* Other Projects */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">

          {otherProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
              }}
              className="group border border-border bg-ivory"
            >

              {/* Project visual */}
              <div className="flex aspect-[16/10] items-center justify-center bg-sand px-8">

                <div className="text-center transition-transform duration-500 group-hover:-translate-y-1">

                  <p className="text-xs uppercase tracking-[0.3em] text-gold">
                    {project.category}
                  </p>

                  <h3 className="mt-4 font-display text-4xl text-charcoal/25 sm:text-5xl">
                    {project.title}
                  </h3>

                </div>

              </div>


              {/* Details */}
              <div className="p-7 sm:p-9">

                <div className="flex items-start justify-between gap-6">

                  <div>
                    <p className="text-xs tracking-[0.25em] text-charcoal/30">
                      {project.number}
                    </p>

                    <h3 className="mt-3 font-display text-3xl">
                      {project.title}
                    </h3>
                  </div>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.title}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-charcoal/15 transition-all duration-300 group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-ivory"
                  >
                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.4}
                    />
                  </a>

                </div>

                <p className="mt-5 text-sm leading-7 text-charcoal/55">
                  {project.description}
                </p>

              </div>

            </motion.article>
          ))}

        </div>

      </div>
    </section>
  )
}