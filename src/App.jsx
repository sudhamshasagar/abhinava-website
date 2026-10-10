import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

import Navigation from './components/Navigation'
import Footer from './components/Footer'

import Hero from './sections/Hero'
import Mission from './sections/Mission'
import HealthcareCommitment from './sections/HealthcareCommitment'
import Services from './sections/Services'
import Projects from './sections/Projects'
import Testimonials from './sections/Testimonials'

import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import ProjectManagement from './admin/ProjectManagement'
import TestimonialManagement from './admin/TestimonialManagement'
import AdminPlaceholder from './admin/AdminPlaceholder'

import { useAuth } from './context/AuthContext'

function Home() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Navigation />

      <main>
        <Hero />
        <Services />
        <Projects />
        <HealthcareCommitment />
        <Testimonials />
      </main>

      <Footer />
    </div>
  )
}

function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      // A premium, breathing loader instead of a generic spinning circle
      <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-charcoal">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute h-full w-full animate-ping rounded-full bg-charcoal/10 opacity-75"></span>
            <span className="relative h-2 w-2 rounded-full bg-charcoal/40"></span>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-charcoal/40">
            Authenticating
          </p>
        </div>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function NotFound() {
  return (
    // An art-gallery style 404 page. Massive, faint numbers with elegant serif typography.
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center text-charcoal sm:px-8">
      <h1 className="font-display text-[8rem] font-light leading-none tracking-tighter text-charcoal/5 sm:text-[14rem]">
        404
      </h1>
      
      <div className="-mt-6 sm:-mt-10">
        <p className="font-serif text-2xl font-medium italic text-charcoal sm:text-3xl">
          Page not found.
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-charcoal/60">
          The page you are looking for doesn't exist, has been moved, or is currently unavailable.
        </p>
      </div>

      <a
        href="/"
        className="mt-10 inline-flex items-center gap-2 border-b border-charcoal/20 pb-1 text-sm font-medium text-charcoal transition-colors hover:border-charcoal"
      >
        Return to Homepage
      </a>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<Home />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminLayout />
            </ProtectedAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="testimonials" element={<TestimonialManagement/>}/>
          <Route path="testimonials" element={<AdminPlaceholder />} />
          <Route path="services" element={<AdminPlaceholder />} />
          <Route path="ledger" element={<AdminPlaceholder />} />
          <Route path="footer" element={<AdminPlaceholder />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}