import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight,
  ExternalLink,
  Heart,
  LockKeyhole,
  Play,
  Sparkles,
  Clock3,
  Users,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getPublishedProjects } from '../firebase/projects'

function getYouTubeEmbedUrl(url) {
  if (!url) return null

  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '')
      return id
        ? `https://www.youtube.com/embed/${id}`
        : null
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')

      if (id) {
        return `https://www.youtube.com/embed/${id}`
      }

      if (parsed.pathname.startsWith('/embed/')) {
        return url
      }
    }

    return null
  } catch {
    return null
  }
}

function formatCurrency(value) {
  const amount = Number(value)

  if (!Number.isFinite(amount) || amount <= 0) {
    return null
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getOrientation(src) {
  return new Promise((resolve) => {
    const image = new Image()

    image.onload = () => {
      const ratio =
        image.naturalWidth / image.naturalHeight

      if (ratio > 1.35) {
        resolve('landscape')
      } else if (ratio < 0.78) {
        resolve('portrait')
      } else {
        resolve('square')
      }
    }

    image.onerror = () => resolve('landscape')
    image.src = src
  })
}

function ProjectImages({ project, onOpen }) {
  const images = Array.isArray(project.images)
    ? project.images.filter(Boolean)
    : []

  const [orientations, setOrientations] = useState({})

  useEffect(() => {
    let mounted = true

    async function detect() {
      const result = {}

      await Promise.all(
        images.map(async (image) => {
          result[image] = await getOrientation(image)
        }),
      )

      if (mounted) {
        setOrientations(result)
      }
    }

    if (images.length) {
      detect()
    }

    return () => {
      mounted = false
    }
  }, [project.id])

  if (!images.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[#e9e4da]">
        <div className="text-center">
          <Layers
            size={28}
            strokeWidth={1}
            className="mx-auto text-[#242321]/20"
          />

          <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-[#242321]/30">
            Project Preview
          </p>
        </div>
      </div>
    )
  }

  const primary = images[0]
  const secondary = images.slice(1, 4)

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="group relative block w-full overflow-hidden bg-[#e9e4da]"
      >
        <div
          className={`flex items-center justify-center ${
            orientations[primary] === 'portrait'
              ? 'min-h-[500px]'
              : orientations[primary] === 'square'
                ? 'aspect-square'
                : 'min-h-[300px] sm:min-h-[440px]'
          }`}
        >
          <img
            src={primary}
            alt={`${project.name} primary`}
            className="max-h-[650px] w-full object-contain transition-transform duration-700 group-hover:scale-[1.015]"
          />
        </div>

        <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/45 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-[9px] uppercase tracking-[0.28em] text-white">
            Open gallery
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#242321]">
            <Maximize2 size={14} />
          </span>
        </div>
      </button>

      {secondary.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {secondary.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => onOpen(index + 1)}
              className="group relative overflow-hidden bg-[#e9e4da]"
            >
              <div className="aspect-[4/3] flex items-center justify-center">
                <img
                  src={image}
                  alt={`${project.name} ${index + 2}`}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/40 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="font-mono text-[8px] text-white">
                  {String(index + 2).padStart(2, '0')}
                </span>

                <Maximize2
                  size={12}
                  className="text-white"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {images.length > 4 && (
        <button
          type="button"
          onClick={() => onOpen(4)}
          className="w-full border border-black/10 py-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#242321]/50 transition-colors hover:bg-[#242321] hover:text-white"
        >
          View all {images.length} images
        </button>
      )}
    </div>
  )
}

function Lightbox({
  images,
  index,
  onClose,
  onNext,
  onPrevious,
}) {
  if (index === null || !images.length) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white"
        >
          <X size={18} />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onPrevious()
          }}
          className="absolute left-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white sm:flex"
        >
          <ChevronLeft size={20} />
        </button>

        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`Project image ${index + 1}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-h-[88vh] max-w-[92vw] object-contain"
          onClick={(event) => event.stopPropagation()}
        />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onNext()
          }}
          className="absolute right-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white sm:flex"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 font-mono text-[9px] text-white/60">
          {String(index + 1).padStart(2, '0')} /{' '}
          {String(images.length).padStart(2, '0')}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function Stat({ icon: Icon, label, value }) {
  if (!value) return null

  return (
    <div>
      <div className="flex items-center gap-2 text-[#242321]/30">
        <Icon size={13} strokeWidth={1.3} />
        <span className="text-[8px] uppercase tracking-[0.25em]">
          {label}
        </span>
      </div>

      <p className="mt-2 text-xs font-medium text-[#242321]">
        {value}
      </p>
    </div>
  )
}

function CaseStudy({
  project,
  index,
  onOpenImage,
}) {
  const videoUrl = getYouTubeEmbedUrl(
    project.youtubeUrl,
  )

  const healthcareAmount = formatCurrency(
    project.healthcareAllocation,
  )

  const techStack = Array.isArray(project.techStack)
    ? project.techStack
    : []

  return (
    <article className="relative">
      {/* Editorial number */}
      <div className="mb-8 flex items-center gap-4">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#242321]/25">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="h-px w-10 bg-[#c6a15b]" />

        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9b7837]">
          {project.category || 'Selected work'}
        </span>
      </div>

      {/* Main magazine spread */}
      <div
        className={`grid gap-10 lg:grid-cols-12 lg:gap-14 ${
          index % 2 === 1
            ? 'lg:[&>div:first-child]:order-2'
            : ''
        }`}
      >
        {/* Text */}
        <div className="flex flex-col justify-between lg:col-span-4">
          <div>
            <h3 className="font-display text-4xl font-normal leading-[0.95] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              {project.name}
            </h3>

            <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#242321]/35">
              {project.category ||
                'Digital product'}
            </p>

            <div className="mt-8 h-px w-12 bg-[#c6a15b]" />

            <p className="mt-7 text-sm leading-7 text-[#242321]/60 sm:text-base sm:leading-8">
              {project.description ||
                'A carefully engineered digital experience built around real business requirements.'}
            </p>

            {project.originNote && (
              <p className="mt-6 border-l border-[#c6a15b] pl-4 text-[10px] leading-5 text-[#242321]/40">
                {project.originNote}
              </p>
            )}

            {/* Technology */}
            {techStack.length > 0 && (
              <div className="mt-9">
                <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#242321]/30">
                  Technology
                </p>

                <div className="mt-4 space-y-2">
                  {techStack.map((tech, techIndex) => (
                    <div
                      key={`${tech}-${techIndex}`}
                      className="flex items-center gap-3"
                    >
                      <span className="h-px w-3 bg-black/15" />

                      <span className="text-[10px] uppercase tracking-[0.1em] text-[#242321]/55">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-10">
            <div className="flex flex-wrap gap-3">
              {project.officialUrl && (
                <a
                  href={project.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-[#242321] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white"
                >
                  Visit live
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              )}

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 border border-black/15 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#242321]"
                >
                  Demo
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {project.requiresLogin && (
              <div className="mt-5 flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-[#242321]/35">
                <LockKeyhole size={12} />
                Restricted client platform
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="lg:col-span-8">
          <ProjectImages
            project={project}
            onOpen={onOpenImage}
          />
        </div>
      </div>

      {/* Facts */}
      <div className="mt-12 grid grid-cols-2 gap-y-7 border-y border-black/10 py-7 sm:grid-cols-4">
        <Stat
          icon={Clock3}
          label="Timeline"
          value={project.duration}
        />

        <Stat
          icon={Users}
          label="Users / scale"
          value={project.userCount}
        />

        <Stat
          icon={Layers}
          label="Access"
          value={
            project.requiresLogin
              ? 'Restricted'
              : 'Public'
          }
        />

        {project.healthcareStatus &&
        project.healthcareStatus !==
          'not-applicable' ? (
          <Stat
            icon={Heart}
            label="Healthcare"
            value={
              healthcareAmount
                ? healthcareAmount
                : 'Included'
            }
          />
        ) : (
          <Stat
            icon={Sparkles}
            label="Status"
            value="Published"
          />
        )}
      </div>

      {/* Client access */}
      {project.requiresLogin &&
        project.loginNotice && (
          <div className="mt-8 border-l-2 border-[#c6a15b] bg-[#c6a15b]/5 px-5 py-4">
            <div className="flex items-center gap-2">
              <LockKeyhole
                size={13}
                className="text-[#9b7837]"
              />

              <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#9b7837]">
                Client access
              </span>
            </div>

            <p className="mt-2 text-xs leading-6 text-[#242321]/55">
              {project.loginNotice}
            </p>
          </div>
        )}

      {/* Video */}
      {videoUrl && (
        <div className="mt-14 border-t border-black/10 pt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#9b7837]">
                Walkthrough
              </p>

              <h4 className="mt-2 font-display text-2xl">
                See it in action.
              </h4>
            </div>

            <Play
              size={17}
              strokeWidth={1.3}
              className="text-[#242321]/25"
            />
          </div>

          <div className="overflow-hidden bg-black">
            <div className="aspect-video">
              <iframe
                src={videoUrl}
                title={`${project.name} walkthrough`}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Separator */}
      <div className="mt-24 flex items-center gap-5">
        <span className="h-px flex-1 bg-black/10" />

        <span className="font-serif text-xl italic text-[#242321]/20">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="h-px flex-1 bg-black/10" />
      </div>
    </article>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadProjects() {
      try {
        setLoading(true)
        setError('')

        const data = await getPublishedProjects()

        if (!mounted) return

        setProjects(
          Array.isArray(data)
            ? data.filter(
                (project) =>
                  project &&
                  project.deleted !== true,
              )
            : [],
        )
      } catch (err) {
        console.error(
          'Failed to load projects:',
          err,
        )

        if (mounted) {
          setError(
            'Unable to load projects right now.',
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      mounted = false
    }
  }, [])

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(
        projects
          .map((project) => project.category)
          .filter(Boolean),
      ),
    )

    return ['All', ...values]
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (category === 'All') {
      return projects
    }

    return projects.filter(
      (project) => project.category === category,
    )
  }, [projects, category])

  useEffect(() => {
    document.body.style.overflow =
      lightbox ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [lightbox])

  if (loading) {
    return (
      <section
        id="work"
        className="flex min-h-[80vh] items-center justify-center bg-[#f7f5f0]"
      >
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-[#242321]" />

          <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-black/35">
            Curating works
          </p>
        </div>
      </section>
    )
  }

  if (error || projects.length === 0) {
    return (
      <section
        id="work"
        className="bg-[#f7f5f0] py-32 text-center"
      >
        <p className="text-[9px] uppercase tracking-[0.3em] text-[#9b7837]">
          Selected Work
        </p>

        <p className="mt-4 text-sm text-black/40">
          {error ||
            'Work is coming together.'}
        </p>
      </section>
    )
  }

  const lightboxImages =
    lightbox?.images || []

  return (
    <>
      <section
        id="work"
        className="overflow-hidden bg-[#f7f5f0] text-[#242321]"
      >
        <div className="mx-auto max-w-[1450px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          {/* Header */}
          <header className="mb-24 sm:mb-32 lg:mb-40">
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={12}
                    strokeWidth={1.3}
                    className="text-[#9b7837]"
                  />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-black/35">
                    Abhinava / Work
                  </span>
                </div>

                <h2 className="mt-6 max-w-4xl font-display text-6xl font-normal leading-[0.88] tracking-[-0.05em] sm:text-8xl lg:text-[9rem]">
                  Selected
                  <span className="ml-3 font-serif italic text-black/55">
                    work.
                  </span>
                </h2>

                <p className="mt-8 max-w-xl text-sm leading-7 text-black/45 sm:text-base">
                  Digital products, business systems and
                  experiences built around the way organisations
                  actually work.
                </p>
              </div>

              {/* Filters */}
              <div className="flex max-w-md flex-wrap gap-x-5 gap-y-3">
                {categories.map((item) => {
                  const active = category === item

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`relative pb-2 text-[9px] font-semibold uppercase tracking-[0.22em] ${
                        active
                          ? 'text-[#242321]'
                          : 'text-black/30 hover:text-black/60'
                      }`}
                    >
                      {item}

                      <span
                        className={`absolute bottom-0 left-0 h-px bg-[#c6a15b] transition-all duration-300 ${
                          active
                            ? 'w-full'
                            : 'w-0'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </header>

          {/* Projects */}
          <div className="space-y-32 sm:space-y-44 lg:space-y-56">
            {filteredProjects.map(
              (project, index) => (
                <CaseStudy
                  key={project.id}
                  project={project}
                  index={index}
                  onOpenImage={(imageIndex) => {
                    const images =
                      Array.isArray(project.images)
                        ? project.images.filter(Boolean)
                        : []

                    setLightbox({
                      images,
                      index: imageIndex,
                    })
                  }}
                />
              ),
            )}
          </div>

          {/* End */}
          <div className="mt-32 border-t border-black/10 pt-10 text-center sm:mt-44">
            <p className="text-[9px] uppercase tracking-[0.35em] text-black/30">
              End of selected work
            </p>

            <p className="mt-4 font-serif text-xl italic text-black/45">
              More is being built.
            </p>
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={lightboxImages}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onPrevious={() => {
            setLightbox((current) => {
              if (!current) return null

              return {
                ...current,
                index:
                  (current.index -
                    1 +
                    current.images.length) %
                  current.images.length,
              }
            })
          }}
          onNext={() => {
            setLightbox((current) => {
              if (!current) return null

              return {
                ...current,
                index:
                  (current.index + 1) %
                  current.images.length,
              }
            })
          }}
        />
      )}
    </>
  )
}