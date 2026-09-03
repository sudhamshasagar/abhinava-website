import { useEffect, useMemo, useState } from 'react'
import {
  createProject as createProjectInFirebase,
  deleteProject as deleteProjectFromFirebase,
  getProjects,
  setProjectPublished,
  updateProject as updateProjectInFirebase,
} from '../firebase/projects'

import {
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
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
} from 'lucide-react'


const PROJECT_CATEGORIES = [
  'Website',
  'Multi Tenant CRM',
  'Inhouse CRM',
]


const EMPTY_PROJECT = {
  name: '',
  category: 'Website',
  techStack: [],
  officialUrl: '',
  demoUrl: '',
  requiresLogin: false,
  loginNotice:
    'Login access is available only to the client and its authorized users. Please explore the demo to experience the platform without login.',
  images: [],
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
  if (value === '' || value === null || value === undefined) {
    return '—'
  }

  const number = Number(value)

  if (Number.isNaN(number)) {
    return '—'
  }

  return `₹${number.toLocaleString('en-IN')}`
}


function getHealthcareAllocation(projectAmount) {
  const amount = Number(projectAmount)

  if (!amount || amount <= 0) {
    return 0
  }

  return Math.round(amount * 0.7)
}


function getHealthcareStatusLabel(status) {
  switch (status) {
    case 'yes':
      return 'Healthcare'

    case 'earlier-work':
      return 'Earlier Work'

    case 'not-applicable':
      return 'Not Applicable'

    default:
      return 'Pending'
  }
}


