import { useEffect, useMemo, useState } from 'react'
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  setTestimonialPublished,
  deleteTestimonial,
} from '../firebase/testimonials'
import { auth } from '../firebase/config'

import {
  Plus,
  Search,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  MessageSquareQuote,
  SlidersHorizontal,
  Building2,
  User,
  Quote,
} from 'lucide-react'

const EMPTY_TESTIMONIAL = {
  quote: '',
  name: '',
  role: '',
  company: '',
  published: true,
}

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(EMPTY_TESTIMONIAL)

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getAllTestimonials()
      setTestimonials(data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to fetch testimonials from database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    return testimonials.filter((item) => {
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.company?.toLowerCase().includes(q) ||
        item.quote?.toLowerCase().includes(q)

      const matchesFilter =
        filter === 'All' ||
        (filter === 'Published' && item.published) ||
        (filter === 'Hidden' && !item.published)

      return matchesSearch && matchesFilter
    })
  }, [testimonials, search, filter])

  const handleOpenAdd = () => {
    setEditingItem(null)
    setForm(EMPTY_TESTIMONIAL)
    setError('')
    setShowModal(true)
  }

  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setForm({
      quote: item.quote || '',
      name: item.name || '',
      role: item.role || '',
      company: item.company || '',
      published: item.published ?? true,
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.quote.trim()) {
      setError('Client Name and Feedback Quote are required.')
      return
    }

    try {
      setSaving(true)
      setError('')

      if (!auth.currentUser) {
        throw new Error('You must be logged in as admin to save changes.')
      }

      if (editingItem) {
        await updateTestimonial(editingItem.id, form)
      } else {
        await createTestimonial(form)
      }

      await loadData()
      setShowModal(false)
      setForm(EMPTY_TESTIMONIAL)
      setEditingItem(null)
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Failed to save testimonial.')
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePublished = async (item) => {
    try {
      await setTestimonialPublished(item.id, !item.published)
      await loadData()
    } catch (err) {
      setError('Failed to update published status.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client testimonial?')) return
    try {
      await deleteTestimonial(id)
      await loadData()
    } catch (err) {
      setError('Failed to delete testimonial.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f0] text-[#242321]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-[#9b7837]" />
          <p className="font-mono text-xs uppercase tracking-widest text-black/50">
            Syncing Feedback...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] px-3 py-6 text-[#242321] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <header className="flex flex-col gap-4 border-b border-black/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#c6a15b]" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9b7837]">
                Reputation Management
              </p>
            </div>
            <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-[#242321] sm:text-4xl">
              Client Testimonials
            </h1>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#242321] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-black"
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Testimonial
          </button>
        </header>

        {/* ERROR PROMPT */}
        {error && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* CONTROLS */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by client or text..."
                className="h-9 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-xs outline-none focus:border-[#9b7837]"
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
                className="h-9 w-full appearance-none rounded-xl border border-black/10 bg-white pl-8 pr-7 text-xs font-medium outline-none focus:border-[#9b7837] sm:w-auto"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published Only</option>
                <option value="Hidden">Hidden Only</option>
              </select>
            </div>
          </div>

          <div className="font-mono text-[10px] text-black/45">
            Showing <strong className="text-black">{filteredItems.length}</strong> testimonials
          </div>
        </div>

        {/* LIST / GRID VIEW */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-5 shadow-2xs transition-all hover:border-[#c6a15b]/50 hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                  <span className="flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#9b7837]">
                    <MessageSquareQuote size={12} /> Testimonial
                  </span>

                  <button
                    type="button"
                    onClick={() => handleTogglePublished(item)}
                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold transition ${
                      item.published
                        ? 'bg-[#242321] text-white hover:bg-black'
                        : 'bg-black/[0.05] text-black/45 hover:bg-black/10'
                    }`}
                  >
                    {item.published ? 'Published' : 'Hidden'}
                  </button>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-[#242321]/80 italic line-clamp-4">
                  “{item.quote}”
                </p>

                <div className="mt-4 border-t border-black/[0.05] pt-3">
                  <p className="text-sm font-semibold text-[#242321]">{item.name}</p>
                  <p className="text-[11px] text-black/50">
                    {item.role || 'Client'}
                    {item.company ? ` • ${item.company}` : ''}
                  </p>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="mt-5 flex items-center justify-end gap-1.5 border-t border-black/[0.05] pt-3">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1 text-[11px] font-medium text-black/75 hover:bg-black/5"
                >
                  <Pencil size={11} /> Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-black/15 bg-white py-14 text-center">
            <Quote size={28} className="mx-auto text-black/20" />
            <p className="mt-2 font-display text-lg text-black/40">No testimonials found</p>
            <p className="text-xs text-black/35">Click &ldquo;Add Testimonial&rdquo; to create your first client entry.</p>
          </div>
        )}

      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-[#f7f5f0] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-6 py-4">
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#9b7837]">
                  {editingItem ? 'Edit Feedback' : 'New Feedback'}
                </span>
                <h2 className="font-display text-xl font-medium">
                  {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-black/50 hover:bg-black/5"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-xs font-medium text-black/75">
                  Client Quote / Review <span className="text-[#9b7837]">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  placeholder="Enter verbatim or polished client endorsement..."
                  className="w-full rounded-xl border border-black/10 bg-white p-3 text-xs leading-relaxed outline-none focus:border-[#9b7837]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-black/75">
                    Client Name <span className="text-[#9b7837]">*</span>
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="h-9 w-full rounded-xl border border-black/10 bg-white pl-8 pr-3 text-xs outline-none focus:border-[#9b7837]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-black/75">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Managing Director"
                    className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-xs outline-none focus:border-[#9b7837]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-black/75">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Apex Health Logistics"
                    className="h-9 w-full rounded-xl border border-black/10 bg-white pl-8 pr-3 text-xs outline-none focus:border-[#9b7837]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-3.5 py-2.5">
                <span className="text-xs text-black/70">Publish directly to public site</span>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="h-4 w-4 accent-black"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="rounded-xl border border-black/15 bg-white px-4 py-2 text-xs font-medium hover:bg-neutral-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#242321] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-black disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}
                  {editingItem ? 'Save Changes' : 'Publish Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}