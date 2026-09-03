import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getPublishedProjects } from '../firebase/projects'

function getYouTubeEmbedUrl(url) {
  if (!url) {
    return null
  }

  try {
    const parsedUrl = new URL(url)

    if (parsedUrl.hostname.includes('youtu.be')) {
      const videoId = parsedUrl.pathname.replace('/', '')

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : null
    }

    if (parsedUrl.hostname.includes('youtube.com')) {
      const videoId = parsedUrl.searchParams.get('v')

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }

      if (parsedUrl.pathname.startsWith('/embed/')) {
        return url
      }
    }

    return null
  } catch {
    return null
  }
}

function ProjectVisual({ project, featured = false }) {
  const image = project.images?.[0]

  if (image) {
    return (
      <img
        src={image}
        alt={`${project.name} project`}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${
          featured
            ? 'group-hover:scale-[1.02]'
            : 'group-hover:scale-[1.04]'
        }`}
      />
    )
  }

  return (
    <>
      <div className="absolute right-8 top-4 font-display text-[8rem] leading-none text-charcoal/[0.045] sm:text-[10rem]">
        {project.number}
      </div>

      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {project.category}
        </p>

        <h3 className="mt-4 font-display text-4xl leading-none text-charcoal/70 sm:text-5xl">
          {project.name}
        </h3>
      </div>
    </>
  )
}

function ProjectLinks({ project }) {
  return (
    <div className="flex flex-wrap items-center gap-4">

      {project.officialUrl && (
        <a
          href={project.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-sm font-medium text-charcoal"
        >
          Visit Project

          <span className="flex h-8 w-8 items-center justify-center border border-charcoal/15 transition-all duration-300 group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-ivory">
            <ArrowUpRight
              size={15}
              strokeWidth={1.4}
            />
          </span>
        </a>
      )}

      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-sm text-charcoal/55 transition-colors hover:text-charcoal"
        >
          Demo

          <ExternalLink
            size={14}
            strokeWidth={1.4}
          />
        </a>
      )}

    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadProjects() {
      try {
        setLoading(true)
        setError('')

        const data = await getPublishedProjects()

        if (active) {
          setProjects(data)
        }
      } catch (err) {
        console.error('Failed to load projects:', err)

        if (active) {
          setError('Projects are temporarily unavailable.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      active = false
    }
  }, [])

  const featuredProject = projects.find(
    (project) => project.featured === true,
  ) || projects[0]

  const otherProjects = featuredProject
    ? projects.filter((project) => project.id !== featuredProject.id)
    : []

  if (loading) {
    return (
      <section
        id="work"
        className="bg-paper"
      >
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12 lg:py-36">

          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Selected Work
          </p>

          <div className="mt-10 h-64 animate-pulse bg-black/[0.04]" />

        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        id="work"
        className="bg-paper"
      >
        <div className="mx-auto max-w-7xl px-6 py-28 text-center sm:px-8 lg:px-12 lg:py-36">

          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Selected Work
          </p>

          <p className="mt-6 text-sm text-charcoal/50">
            {error}
          </p>

        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section
        id="work"
        className="bg-paper"
      >
        <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12 lg:py-36">

          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Selected Work
          </p>

          <h2 className="mt-6 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            Built with
            <br />
            intention.
          </h2>

        </div>
      </section>
    )
  }

  return (
    <section
      id="work"
      className="bg-paper"
    >
      <div className="mx-auto max-w-7xl px-6 py-28 sm:px-8 lg:px-12 lg:py-36">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
        >
          <div>

            <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
              Selected Work
            </p>

            <h2 className="mt-6 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
              Built with
              <br />
              intention.
            </h2>

          </div>

          <p className="max-w-2xl text-base leading-8 text-charcoal/55 sm:text-lg lg:pb-2">
            From business software to digital platforms, our work begins with
            understanding the people, processes and problems behind a project.
          </p>

        </motion.div>


        {/* Featured Project */}
        {featuredProject && (
          <motion.article
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9 }}
            className="group mt-20"
          >

            <div className="grid overflow-hidden border border-border bg-ivory lg:grid-cols-[1.45fr_0.55fr]">

              {/* Visual */}
              <div className="relative flex min-h-[500px] items-end overflow-hidden bg-sand p-8 sm:p-12 lg:min-h-[650px] lg:p-16">

                {featuredProject.images?.[0] ? (
                  <>
                    <img
                      src={featuredProject.images[0]}
                      alt={`${featuredProject.name} project`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent" />

                    <div className="relative z-10">

                      <p className="text-xs uppercase tracking-[0.35em] text-gold-light">
                        {featuredProject.category}
                      </p>

                      <h3 className="mt-5 font-display text-5xl leading-[0.95] text-ivory sm:text-6xl lg:text-7xl">
                        {featuredProject.name}
                      </h3>

                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute right-10 top-10 font-display text-[10rem] leading-none text-charcoal/[0.045] sm:text-[14rem]">
                      {featuredProject.number}
                    </div>

                    <div className="relative z-10">

                      <p className="text-xs uppercase tracking-[0.35em] text-gold">
                        {featuredProject.category}
                      </p>

                      <h3 className="mt-6 font-display text-5xl leading-[0.95] text-charcoal/70 sm:text-6xl lg:text-7xl">
                        {featuredProject.name}
                      </h3>

                    </div>
                  </>
                )}

              </div>


              {/* Story */}
              <div className="flex flex-col justify-between border-t border-border p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">

                <div>

                  <div className="flex items-center justify-between">

                    <span className="text-xs uppercase tracking-[0.3em] text-charcoal/30">
                      Project
                    </span>

                    <span className="font-display text-2xl text-charcoal/20">
                      {featuredProject.number}
                    </span>

                  </div>

                  <h3 className="mt-12 font-display text-4xl leading-tight sm:text-5xl">
                    {featuredProject.name}
                  </h3>

                  <p className="mt-6 text-xs uppercase tracking-[0.25em] text-gold">
                    {featuredProject.category}
                  </p>

                  {featuredProject.description && (
                    <p className="mt-7 text-sm leading-7 text-charcoal/55 sm:text-base">
                      {featuredProject.description}
                    </p>
                  )}

                  {featuredProject.requiresLogin && (
                    <div className="mt-7 border-l border-gold/50 pl-4">

                      <p className="text-xs font-medium text-charcoal/70">
                        Login required
                      </p>

                      {featuredProject.loginNotice && (
                        <p className="mt-2 text-xs leading-6 text-charcoal/45">
                          {featuredProject.loginNotice}
                        </p>
                      )}

                    </div>
                  )}

                </div>


                <div className="mt-12 border-t border-border pt-6">

                  <p className="text-xs uppercase tracking-[0.25em] text-charcoal/30">
                    Explore
                  </p>

                  <div className="mt-4">
                    <ProjectLinks project={featuredProject} />
                  </div>

                </div>

              </div>

            </div>


            {/* Optional video */}
            {getYouTubeEmbedUrl(featuredProject.youtubeUrl) && (
              <div className="mt-8 overflow-hidden border border-border bg-black">
                <div className="aspect-video">
                  <iframe
                    src={getYouTubeEmbedUrl(
                      featuredProject.youtubeUrl,
                    )}
                    title={`${featuredProject.name} project video`}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

          </motion.article>
        )}


        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div className="mt-8 grid gap-8 md:grid-cols-2">

            {otherProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.75,
                  delay: index * 0.1,
                }}
                className="group overflow-hidden border border-border bg-ivory"
              >

                {/* Visual */}
                <div className="relative flex aspect-[16/10] items-end overflow-hidden bg-sand p-7 sm:p-9">

                  {project.images?.[0] ? (
                    <>
                      <img
                        src={project.images[0]}
                        alt={`${project.name} project`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

                      <div className="relative z-10">

                        <p className="text-xs uppercase tracking-[0.3em] text-gold-light">
                          {project.category}
                        </p>

                        <h3 className="mt-4 font-display text-4xl leading-none text-ivory sm:text-5xl">
                          {project.name}
                        </h3>

                      </div>
                    </>
                  ) : (
                    <ProjectVisual project={project} />
                  )}

                </div>


                {/* Information */}
                <div className="p-7 sm:p-9">

                  <div className="flex items-start justify-between gap-6">

                    <div className="max-w-lg">

                      <p className="text-xs uppercase tracking-[0.25em] text-charcoal/30">
                        {project.number}
                      </p>

                      {project.description && (
                        <p className="mt-4 text-sm leading-7 text-charcoal/55">
                          {project.description}
                        </p>
                      )}

                      {project.requiresLogin && (
                        <p className="mt-4 text-xs text-charcoal/40">
                          Client login required
                        </p>
                      )}

                    </div>

                    <ProjectLinks project={project} />

                  </div>

                </div>

              </motion.article>
            ))}

          </div>
        )}


        {/* Editorial closing line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 border-t border-border pt-8"
        >

          <div className="flex flex-col gap-3 text-sm text-charcoal/40 sm:flex-row sm:items-center sm:justify-between">

            <span>
              Websites · Software · Digital Platforms
            </span>

            <span className="font-display italic">
              More work, continuously.
            </span>

          </div>

        </motion.div>

      </div>
    </section>
  )
}