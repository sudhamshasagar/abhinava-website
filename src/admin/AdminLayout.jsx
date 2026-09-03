import { NavLink, Outlet, useNavigate } from 'react-router-dom'
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
    label: 'Footer',
    path: '/admin/footer',
    icon: PanelBottom,
  },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#242321]">

      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/10 bg-[#f7f5f0]/95 px-5 backdrop-blur-md lg:hidden">

        <a
          href="/"
          className="font-display text-lg font-semibold tracking-[0.16em]"
        >
          ABHINAVA
        </a>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/[0.04]"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>

      </header>


      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-black/10 bg-[#f7f5f0] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }`}
        >

          <div className="flex h-full flex-col">

            {/* Brand */}
            <div className="border-b border-black/10 px-6 py-7">

              <a
                href="/"
                className="font-display text-xl font-semibold tracking-[0.16em]"
              >
                ABHINAVA
              </a>

              <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-[#9b7a42]">
                Administration
              </p>

            </div>


            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-6">

              {navigation.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                        isActive
                          ? 'bg-[#242321] text-white'
                          : 'text-black/50 hover:bg-black/[0.04] hover:text-black'
                      }`
                    }
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.5}
                    />

                    <span>{item.label}</span>
                  </NavLink>
                )
              })}

            </nav>


            {/* User */}
            <div className="border-t border-black/10 p-4">

              <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3">

                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs text-white">
                    {user?.displayName?.charAt(0) || 'A'}
                  </div>
                )}

                <div className="min-w-0 flex-1">

                  <p className="truncate text-xs font-medium">
                    {user?.displayName || 'Administrator'}
                  </p>

                  <p className="truncate text-[10px] text-black/35">
                    {user?.email || ''}
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-black/45 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut
                  size={16}
                  strokeWidth={1.5}
                />

                Sign out
              </button>

            </div>

          </div>

        </aside>


        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          />
        )}


        {/* Content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  )
}