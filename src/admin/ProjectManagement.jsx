import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createProject as createProjectInFirebase,
  deleteProject as deleteProjectFromFirebase,
  getProjects,
  setProjectPublished,
  updateProject as updateProjectInFirebase,
} from '../firebase/projects'
import { auth, storage } from '../firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import {
  Plus,
  Search,
  SlidersHorizontal,
  MoreVertical,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  X,
  ClapperboardIcon,
  ImagePlus,
  Users,
  Clock3,
  HeartHandshake,
  Link as LinkIcon,
  Upload,
  Loader2,
  Star,
  CheckCircle2,
  FolderKanban,
  FileCheck2,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react'

const PROJECT_CATEGORIES = ['Website', 'Multi Tenant CRM', 'Inhouse CRM']

const EMPTY_PROJECT = {
  name: '',
  category: 'Website',
  techStack: [],
  officialUrl: '',
  demoUrl: '',
  requiresLogin: false,
  loginNotice:
    'Login access is available only to the client and its authorized users. Please explore the demo to experience the platform without login.',
  images: [], // array of { id, url, file, preview, isNew }
  youtubeUrl: '',
  userCount: '',
  duration: '',
  healthcareStatus: 'not-applicable',
  projectAmount: '',
  healthcareAllocation: '',
  amountUtilised: '',
  originNote:
    'This project was completed before the establishment of Abhinava Softwares and is presented as part of our previous work.',
  seoTitle: '',
  seoDescription: '',
  slug: '',
  published: true,
}

function formatCurrency(value) {
  if (value === '' || value === null || value === undefined) return '—'
  const number = Number(value)
  if (Number.isNaN(number)) return '—'
  return `₹${number.toLocaleString('en-IN')}`
}

function getHealthcareAllocation(projectAmount) {
  const amount = Number(projectAmount)
  if (!amount || amount <= 0) return 0
  return Math.round(amount * 0.7)
}

function getHealthcareStatusLabel(status) {
  switch (status) {
    case 'yes':
      return 'Healthcare'
    case 'earlier-work':
      return 'Earlier Work'
    case 'not-applicable':
      return 'Standard'
    default:
      return 'Pending'
  }
}

