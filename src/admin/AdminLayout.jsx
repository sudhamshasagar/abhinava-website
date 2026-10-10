import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquareQuote,
  HeartHandshake,
  PanelBottom,
  BriefcaseBusiness,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

import { useAuth } from '../context/AuthContext'

const navigation = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Projects',
    path: '/admin/projects',
    icon: FolderKanban,
  },
  {
    label: 'Testimonials',
    path: '/admin/testimonials',
    icon: MessageSquareQuote,
  },
  {
    label: 'What We Do',
    path: '/admin/services',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Healthcare Ledger',
    path: '/admin/ledger',
    icon: HeartHandshake,
  },
  {
    label: 'Footer Settings',
    path: '/admin/footer',
    icon: PanelBottom,
  },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Derive active label for mobile and topbar breadcrumbs
  const currentNav =
    navigation.find((item) =>
      item.end
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path)
    ) || navigation[0]

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#242321] antialiased">
      {/* =========================================================
          TOP BAR (MOBILE & TABLET HEADER)
      ========================================================= */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-black/[0.08] bg-[#f7f5f0]/90 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-semibold tracking-[0.16em]">
            ABHINAVA
          </span>
          <span className="text-black/30">/</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#9b7837]">
            {currentNav.label}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white/70 text-[#242321] transition hover:bg-black/5"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* =========================================================
            DESKTOP & MOBILE SIDEBAR
        ========================================================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-black/[0.08] bg-[#f7f5f0] transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Brand Header */}
          <div className="flex h-14 items-center justify-between border-b border-black/[0.08] px-5">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#9b7837]" />
                <span className="font-display text-sm font-semibold tracking-[0.18em]">
                  ABHINAVA
                </span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#9b7837]">
                Management Portal
              </span>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-md p-1 text-black/40 hover:bg-black/5 hover:text-black lg:hidden"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-2.5 py-4">
            <div className="px-2 pb-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/35">
                Core Sections
              </span>
            </div>

            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#242321] text-white shadow-xs'
                        : 'text-[#242321]/65 hover:bg-white/80 hover:text-[#242321]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={15}
                        strokeWidth={isActive ? 2 : 1.5}
                        className={
                          isActive
                            ? 'text-[#c6a15b]'
                            : 'text-black/40 group-hover:text-black/70'
                        }
                      />
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#c6a15b]" />
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Footer User Strip */}
          <div className="border-t border-black/[0.08] bg-white/40 p-2.5">
            <div className="flex items-center gap-2.5 rounded-lg border border-black/[0.06] bg-white p-2">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-8 w-8 rounded-md object-cover border border-black/5"
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#242321] font-mono text-[11px] font-semibold text-white">
                  {user?.displayName?.charAt(0) || 'A'}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold leading-tight text-[#242321]">
                  {user?.displayName || 'Administrator'}
                </p>
                <p className="truncate font-mono text-[9px] text-black/40">
                  {user?.email || 'System user'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-7 w-7 items-center justify-center rounded-md text-black/40 transition hover:bg-red-50 hover:text-red-600"
                title="Sign out"
              >
                <LogOut size={13} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile drawers */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-2xs lg:hidden"
          />
        )}

        {/* =========================================================
            MAIN OUTLET CONTAINER
        ========================================================= */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Subtle Desktop Breadcrumb Ribbon */}
          <div className="hidden h-10 items-center justify-between border-b border-black/[0.05] bg-white/30 px-6 lg:flex">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-black/40">
              <span>Admin</span>
              <ChevronRight size={10} />
              <span className="font-semibold text-[#242321]">
                {currentNav.label}
              </span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[9px] uppercase tracking-wider text-[#9b7837] transition hover:underline"
            >
              Preview Live Site ↗
            </a>
          </div>

          {/* Dynamic Content View */}
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}