export default function ProjectManagement() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT)


  /* =========================================================
     LOAD PROJECTS FROM FIRESTORE
  ========================================================= */

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getProjects()

      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects:', err)

      setError(
        'Unable to load projects. Please check Firebase connection and Firestore permissions.',
      )
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadProjects()
  }, [])


  /* =========================================================
     FILTER PROJECTS
  ========================================================= */

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()

    return projects.filter((project) => {
      if (project.deleted) {
        return false
      }

      const projectName = String(project.name || '').toLowerCase()
      const projectCategory = String(
        project.category || '',
      ).toLowerCase()

      const techStack = Array.isArray(project.techStack)
        ? project.techStack
        : []

      const matchesSearch =
        !query ||
        projectName.includes(query) ||
        projectCategory.includes(query) ||
        techStack.some((stack) =>
          String(stack).toLowerCase().includes(query),
        )

      const matchesFilter =
        filter === 'All' ||
        (filter === 'Published' && project.published) ||
        (filter === 'Hidden' && !project.published) ||
        filter === project.category

      return matchesSearch && matchesFilter
    })
  }, [projects, search, filter])


  /* =========================================================
     FORM HELPERS
  ========================================================= */

  const updateForm = (field, value) => {
    setProjectForm((current) => ({
      ...current,
      [field]: value,
    }))
  }


  const updateProjectAmount = (value) => {
    const allocation = getHealthcareAllocation(value)

    setProjectForm((current) => ({
      ...current,
      projectAmount: value,
      healthcareAllocation:
        current.healthcareStatus === 'yes'
          ? allocation || ''
          : '',
    }))
  }


  const addTechStack = (event) => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    const value = event.currentTarget.value.trim()

    if (!value) {
      return
    }

    if (projectForm.techStack.includes(value)) {
      event.currentTarget.value = ''
      return
    }

    setProjectForm((current) => ({
      ...current,
      techStack: [...current.techStack, value],
    }))

    event.currentTarget.value = ''
  }


  const removeTechStack = (stack) => {
    setProjectForm((current) => ({
      ...current,
      techStack: current.techStack.filter(
        (item) => item !== stack,
      ),
    }))
  }


  /* =========================================================
     CREATE PROJECT
  ========================================================= */

  const createProject = async () => {
    if (!projectForm.name.trim()) {
      setError('Project name is required.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const slug =
        projectForm.slug.trim() ||
        projectForm.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

      const projectData = {
        ...projectForm,
        name: projectForm.name.trim(),
        slug,
        techStack: Array.isArray(projectForm.techStack)
          ? projectForm.techStack
          : [],
        images: Array.isArray(projectForm.images)
          ? projectForm.images
          : [],
        deleted: false,
      }

      await createProjectInFirebase(projectData)

      await loadProjects()

      setShowAddModal(false)
      setProjectForm(EMPTY_PROJECT)
      setOpenMenu(null)
    } catch (err) {
      console.error('Failed to create project:', err)

      setError(
        'Unable to create project. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }


  /* =========================================================
     START EDIT
  ========================================================= */

  const startEdit = (project) => {
    setEditingProject(project)

    setProjectForm({
      ...EMPTY_PROJECT,
      ...project,
      techStack: Array.isArray(project.techStack)
        ? project.techStack
        : [],
      images: Array.isArray(project.images)
        ? project.images
        : [],
      userCount: project.userCount ?? '',
      projectAmount: project.projectAmount ?? '',
      healthcareAllocation:
        project.healthcareAllocation ?? '',
      amountUtilised: project.amountUtilised ?? '',
    })

    setOpenMenu(null)
    setError('')
  }


  /* =========================================================
     SAVE EDIT
  ========================================================= */

  const saveEdit = async () => {
    if (!projectForm.name.trim() || !editingProject) {
      return
    }

    try {
      setSaving(true)
      setError('')

      const slug =
        projectForm.slug.trim() ||
        projectForm.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

      const projectData = {
        ...projectForm,
        name: projectForm.name.trim(),
        slug,
        techStack: Array.isArray(projectForm.techStack)
          ? projectForm.techStack
          : [],
        images: Array.isArray(projectForm.images)
          ? projectForm.images
          : [],
      }

      await updateProjectInFirebase(
        editingProject.id,
        projectData,
      )

      await loadProjects()

      setEditingProject(null)
      setProjectForm(EMPTY_PROJECT)
      setOpenMenu(null)
    } catch (err) {
      console.error('Failed to update project:', err)

      setError(
        'Unable to update project. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }


  /* =========================================================
     PUBLISH / HIDE
  ========================================================= */

  const togglePublished = async (project) => {
    try {
      setError('')

      await setProjectPublished(
        project.id,
        !project.published,
      )

      await loadProjects()

      setOpenMenu(null)
    } catch (err) {
      console.error(
        'Failed to update project publishing status:',
        err,
      )

      setError(
        'Unable to update publishing status.',
      )
    }
  }


  /* =========================================================
     DELETE PROJECT
  ========================================================= */

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      'Delete this project? It will be removed from the management list.',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteProjectFromFirebase(id)

      await loadProjects()

      setOpenMenu(null)
    } catch (err) {
      console.error('Failed to delete project:', err)

      setError(
        'Unable to delete project. Please try again.',
      )
    }
  }


  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const closeModal = () => {
    setShowAddModal(false)
    setEditingProject(null)
    setProjectForm(EMPTY_PROJECT)
    setError('')
  }


  const isModalOpen =
    showAddModal || Boolean(editingProject)


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] px-6 py-8 text-[#242321] lg:px-10">
        <div className="mx-auto max-w-7xl">

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#9b7a42]">
            Abhinava Admin
          </p>

          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            Project Management
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
            Loading projects from Firestore...
          </p>

          <div className="mt-10 h-32 animate-pulse rounded-2xl bg-black/[0.04]" />

        </div>
      </div>
    )
  }


  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#f7f5f0] px-6 py-8 text-[#242321] lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-[11px] uppercase tracking-[0.3em] text-[#9b7a42]">
              Abhinava Admin
            </p>

            <h1 className="mt-3 font-display text-4xl sm:text-5xl">
              Project Management
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
              Manage the projects displayed on the Abhinava public website.
            </p>

          </div>


          <button
            type="button"
            onClick={() => {
              setProjectForm(EMPTY_PROJECT)
              setEditingProject(null)
              setError('')
              setShowAddModal(true)
            }}
            className="flex w-fit items-center gap-2 rounded-full bg-[#242321] px-5 py-3 text-sm text-white transition hover:bg-black"
          >
            <Plus size={17} strokeWidth={1.6} />
            Add Project
          </button>

        </div>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* =====================================================
            CONTROLS
        ===================================================== */}

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* Search */}

            <div className="relative">

              <Search
                size={17}
                strokeWidth={1.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search projects..."
                className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#9b7a42] sm:w-72"
              />

            </div>


            {/* Filter */}

            <div className="relative">

              <SlidersHorizontal
                size={16}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value)
                }
                className="h-11 appearance-none rounded-xl border border-black/10 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#9b7a42]"
              >
                <option value="All">
                  All Projects
                </option>

                <option value="Published">
                  Published
                </option>

                <option value="Hidden">
                  Hidden
                </option>

                {PROJECT_CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

            </div>

          </div>


          {/* Count */}

          <div className="flex items-center gap-3 text-sm text-black/45">

            <span>Total Projects</span>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-white px-3 font-medium text-black">
              {filteredProjects.length}
            </span>

          </div>

        </div>


        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">

          <div className="hidden overflow-x-auto lg:block">

            <table className="w-full border-collapse text-left">

              <thead>

                <tr className="border-b border-black/10 text-[11px] uppercase tracking-[0.18em] text-black/35">

                  <th className="px-6 py-4 font-medium">
                    Project
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Category
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Users
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Healthcare
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredProjects.map((project) => (

                  <tr
                    key={project.id}
                    className="border-b border-black/[0.06] last:border-b-0"
                  >

                    {/* Project */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-lg bg-[#f0ede6]">

                          {project.images?.[0] ? (
                            <img
                              src={project.images[0]}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="font-display text-lg text-black/15">
                              {project.name?.charAt(0) || '?'}
                            </span>
                          )}

                        </div>


                        <div>

                          <p className="font-medium">
                            {project.name}
                          </p>

                          <p className="mt-1 text-xs text-black/35">
                            /work/{project.slug}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Category */}

                    <td className="px-6 py-5 text-sm text-black/55">
                      {project.category || '—'}
                    </td>


                    {/* Users */}

                    <td className="px-6 py-5 text-sm text-black/55">
                      {project.userCount || '—'}
                    </td>


                    {/* Healthcare */}

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs ${
                          project.healthcareStatus === 'yes'
                            ? 'bg-[#ece7da] text-[#765a2e]'
                            : 'bg-black/[0.04] text-black/45'
                        }`}
                      >
                        {getHealthcareStatusLabel(
                          project.healthcareStatus,
                        )}
                      </span>

                    </td>


                    {/* Status */}

                    <td className="px-6 py-5">

                      <button
                        type="button"
                        onClick={() =>
                          togglePublished(project)
                        }
                        className={`rounded-full px-3 py-1 text-xs ${
                          project.published
                            ? 'bg-black text-white'
                            : 'bg-black/[0.05] text-black/45'
                        }`}
                      >
                        {project.published
                          ? 'Published'
                          : 'Hidden'}
                      </button>

                    </td>


                    {/* Actions */}

                    <td className="relative px-6 py-5 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === project.id
                              ? null
                              : project.id,
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/[0.05]"
                        aria-label={`Actions for ${project.name}`}
                      >
                        <MoreHorizontal
                          size={18}
                          strokeWidth={1.5}
                        />
                      </button>


                      {openMenu === project.id && (

                        <div className="absolute right-6 top-14 z-20 w-48 rounded-xl border border-black/10 bg-white p-1.5 text-left shadow-xl">

                          {/* Edit */}

                          <button
                            type="button"
                            onClick={() =>
                              startEdit(project)
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-black/[0.04]"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>


                          {/* Preview */}

                          <a
                            href={
                              project.officialUrl || '#'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-black/[0.04]"
                            onClick={() =>
                              setOpenMenu(null)
                            }
                          >
                            <ExternalLink size={15} />
                            Preview
                          </a>


                          {/* Publish / Hide */}

                          <button
                            type="button"
                            onClick={() =>
                              togglePublished(project)
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-black/[0.04]"
                          >
                            {project.published ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}

                            {project.published
                              ? 'Hide'
                              : 'Publish'}
                          </button>


                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              deleteProject(project.id)
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>

                        </div>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* ===================================================
              MOBILE CARDS
          =================================================== */}

          <div className="divide-y divide-black/[0.06] lg:hidden">

            {filteredProjects.map((project) => (

              <div
                key={project.id}
                className="p-5"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-14 items-center justify-center overflow-hidden rounded-lg bg-[#f0ede6]">

                      {project.images?.[0] ? (
                        <img
                          src={project.images[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-display text-lg text-black/20">
                          {project.name?.charAt(0) || '?'}
                        </span>
                      )}

                    </div>


                    <div>

                      <p className="font-medium">
                        {project.name}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        {project.category}
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === project.id
                          ? null
                          : project.id,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/[0.05]"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                </div>


                <div className="mt-5 grid grid-cols-2 gap-4">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-black/30">
                      Users
                    </p>

                    <p className="mt-1 text-sm">
                      {project.userCount || '—'}
                    </p>

                  </div>


                  <div>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-black/30">
                      Healthcare
                    </p>

                    <p className="mt-1 text-sm">
                      {getHealthcareStatusLabel(
                        project.healthcareStatus,
                      )}
                    </p>

                  </div>

                </div>


                <div className="mt-5">

                  <button
                    type="button"
                    onClick={() =>
                      togglePublished(project)
                    }
                    className={`rounded-full px-3 py-1 text-xs ${
                      project.published
                        ? 'bg-black text-white'
                        : 'bg-black/[0.05] text-black/45'
                    }`}
                  >
                    {project.published
                      ? 'Published'
                      : 'Hidden'}
                  </button>

                </div>


                {openMenu === project.id && (

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-black/[0.06] pt-4">

                    <button
                      type="button"
                      onClick={() =>
                        startEdit(project)
                      }
                      className="flex items-center gap-2 rounded-lg bg-black/[0.04] px-3 py-2 text-xs"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>


                    <a
                      href={
                        project.officialUrl || '#'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        setOpenMenu(null)
                      }
                      className="flex items-center gap-2 rounded-lg bg-black/[0.04] px-3 py-2 text-xs"
                    >
                      <ExternalLink size={14} />
                      Preview
                    </a>


                    <button
                      type="button"
                      onClick={() =>
                        togglePublished(project)
                      }
                      className="flex items-center gap-2 rounded-lg bg-black/[0.04] px-3 py-2 text-xs"
                    >
                      {project.published ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}

                      {project.published
                        ? 'Hide'
                        : 'Publish'}
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        deleteProject(project.id)
                      }
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>


          {/* Empty State */}

          {filteredProjects.length === 0 && (

            <div className="px-6 py-20 text-center">

              <p className="font-display text-2xl">
                No projects found.
              </p>

              <p className="mt-2 text-sm text-black/40">
                Try changing your search or filter.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* =======================================================
          ADD / EDIT MODAL
      ======================================================= */}

      {isModalOpen && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-8 backdrop-blur-sm">

          <div className="mx-auto max-w-4xl rounded-2xl bg-[#f7f5f0] shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 sm:px-8">

              <div>

                <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b7a42]">
                  {editingProject
                    ? 'Edit Project'
                    : 'New Project'}
                </p>

                <h2 className="mt-2 font-display text-3xl">
                  {editingProject
                    ? editingProject.name
                    : 'Add Project'}
                </h2>

              </div>


              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/[0.05]"
              >
                <X size={19} />
              </button>

            </div>


            <div className="space-y-10 px-6 py-8 sm:px-8">

              {/* =================================================
                  01 BASIC INFORMATION
              ================================================= */}

              <section>

                <SectionHeading
                  number="01"
                  title="Basic Information"
                  description="Define the project and how it should be presented."
                />

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  <Field
                    label="Project Name"
                    required
                  >
                    <input
                      type="text"
                      value={projectForm.name}
                      onChange={(event) =>
                        updateForm(
                          'name',
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Keshava CRM"
                      className={inputClass}
                    />
                  </Field>


                  <Field
                    label="Category"
                    required
                  >
                    <select
                      value={projectForm.category}
                      onChange={(event) =>
                        updateForm(
                          'category',
                          event.target.value,
                        )
                      }
                      className={inputClass}
                    >
                      {PROJECT_CATEGORIES.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        ),
                      )}
                    </select>
                  </Field>


                  <Field
                    label="URL Slug"
                    hint="Used for the public project URL."
                  >
                    <input
                      type="text"
                      value={projectForm.slug}
                      onChange={(event) =>
                        updateForm(
                          'slug',
                          event.target.value,
                        )
                      }
                      placeholder="keshava-crm"
                      className={inputClass}
                    />
                  </Field>


                  <Field label="Development Duration">

                    <div className="relative">

                      <Clock3
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                      />

                      <input
                        type="text"
                        value={projectForm.duration}
                        onChange={(event) =>
                          updateForm(
                            'duration',
                            event.target.value,
                          )
                        }
                        placeholder="e.g. 4 months"
                        className={`${inputClass} pl-11`}
                      />

                    </div>

                  </Field>

                </div>

              </section>


              {/* =================================================
                  02 TECHNOLOGY
              ================================================= */}

              <section>

                <SectionHeading
                  number="02"
                  title="Technology"
                  description="Add the technologies used to build the project."
                />

                <div className="mt-6">

                  <Field
                    label="Tech Stack"
                    hint="Type a technology and press Enter."
                  >

                    <input
                      type="text"
                      onKeyDown={addTechStack}
                      placeholder="React, Firebase, Tailwind CSS..."
                      className={inputClass}
                    />

                  </Field>


                  {projectForm.techStack.length > 0 && (

                    <div className="mt-3 flex flex-wrap gap-2">

                      {projectForm.techStack.map(
                        (stack) => (

                          <button
                            type="button"
                            key={stack}
                            onClick={() =>
                              removeTechStack(stack)
                            }
                            className="flex items-center gap-2 rounded-full bg-black/[0.06] px-3 py-1.5 text-xs"
                          >
                            {stack}
                            <X size={12} />
                          </button>

                        ),
                      )}

                    </div>

                  )}

                </div>

              </section>


              {/* =================================================
                  03 LINKS & ACCESS
              ================================================= */}

              <section>

                <SectionHeading
                  number="03"
                  title="Links & Access"
                  description="Control where visitors can explore the project."
                />

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  <Field label="Official Project URL">

                    <div className="relative">

                      <LinkIcon
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                      />

                      <input
                        type="url"
                        value={projectForm.officialUrl}
                        onChange={(event) =>
                          updateForm(
                            'officialUrl',
                            event.target.value,
                          )
                        }
                        placeholder="https://..."
                        className={`${inputClass} pl-11`}
                      />

                    </div>

                  </Field>


                  <Field
                    label="Demo URL"
                    hint="Optional."
                  >

                    <div className="relative">

                      <LinkIcon
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                      />

                      <input
                        type="url"
                        value={projectForm.demoUrl}
                        onChange={(event) =>
                          updateForm(
                            'demoUrl',
                            event.target.value,
                          )
                        }
                        placeholder="https://..."
                        className={`${inputClass} pl-11`}
                      />

                    </div>

                  </Field>

                </div>


                <div className="mt-6 rounded-xl border border-black/10 bg-white p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-sm font-medium">
                        Is login required?
                      </p>

                      <p className="mt-1 text-xs leading-5 text-black/40">
                        Tell visitors whether this project requires
                        authorized access.
                      </p>

                    </div>


                    <div className="flex rounded-lg bg-black/[0.04] p-1">

                      <button
                        type="button"
                        onClick={() =>
                          updateForm(
                            'requiresLogin',
                            true,
                          )
                        }
                        className={`rounded-md px-5 py-2 text-xs transition ${
                          projectForm.requiresLogin
                            ? 'bg-black text-white'
                            : 'text-black/45'
                        }`}
                      >
                        Yes
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          updateForm(
                            'requiresLogin',
                            false,
                          )
                        }
                        className={`rounded-md px-5 py-2 text-xs transition ${
                          !projectForm.requiresLogin
                            ? 'bg-black text-white'
                            : 'text-black/45'
                        }`}
                      >
                        No
                      </button>

                    </div>

                  </div>


                  {projectForm.requiresLogin && (

                    <div className="mt-5 border-t border-black/[0.06] pt-5">

                      <Field label="Client Login Notice">

                        <textarea
                          value={
                            projectForm.loginNotice
                          }
                          onChange={(event) =>
                            updateForm(
                              'loginNotice',
                              event.target.value,
                            )
                          }
                          rows={3}
                          className={textareaClass}
                        />

                      </Field>

                    </div>

                  )}

                </div>

              </section>


              {/* =================================================
                  04 PROJECT MEDIA
              ================================================= */}

              <section>

                <SectionHeading
                  number="04"
                  title="Project Media"
                  description="Add visual material for the project page."
                />

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  <div className="rounded-xl border border-dashed border-black/15 bg-white p-6">

                    <div className="flex h-32 items-center justify-center rounded-lg bg-[#f0ede6]">

                      <div className="text-center">

                        <ImagePlus
                          size={24}
                          strokeWidth={1.3}
                          className="mx-auto text-black/30"
                        />

                        <p className="mt-3 text-xs text-black/40">
                          Image upload will connect to Firebase Storage
                        </p>

                      </div>

                    </div>


                    <p className="mt-4 text-xs leading-5 text-black/40">
                      Multiple project images will be supported. The first
                      image will become the cover image.
                    </p>

                  </div>


                  <div className="rounded-xl border border-black/10 bg-white p-6">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0ede6]">

                        <ClapperboardIcon
                          size={18}
                          strokeWidth={1.4}
                        />

                      </div>


                      <div>

                        <p className="text-sm font-medium">
                          Project Video
                        </p>

                        <p className="text-xs text-black/40">
                          Optional YouTube video
                        </p>

                      </div>

                    </div>


                    <input
                      type="url"
                      value={projectForm.youtubeUrl}
                      onChange={(event) =>
                        updateForm(
                          'youtubeUrl',
                          event.target.value,
                        )
                      }
                      placeholder="https://youtube.com/watch?v=..."
                      className={`${inputClass} mt-5`}
                    />

                  </div>

                </div>

              </section>


              {/* =================================================
                  05 PROJECT DETAILS
              ================================================= */}

              <section>

                <SectionHeading
                  number="05"
                  title="Project Details"
                  description="Information displayed alongside the project."
                />

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  <Field label="Number of Users">

                    <div className="relative">

                      <Users
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                      />

                      <input
                        type="number"
                        min="0"
                        value={projectForm.userCount}
                        onChange={(event) =>
                          updateForm(
                            'userCount',
                            event.target.value,
                          )
                        }
                        placeholder="e.g. 25"
                        className={`${inputClass} pl-11`}
                      />

                    </div>

                  </Field>

                </div>

              </section>


              {/* =================================================
                  06 HEALTHCARE
              ================================================= */}

              <section>

                <SectionHeading
                  number="06"
                  title="Healthcare Commitment"
                  description="Record how this project relates to Abhinava's healthcare commitment."
                />

                <div className="mt-6 rounded-xl border border-black/10 bg-white p-5">

                  <p className="text-sm font-medium">
                    Was this project utilised for the healthcare commitment?
                  </p>


                  <div className="mt-4 grid gap-3 sm:grid-cols-3">

                    <ChoiceButton
                      active={
                        projectForm.healthcareStatus ===
                        'yes'
                      }
                      onClick={() => {

                        const allocation =
                          getHealthcareAllocation(
                            projectForm.projectAmount,
                          )

                        setProjectForm(
                          (current) => ({
                            ...current,
                            healthcareStatus:
                              'yes',
                            healthcareAllocation:
                              allocation || '',
                          }),
                        )

                      }}
                    >
                      Yes
                    </ChoiceButton>


                    <ChoiceButton
                      active={
                        projectForm.healthcareStatus ===
                        'earlier-work'
                      }
                      onClick={() =>
                        setProjectForm(
                          (current) => ({
                            ...current,
                            healthcareStatus:
                              'earlier-work',
                            healthcareAllocation:
                              '',
                            amountUtilised: '',
                          }),
                        )
                      }
                    >
                      Earlier Work
                    </ChoiceButton>


                    <ChoiceButton
                      active={
                        projectForm.healthcareStatus ===
                        'not-applicable'
                      }
                      onClick={() =>
                        setProjectForm(
                          (current) => ({
                            ...current,
                            healthcareStatus:
                              'not-applicable',
                            healthcareAllocation:
                              '',
                            amountUtilised: '',
                          }),
                        )
                      }
                    >
                      Not Applicable
                    </ChoiceButton>

                  </div>


                  {projectForm.healthcareStatus ===
                    'yes' && (

                    <div className="mt-6 border-t border-black/[0.06] pt-6">

                      <div className="grid gap-5 md:grid-cols-3">

                        <Field label="Project Amount">

                          <input
                            type="number"
                            min="0"
                            value={
                              projectForm.projectAmount
                            }
                            onChange={(event) =>
                              updateProjectAmount(
                                event.target.value,
                              )
                            }
                            placeholder="80000"
                            className={inputClass}
                          />

                        </Field>


                        <Field
                          label="Healthcare Allocation"
                          hint="Automatically calculated at 70%."
                        >

                          <input
                            type="text"
                            value={formatCurrency(
                              projectForm.healthcareAllocation,
                            )}
                            readOnly
                            className={`${inputClass} bg-black/[0.03]`}
                          />

                        </Field>


                        <Field label="Amount Utilised">

                          <input
                            type="number"
                            min="0"
                            value={
                              projectForm.amountUtilised
                            }
                            onChange={(event) =>
                              updateForm(
                                'amountUtilised',
                                event.target.value,
                              )
                            }
                            placeholder="50000"
                            className={inputClass}
                          />

                        </Field>

                      </div>


                      <div className="mt-5 rounded-lg bg-[#f7f5f0] p-4">

                        <div className="flex items-center gap-3">

                          <HeartHandshake
                            size={18}
                            strokeWidth={1.4}
                            className="text-[#9b7a42]"
                          />

                          <p className="text-sm font-medium">
                            Healthcare utilisation
                          </p>

                        </div>


                        <textarea
                          value={
                            projectForm.originNote
                          }
                          onChange={(event) =>
                            updateForm(
                              'originNote',
                              event.target.value,
                            )
                          }
                          rows={4}
                          placeholder="Describe how the healthcare allocation was utilised..."
                          className={`${textareaClass} mt-4`}
                        />

                      </div>

                    </div>

                  )}


                  {projectForm.healthcareStatus ===
                    'earlier-work' && (

                    <div className="mt-6 border-t border-black/[0.06] pt-6">

                      <Field
                        label="Public Note"
                        hint="Explain why this project does not fall under the current Abhinava healthcare commitment."
                      >

                        <textarea
                          value={
                            projectForm.originNote
                          }
                          onChange={(event) =>
                            updateForm(
                              'originNote',
                              event.target.value,
                            )
                          }
                          rows={4}
                          className={textareaClass}
                        />

                      </Field>

                    </div>

                  )}

                </div>

              </section>


              {/* =================================================
                  07 SEO
              ================================================= */}

              <section>

                <SectionHeading
                  number="07"
                  title="SEO"
                  description="Control how this project can be discovered through search."
                />

                <div className="mt-6 space-y-5">

                  <Field label="SEO Title">

                    <input
                      type="text"
                      value={projectForm.seoTitle}
                      onChange={(event) =>
                        updateForm(
                          'seoTitle',
                          event.target.value,
                        )
                      }
                      placeholder="Project Name | Abhinava Softwares"
                      className={inputClass}
                    />

                  </Field>


                  <Field label="SEO Description">

                    <textarea
                      value={
                        projectForm.seoDescription
                      }
                      onChange={(event) =>
                        updateForm(
                          'seoDescription',
                          event.target.value,
                        )
                      }
                      rows={3}
                      placeholder="Describe this project for search engines..."
                      className={textareaClass}
                    />

                  </Field>

                </div>

              </section>


              {/* =================================================
                  08 PUBLISHING
              ================================================= */}

              <section>

                <SectionHeading
                  number="08"
                  title="Publishing"
                  description="Control whether this project appears on the public website."
                />

                <div className="mt-6 rounded-xl border border-black/10 bg-white p-5">

                  <div className="flex items-center justify-between gap-5">

                    <div>

                      <p className="text-sm font-medium">
                        Publish this project
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        Hidden projects remain available in the admin
                        portal but are not shown publicly.
                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        updateForm(
                          'published',
                          !projectForm.published,
                        )
                      }
                      className={`relative h-7 w-12 rounded-full transition ${
                        projectForm.published
                          ? 'bg-black'
                          : 'bg-black/15'
                      }`}
                      aria-label="Toggle project publishing"
                    >

                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                          projectForm.published
                            ? 'left-6'
                            : 'left-1'
                        }`}
                      />

                    </button>

                  </div>

                </div>

              </section>

            </div>


            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-black/10 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-black/10 px-5 py-3 text-sm transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  editingProject
                    ? saveEdit
                    : createProject
                }
                disabled={saving}
                className="rounded-xl bg-black px-6 py-3 text-sm text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? 'Saving...'
                  : editingProject
                    ? 'Save Changes'
                    : 'Add Project'}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}


/* =============================================================
   STYLES
============================================================= */

const inputClass =
  'h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#9b7a42]'


const textareaClass =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-black/25 focus:border-[#9b7a42]'


/* =============================================================
   FIELD
============================================================= */

function Field({
  label,
  required,
  hint,
  children,
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between gap-4">

        <label className="text-xs font-medium text-black/65">

          {label}

          {required && (
            <span className="ml-1 text-[#9b7a42]">
              *
            </span>
          )}

        </label>


        {hint && (
          <span className="text-[10px] text-black/30">
            {hint}
          </span>
        )}

      </div>


      {children}

    </div>
  )
}


/* =============================================================
   SECTION HEADING
============================================================= */

function SectionHeading({
  number,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">

      <span className="font-display text-sm text-[#9b7a42]">
        {number}
      </span>


      <div>

        <h3 className="font-display text-2xl">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-black/40">
          {description}
        </p>

      </div>

    </div>
  )
}


/* =============================================================
   CHOICE BUTTON
============================================================= */

function ChoiceButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm transition ${
        active
          ? 'border-black bg-black text-white'
          : 'border-black/10 bg-[#f7f5f0] text-black/55 hover:border-black/20'
      }`}
    >
      {children}
    </button>
  )
}