function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT)
  const imageInputRef = useRef(null)

  /* =========================================================
      DATA FETCHING
  ========================================================= */

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getProjects()
      setProjects(data || [])
    } catch (err) {
      console.error('Failed to load projects:', err)
      setError('Unable to fetch projects. Please verify Firestore security rules.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  /* =========================================================
      STATS CALCULATIONS
  ========================================================= */

  const stats = useMemo(() => {
    const total = projects.filter((p) => !p.deleted).length
    const published = projects.filter((p) => !p.deleted && p.published).length
    const healthcare = projects.filter(
      (p) => !p.deleted && p.healthcareStatus === 'yes',
    ).length
    const hidden = total - published
    return { total, published, healthcare, hidden }
  }, [projects])

  /* =========================================================
      FILTERING & SEARCH
  ========================================================= */

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()

    return projects.filter((project) => {
      if (project.deleted) return false

      const name = String(project.name || '').toLowerCase()
      const category = String(project.category || '').toLowerCase()
      const stack = Array.isArray(project.techStack) ? project.techStack : []

      const matchesSearch =
        !query ||
        name.includes(query) ||
        category.includes(query) ||
        stack.some((s) => String(s).toLowerCase().includes(query))

      const matchesFilter =
        filter === 'All' ||
        (filter === 'Published' && project.published) ||
        (filter === 'Hidden' && !project.published) ||
        filter === project.category

      return matchesSearch && matchesFilter
    })
  }, [projects, search, filter])

  /* =========================================================
      FORM FIELD UPDATES
  ========================================================= */

  const updateForm = (field, value) => {
    setProjectForm((curr) => ({
      ...curr,
      [field]: value,
    }))
  }

  const updateProjectAmount = (value) => {
    const alloc = getHealthcareAllocation(value)
    setProjectForm((curr) => ({
      ...curr,
      projectAmount: value,
      healthcareAllocation: curr.healthcareStatus === 'yes' ? alloc || '' : '',
    }))
  }

  const addTechStack = (e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const val = e.currentTarget.value.trim()
    if (!val || projectForm.techStack.includes(val)) {
      e.currentTarget.value = ''
      return
    }
    setProjectForm((curr) => ({
      ...curr,
      techStack: [...curr.techStack, val],
    }))
    e.currentTarget.value = ''
  }

  const removeTechStack = (item) => {
    setProjectForm((curr) => ({
      ...curr,
      techStack: curr.techStack.filter((t) => t !== item),
    }))
  }

  /* =========================================================
      IMAGE STATE HANDLING
  ========================================================= */

  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const validFiles = files.filter((f) => f.type.startsWith('image/'))
    if (!validFiles.length) {
      setError('Please choose valid image files (JPG, PNG, WebP).')
      return
    }

    const items = validFiles.map((file) => ({
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      url: null,
      preview: URL.createObjectURL(file),
      isNew: true,
    }))

    setProjectForm((curr) => ({
      ...curr,
      images: [...curr.images, ...items],
    }))
    e.target.value = ''
  }

  const removeImage = (id) => {
    setProjectForm((curr) => {
      const target = curr.images.find((img) => img.id === id)
      if (target?.isNew && target.preview) {
        URL.revokeObjectURL(target.preview)
      }
      return {
        ...curr,
        images: curr.images.filter((img) => img.id !== id),
      }
    })
  }

  const setCoverImage = (index) => {
    if (index === 0) return
    setProjectForm((curr) => {
      const copy = [...curr.images]
      const [promoted] = copy.splice(index, 1)
      copy.unshift(promoted)
      return { ...curr, images: copy }
    })
  }

  /* =========================================================
      STORAGE UPLOADS
  ========================================================= */

  const processImages = async (projectId, formImages) => {
    const finalUrls = []
    const hasNewUploads = formImages.some((i) => i.isNew && i.file)

    if (hasNewUploads) setUploadingImages(true)

    try {
      for (const item of formImages) {
        if (!item.isNew && item.url) {
          finalUrls.push(item.url)
        } else if (item.isNew && item.file) {
          const safeName = item.file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
          const storageRef = ref(
            storage,
            `projects/${projectId}/${Date.now()}-${safeName}`,
          )
          await uploadBytes(storageRef, item.file, { contentType: item.file.type })
          const dlUrl = await getDownloadURL(storageRef)
          finalUrls.push(dlUrl)
        }
      }
      return finalUrls
    } finally {
      setUploadingImages(false)
    }
  }

  /* =========================================================
      DATABASE MUTATIONS
  ========================================================= */

  const handleCreate = async () => {
    if (!projectForm.name.trim()) {
      setError('Project name is mandatory.')
      return
    }

    try {
      setSaving(true)
      setError('')

      if (!auth.currentUser) {
        throw new Error('Authentication expired. Please log in again.')
      }

      const slug = projectForm.slug.trim() || createSlug(projectForm.name)
      const baseData = {
        ...projectForm,
        name: projectForm.name.trim(),
        slug,
        techStack: Array.isArray(projectForm.techStack) ? projectForm.techStack : [],
        images: [],
        deleted: false,
      }

      const created = await createProjectInFirebase(baseData)
      const urls = await processImages(created.id, projectForm.images)

      if (urls.length > 0) {
        await updateProjectInFirebase(created.id, { images: urls })
      }

      await loadProjects()
      closeModal()
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Error occurred while saving project.')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (project) => {
    setEditingProject(project)
    const normalized = Array.isArray(project.images)
      ? project.images.filter(Boolean).map((url, idx) => ({
          id: `remote-${idx}-${url.slice(-8)}`,
          url,
          file: null,
          preview: url,
          isNew: false,
        }))
      : []

    setProjectForm({
      ...EMPTY_PROJECT,
      ...project,
      images: normalized,
      techStack: Array.isArray(project.techStack) ? project.techStack : [],
      userCount: project.userCount ?? '',
      projectAmount: project.projectAmount ?? '',
      healthcareAllocation: project.healthcareAllocation ?? '',
      amountUtilised: project.amountUtilised ?? '',
    })
    setOpenMenu(null)
    setError('')
  }

  const handleUpdate = async () => {
    if (!projectForm.name.trim() || !editingProject) return

    try {
      setSaving(true)
      setError('')

      const slug = projectForm.slug.trim() || createSlug(projectForm.name)
      const urls = await processImages(editingProject.id, projectForm.images)

      const payload = {
        ...projectForm,
        name: projectForm.name.trim(),
        slug,
        techStack: Array.isArray(projectForm.techStack) ? projectForm.techStack : [],
        images: urls,
      }

      await updateProjectInFirebase(editingProject.id, payload)
      await loadProjects()
      closeModal()
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  const togglePublished = async (project) => {
    try {
      setError('')
      await setProjectPublished(project.id, !project.published)
      await loadProjects()
      setOpenMenu(null)
    } catch (err) {
      setError(err?.message || 'Unable to toggle publication status.')
    }
  }

  const deleteProject = async (id) => {
    if (!window.confirm('Confirm deleting this project from the database?')) return
    try {
      setError('')
      await deleteProjectFromFirebase(id)
      await loadProjects()
      setOpenMenu(null)
    } catch (err) {
      setError(err?.message || 'Deletion failed.')
    }
  }

  const closeModal = () => {
    projectForm.images.forEach((img) => {
      if (img.isNew && img.preview) URL.revokeObjectURL(img.preview)
    })
    setShowAddModal(false)
    setEditingProject(null)
    setProjectForm(EMPTY_PROJECT)
    setError('')
  }

  const isModalOpen = showAddModal || Boolean(editingProject)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f0] text-[#242321]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#9b7a42]" />
          <p className="font-mono text-xs uppercase tracking-widest text-black/50">
            Syncing Records...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] px-3 py-6 text-[#242321] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        
        {/* TOP HEADER */}
        <header className="flex flex-col gap-4 border-b border-black/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#c6a15b]" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b7837]">
                Executive Workspace
              </p>
            </div>
            <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-[#242321] sm:text-4xl">
              Project Management
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setProjectForm(EMPTY_PROJECT)
              setEditingProject(null)
              setError('')
              setShowAddModal(true)
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#242321] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-black"
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Project
          </button>
        </header>

        {/* METRICS SUMMARY CARDS */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-black/[0.07] bg-white p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-black/45">
              <FolderKanban size={13} />
              <span className="font-mono text-[9px] uppercase tracking-wider">Total</span>
            </div>
            <p className="mt-1 font-display text-xl font-medium sm:text-2xl">{stats.total}</p>
          </div>

          <div className="rounded-xl border border-black/[0.07] bg-white p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-600">
              <FileCheck2 size={13} />
              <span className="font-mono text-[9px] uppercase tracking-wider">Published</span>
            </div>
            <p className="mt-1 font-display text-xl font-medium sm:text-2xl">{stats.published}</p>
          </div>

          <div className="rounded-xl border border-black/[0.07] bg-white p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-[#9b7837]">
              <HeartHandshake size={13} />
              <span className="font-mono text-[9px] uppercase tracking-wider">Healthcare</span>
            </div>
            <p className="mt-1 font-display text-xl font-medium sm:text-2xl">{stats.healthcare}</p>
          </div>

          <div className="rounded-xl border border-black/[0.07] bg-white p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 text-black/40">
              <EyeOff size={13} />
              <span className="font-mono text-[9px] uppercase tracking-wider">Draft / Hidden</span>
            </div>
            <p className="mt-1 font-display text-xl font-medium sm:text-2xl">{stats.hidden}</p>
          </div>
        </div>

        {/* ERROR PROMPT */}
        {error && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs text-red-700">
            <span className="flex items-center gap-2">
              <ShieldAlert size={14} /> {error}
            </span>
            <button type="button" onClick={() => setError('')}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* CONTROLS (SEARCH & CATEGORY BAR) */}
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, tech stack..."
                className="h-9 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-xs outline-none focus:border-[#9b7a42]"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <SlidersHorizontal
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-9 w-full appearance-none rounded-xl border border-black/10 bg-white pl-8 pr-7 text-xs font-medium outline-none focus:border-[#9b7a42] sm:w-auto"
              >
                <option value="All">All Categories</option>
                <option value="Published">Published Only</option>
                <option value="Hidden">Hidden Only</option>
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="font-mono text-[10px] text-black/45">
            Showing <strong className="text-black">{filteredProjects.length}</strong> items
          </div>
        </div>

        {/* =========================================================
            DATA PRESENTATION (DUAL-VIEW ARCHITECTURE)
        ========================================================= */}

        {/* VIEW 1: DESKTOP HIGH-DENSITY TABLE (Visible on >= lg) */}
        <div className="mt-5 hidden overflow-visible rounded-xl border border-black/[0.08] bg-white shadow-xs lg:block">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-black/[0.07] bg-[#f7f5f0]/70 font-mono text-[9px] uppercase tracking-wider text-black/45">
                <th className="px-5 py-3">Project</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Healthcare Benefit</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-neutral-50/70">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-black/[0.06] bg-[#f0ede6]">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-display text-sm text-black/30">
                            {p.name?.charAt(0) || '•'}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#242321]">{p.name}</p>
                        <p className="truncate font-mono text-[10px] text-black/40">/{p.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-medium text-black/60">{p.category || '—'}</td>

                  <td className="px-4 py-3.5 text-black/60">
                    {p.userCount ? `${p.userCount} users` : '—'}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                        p.healthcareStatus === 'yes'
                          ? 'bg-[#ece7da] text-[#765a2e]'
                          : 'bg-black/[0.04] text-black/45'
                      }`}
                    >
                      {p.healthcareStatus === 'yes' && <HeartHandshake size={10} />}
                      {getHealthcareStatusLabel(p.healthcareStatus)}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => togglePublished(p)}
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold transition ${
                        p.published
                          ? 'bg-[#242321] text-white hover:bg-black'
                          : 'bg-black/[0.06] text-black/45 hover:bg-black/10'
                      }`}
                    >
                      {p.published ? 'Published' : 'Hidden'}
                    </button>
                  </td>

                  <td className="relative px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="rounded-lg p-1.5 text-black/50 hover:bg-black/5 hover:text-black"
                        title="Edit project"
                      >
                        <Pencil size={13} />
                      </button>

                      {p.officialUrl && (
                        <a
                          href={p.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-black/50 hover:bg-black/5 hover:text-black"
                          title="Open live URL"
                        >
                          <ArrowUpRight size={14} />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteProject(p.id)}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                        title="Delete project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VIEW 2: RESPONSIVE DOSSIER CARDS (Visible on < lg, Phones & Tablets) */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-black/[0.06] bg-[#f0ede6]">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-display font-medium text-black/30">
                        {p.name?.charAt(0) || '•'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#242321]">{p.name}</p>
                    <p className="truncate font-mono text-[10px] text-black/40">/{p.slug}</p>
                  </div>
                </div>

                {/* Micro Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-black/[0.04] px-2 py-0.5 text-[9px] font-medium text-black/60">
                    {p.category || 'Product'}
                  </span>

                  <span
                    className={`rounded px-2 py-0.5 text-[9px] font-medium ${
                      p.healthcareStatus === 'yes'
                        ? 'bg-[#ece7da] text-[#765a2e]'
                        : 'bg-black/[0.04] text-black/45'
                    }`}
                  >
                    {getHealthcareStatusLabel(p.healthcareStatus)}
                  </span>

                  {p.userCount && (
                    <span className="rounded bg-black/[0.04] px-2 py-0.5 text-[9px] font-medium text-black/60">
                      {p.userCount} Users
                    </span>
                  )}
                </div>
              </div>

              {/* Action Ribbon */}
              <div className="mt-4 flex items-center justify-between border-t border-black/[0.05] pt-3">
                <button
                  type="button"
                  onClick={() => togglePublished(p)}
                  className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${
                    p.published ? 'bg-[#242321] text-white' : 'bg-black/[0.06] text-black/45'
                  }`}
                >
                  {p.published ? 'Published' : 'Hidden'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="rounded-md border border-black/10 px-2.5 py-1 text-[10px] font-medium text-black/75 hover:bg-black/5"
                  >
                    Edit
                  </button>

                  {p.officialUrl && (
                    <a
                      href={p.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-black/10 p-1 text-black/60 hover:bg-black/5"
                    >
                      <ArrowUpRight size={12} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteProject(p.id)}
                    className="rounded-md border border-red-200 p-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredProjects.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-black/15 bg-white py-14 text-center">
            <p className="font-display text-lg text-black/40">No projects found</p>
            <p className="mt-1 text-xs text-black/35">Adjust your active filter or search phrase.</p>
          </div>
        )}

      </div>

      {/* =========================================================
          RESPONSIVE ADD / EDIT MODAL
      ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-2 backdrop-blur-xs sm:p-4">
          <div className="my-auto flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#f7f5f0] shadow-2xl">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-5 py-3.5 sm:px-6">
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#9b7a42]">
                  {editingProject ? 'Editor' : 'New Publication'}
                </span>
                <h2 className="font-display text-xl font-medium sm:text-2xl">
                  {editingProject ? editingProject.name : 'Create Project'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-1 text-black/50 hover:bg-black/5 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM BODY (SCROLLABLE) */}
            <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
              
              {/* SECTION 1: IDENTITY */}
              <div className="rounded-xl border border-black/[0.07] bg-white p-4 sm:p-5">
                <SectionHeader number="01" title="Core Identity" />
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Project Name" required>
                    <input
                      type="text"
                      value={projectForm.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder="e.g. MedCare Engine"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Category" required>
                    <select
                      value={projectForm.category}
                      onChange={(e) => updateForm('category', e.target.value)}
                      className={inputClass}
                    >
                      {PROJECT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="URL Slug" hint="Used in /work/:slug">
                    <input
                      type="text"
                      value={projectForm.slug}
                      onChange={(e) => updateForm('slug', e.target.value)}
                      placeholder="medcare-engine"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Duration">
                    <div className="relative">
                      <Clock3
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35"
                      />
                      <input
                        type="text"
                        value={projectForm.duration}
                        onChange={(e) => updateForm('duration', e.target.value)}
                        placeholder="e.g. 4 Months"
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </Field>
                </div>
              </div>

              {/* SECTION 2: GALLERY & COVER */}
              <div className="rounded-xl border border-black/[0.07] bg-white p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <SectionHeader
                    number="02"
                    title="Gallery Images"
                    description="First slot is automatically used as the cover."
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#242321] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-black"
                  >
                    <Upload size={12} /> Add
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelection}
                    className="hidden"
                  />
                </div>

                {projectForm.images.length > 0 ? (
                  <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {projectForm.images.map((item, idx) => (
                      <div
                        key={item.id}
                        className="group relative aspect-video overflow-hidden rounded-lg border border-black/10 bg-[#f0ede6]"
                      >
                        <img
                          src={item.preview || item.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute left-1.5 top-1.5">
                          {idx === 0 ? (
                            <span className="flex items-center gap-1 rounded bg-[#242321] px-1.5 py-0.5 text-[8px] font-semibold uppercase text-white shadow">
                              <Star size={8} className="fill-current text-[#c6a15b]" /> Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setCoverImage(idx)}
                              className="rounded bg-black/60 px-1 py-0.5 text-[8px] text-white opacity-0 transition group-hover:opacity-100"
                            >
                              Make Cover
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeImage(item.id)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="mt-3 flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-black/15 bg-[#f7f5f0] py-6 hover:border-black/30"
                  >
                    <ImagePlus size={20} className="text-black/35" />
                    <p className="mt-1 text-xs font-semibold text-black/60">Upload screenshots</p>
                  </button>
                )}

                <div className="mt-3 border-t border-black/[0.05] pt-3">
                  <Field label="YouTube Tour URL">
                    <input
                      type="url"
                      value={projectForm.youtubeUrl}
                      onChange={(e) => updateForm('youtubeUrl', e.target.value)}
                      placeholder="https://youtu.be/... or https://youtube.com/watch?v=..."
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              {/* SECTION 3: TECH STACK & ACCESS */}
              <div className="rounded-xl border border-black/[0.07] bg-white p-4 sm:p-5">
                <SectionHeader number="03" title="Tech Stack & Authorization" />
                <div className="mt-3 space-y-3">
                  <Field label="Add Stack" hint="Press Enter">
                    <input
                      type="text"
                      onKeyDown={addTechStack}
                      placeholder="React, Next.js, Node.js..."
                      className={inputClass}
                    />
                  </Field>

                  {projectForm.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {projectForm.techStack.map((stack) => (
                        <span
                          key={stack}
                          className="inline-flex items-center gap-1 rounded bg-[#f7f5f0] px-2 py-0.5 text-[10px] text-black/75"
                        >
                          {stack}
                          <button
                            type="button"
                            onClick={() => removeTechStack(stack)}
                            className="text-black/40 hover:text-black"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="User Scale / Reach">
                      <input
                        type="number"
                        value={projectForm.userCount}
                        onChange={(e) => updateForm('userCount', e.target.value)}
                        placeholder="e.g. 1000"
                        className={inputClass}
                      />
                    </Field>

                    <div className="flex flex-col justify-end">
                      <label className="flex h-9 items-center justify-between rounded-xl border border-black/10 bg-[#f7f5f0]/50 px-3 text-xs">
                        <span>Requires Auth/Login?</span>
                        <input
                          type="checkbox"
                          checked={projectForm.requiresLogin}
                          onChange={(e) => updateForm('requiresLogin', e.target.checked)}
                          className="h-4 w-4 accent-black"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: HEALTHCARE ALLOCATION */}
              <div className="rounded-xl border border-black/[0.07] bg-white p-4 sm:p-5">
                <SectionHeader number="04" title="Healthcare Pledge" />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <ChoicePill
                    active={projectForm.healthcareStatus === 'yes'}
                    onClick={() => {
                      const alloc = getHealthcareAllocation(projectForm.projectAmount)
                      setProjectForm((c) => ({
                        ...c,
                        healthcareStatus: 'yes',
                        healthcareAllocation: alloc || '',
                      }))
                    }}
                  >
                    Yes
                  </ChoicePill>

                  <ChoicePill
                    active={projectForm.healthcareStatus === 'earlier-work'}
                    onClick={() =>
                      setProjectForm((c) => ({
                        ...c,
                        healthcareStatus: 'earlier-work',
                        healthcareAllocation: '',
                        amountUtilised: '',
                      }))
                    }
                  >
                    Earlier
                  </ChoicePill>

                  <ChoicePill
                    active={projectForm.healthcareStatus === 'not-applicable'}
                    onClick={() =>
                      setProjectForm((c) => ({
                        ...c,
                        healthcareStatus: 'not-applicable',
                        healthcareAllocation: '',
                        amountUtilised: '',
                      }))
                    }
                  >
                    N/A
                  </ChoicePill>
                </div>

                {projectForm.healthcareStatus === 'yes' && (
                  <div className="mt-3 grid grid-cols-1 gap-3 border-t border-black/[0.05] pt-3 sm:grid-cols-3">
                    <Field label="Total Deal (INR)">
                      <input
                        type="number"
                        value={projectForm.projectAmount}
                        onChange={(e) => updateProjectAmount(e.target.value)}
                        placeholder="100000"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="70% Allocation">
                      <input
                        type="text"
                        value={formatCurrency(projectForm.healthcareAllocation)}
                        readOnly
                        className={`${inputClass} bg-black/5 font-semibold`}
                      />
                    </Field>

                    <Field label="Amount Utilised">
                      <input
                        type="number"
                        value={projectForm.amountUtilised}
                        onChange={(e) => updateForm('amountUtilised', e.target.value)}
                        placeholder="50000"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                )}
              </div>

              {/* SECTION 5: EXTERNAL URLS */}
              <div className="rounded-xl border border-black/[0.07] bg-white p-4 sm:p-5">
                <SectionHeader number="05" title="Deployment Links" />
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Official URL">
                    <input
                      type="url"
                      value={projectForm.officialUrl}
                      onChange={(e) => updateForm('officialUrl', e.target.value)}
                      placeholder="https://..."
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Demo Platform URL">
                    <input
                      type="url"
                      value={projectForm.demoUrl}
                      onChange={(e) => updateForm('demoUrl', e.target.value)}
                      placeholder="https://demo..."
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="flex items-center justify-between border-t border-black/[0.08] bg-white px-5 py-3">
              <span className="font-mono text-[10px] text-black/45">
                {uploadingImages
                  ? 'Transferring media...'
                  : saving
                    ? 'Writing database...'
                    : 'Ready'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-black/15 bg-white px-3.5 py-1.5 text-xs font-medium text-black/70 hover:bg-neutral-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={editingProject ? handleUpdate : handleCreate}
                  disabled={saving || uploadingImages}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#242321] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black disabled:opacity-50"
                >
                  {saving || uploadingImages ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}
                  {editingProject ? 'Save' : 'Publish'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

/* =============================================================
    SHARED STYLES & SUBCOMPONENTS
============================================================= */

const inputClass =
  'h-9 w-full rounded-xl border border-black/10 bg-[#f7f5f0]/50 px-3 text-xs text-[#242321] outline-none transition placeholder:text-black/30 focus:border-[#9b7a42] focus:bg-white'

function Field({ label, required, hint, children }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <label className="font-medium text-black/75">
          {label} {required && <span className="text-[#9b7a42]">*</span>}
        </label>
        {hint && <span className="font-mono text-[9px] text-black/35">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function SectionHeader({ number, title, description }) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[10px] font-bold text-[#9b7a42]">{number}</span>
        <h3 className="font-display text-sm font-semibold text-[#242321]">{title}</h3>
      </div>
      {description && <p className="mt-0.5 text-[10px] text-black/45">{description}</p>}
    </div>
  )
}

function ChoicePill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border py-1.5 text-[11px] font-medium transition ${
        active
          ? 'border-black bg-black text-white'
          : 'border-black/10 bg-[#f7f5f0] text-black/60 hover:border-black/20'
      }`}
    >
      {children}
    </button>
  )
}