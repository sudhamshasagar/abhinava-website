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
  Images,
  Cpu,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getPublishedProjects } from '../firebase/projects'

/* -------------------------------------------------------------------------- */
/*                               Helper Methods                               */
/* -------------------------------------------------------------------------- */

function getYouTubeEmbedUrl(url, autoplay = true) {
  if (!url || typeof url !== 'string') return null
  const formattedUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  const match = formattedUrl.match(regExp)

  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}${autoplay ? '?autoplay=1' : ''}`
  }
  return null
}

function formatCurrency(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return null
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/* -------------------------------------------------------------------------- */
/*                                Modals & UI                                 */
/* -------------------------------------------------------------------------- */

function Lightbox({ images, index, onClose, onNext, onPrevious }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrevious()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrevious])

  if (index === null || !images?.length) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#151413]/95 backdrop-blur-md p-4 sm:p-8"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/25"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onPrevious()
          }}
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/25 sm:left-6"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>

        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`Preview ${index + 1}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-h-[82vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/25 sm:right-6"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-4 py-1 font-mono text-[10px] tracking-widest text-white/80">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function VideoModal({ videoUrl, title, onClose }) {
  if (!videoUrl) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/25"
          aria-label="Close video"
        >
          <X size={16} />
        </button>

        <div
          className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={videoUrl}
            title={`${title} walkthrough`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* -------------------------------------------------------------------------- */
/*                            Compact Project Card                            */
/* -------------------------------------------------------------------------- */

function MiniProjectCard({ project, index, onOpenGallery, onOpenVideo }) {
  const images = Array.isArray(project.images) ? project.images.filter(Boolean) : []
  const techStack = Array.isArray(project.techStack) ? project.techStack : []
  const healthcareAmount = formatCurrency(project.healthcareAllocation)
  const videoUrl = getYouTubeEmbedUrl(project.youtubeUrl)
  const isHealthcare = project.healthcareStatus && project.healthcareStatus !== 'not-applicable'

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c6a15b]/60 hover:shadow-md">
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-[#9b7837]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#c6a15b]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#242321]/60">
              {project.category || 'Product'}
            </span>
          </div>

          {project.requiresLogin ? (
            <span className="inline-flex items-center gap-1 rounded bg-[#c6a15b]/10 px-2 py-0.5 text-[9px] font-semibold text-[#9b7837]">
              <LockKeyhole size={10} /> Private
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded bg-black/[0.04] px-2 py-0.5 text-[9px] font-semibold text-[#242321]/50">
              <Layers size={10} /> Public
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="mt-3">
          <h3 className="font-display text-xl font-medium tracking-tight text-[#242321]">
            {project.name}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#242321]/70 line-clamp-3">
            {project.description ||
              'Targeted solution engineered to solve structural workflows with high fidelity.'}
          </p>
        </div>

        {/* Dynamic Badges Group */}
        <div className="mt-4 space-y-2.5">
          {/* Healthcare Budget / Allocation Badge */}
          {isHealthcare && (
            <div className="inline-flex w-full items-center justify-between rounded-md border border-[#c6a15b]/30 bg-[#c6a15b]/10 px-2.5 py-1 text-[10px] font-medium text-[#8f6d2e]">
              <span className="flex items-center gap-1.5 font-semibold">
                <Heart size={11} className="fill-[#8f6d2e]" /> Healthcare Grant
              </span>
              <span className="font-mono font-bold tracking-tight">
                {healthcareAmount || 'Allocated'}
              </span>
            </div>
          )}

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap gap-1.5">
            {project.duration && (
              <span className="inline-flex items-center gap-1 rounded border border-black/[0.05] bg-[#f7f5f0] px-2 py-0.5 text-[10px] font-medium text-[#242321]/70">
                <Clock3 size={10} className="text-[#9b7837]" /> {project.duration}
              </span>
            )}

            {project.userCount && (
              <span className="inline-flex items-center gap-1 rounded border border-black/[0.05] bg-[#f7f5f0] px-2 py-0.5 text-[10px] font-medium text-[#242321]/70">
                <Users size={10} className="text-[#9b7837]" /> {project.userCount}
              </span>
            )}
          </div>

          {/* Tools / Tech Stack Cluster */}
          {techStack.length > 0 && (
            <div className="rounded-md border border-black/[0.04] bg-[#f7f5f0]/60 p-2">
              <div className="mb-1.5 flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-[#242321]/40">
                <Cpu size={10} /> Tools & Stack
              </div>
              <div className="flex flex-wrap gap-1">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-white px-1.5 py-0.5 text-[9px] font-semibold text-[#242321]/80 shadow-2xs border border-black/[0.04]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer Button Group */}
      <div className="mt-5 flex items-center justify-between gap-1.5 border-t border-black/[0.06] pt-3">
        {/* Media Triggers (Gallery & Tour) */}
        <div className="flex items-center gap-1.5">
          {images.length > 0 && (
            <button
              type="button"
              onClick={() => onOpenGallery(images)}
              className="inline-flex items-center gap-1 rounded border border-[#c6a15b]/50 bg-[#c6a15b]/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#9b7837] transition-all hover:bg-[#c6a15b]/20"
              title="View Screenshots"
            >
              <Images size={12} /> {images.length}
            </button>
          )}

          {videoUrl && (
            <button
              type="button"
              onClick={() => onOpenVideo(videoUrl, project.name)}
              className="inline-flex items-center gap-1 rounded border border-black/10 bg-[#f7f5f0] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#242321] transition-all hover:bg-[#242321] hover:text-white"
              title="Watch Tour"
            >
              <Play size={11} className="fill-current" /> Tour
            </button>
          )}
        </div>

        {/* Outbound Links */}
        <div className="flex items-center gap-1.5">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded border border-black/10 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#242321] transition-all hover:bg-neutral-100"
            >
              Demo <ExternalLink size={10} />
            </a>
          )}

          {project.officialUrl && (
            <a
              href={project.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded bg-[#242321] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white transition-all hover:bg-black shadow-2xs"
            >
              Launch <ArrowUpRight size={11} />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    let mounted = true
    async function loadProjects() {
      try {
        setLoading(true)
        const data = await getPublishedProjects()
        if (!mounted) return
        setProjects(Array.isArray(data) ? data.filter((p) => p && !p.deleted) : [])
      } catch (err) {
        console.error('Failed to load projects:', err)
        if (mounted) setError('Unable to load projects right now.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadProjects()
    return () => {
      mounted = false
    }
  }, [])

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(projects.map((project) => project.category).filter(Boolean)),
    )
    return ['All', ...values]
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (category === 'All') return projects
    return projects.filter((project) => project.category === category)
  }, [projects, category])

  useEffect(() => {
    document.body.style.overflow = lightbox || activeVideo ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightbox, activeVideo])

  if (loading) {
    return (
      <section id="work" className="flex min-h-[40vh] items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-[#242321]" />
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-black/40">
            Curating works
          </p>
        </div>
      </section>
    )
  }

  if (error || projects.length === 0) {
    return (
      <section id="work" className="bg-[#f7f5f0] py-20 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9b7837]">
          Selected Work
        </p>
        <p className="mt-3 text-xs text-black/50">{error || 'No published projects available.'}</p>
      </section>
    )
  }

  return (
    <>
      <section id="work" className="bg-[#f7f5f0] text-[#242321] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header & Filter Controls */}
          <div className="mb-8 flex flex-col gap-4 border-b border-black/[0.08] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#9b7837]" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-black/45">
                  Portfolio Docket
                </span>
              </div>
              <h2 className="mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                Selected Work<span className="text-[#c6a15b]">.</span>
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="no-scrollbar -mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0 gap-1.5 pb-1 sm:pb-0">
              {categories.map((item) => {
                const active = category === item
                const count =
                  item === 'All'
                    ? projects.length
                    : projects.filter((p) => p.category === item).length

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-medium tracking-wide transition-all ${
                      active
                        ? 'bg-[#242321] text-white shadow-2xs'
                        : 'bg-white/80 text-[#242321]/70 hover:bg-white border border-black/[0.06]'
                    }`}
                  >
                    {item}{' '}
                    <span className={`ml-1 text-[8px] ${active ? 'text-white/60' : 'text-black/35'}`}>
                      ({count})
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Compact 3-Column Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <MiniProjectCard
                key={project.id || index}
                project={project}
                index={index}
                onOpenGallery={(images) => setLightbox({ images, index: 0 })}
                onOpenVideo={(url, name) => setActiveVideo({ url, title: name })}
              />
            ))}
          </div>

          {/* Footer Count */}
          <div className="mt-10 text-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-black/35">
              Showing {filteredProjects.length} of {projects.length} entries
            </span>
          </div>

        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onPrevious={() =>
            setLightbox((curr) => ({
              ...curr,
              index: (curr.index - 1 + curr.images.length) % curr.images.length,
            }))
          }
          onNext={() =>
            setLightbox((curr) => ({
              ...curr,
              index: (curr.index + 1) % curr.images.length,
            }))
          }
        />
      )}

      {/* Video Walkthrough Modal */}
      {activeVideo && (
        <VideoModal
          videoUrl={activeVideo.url}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </>
  )
}