import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Hero from './sections/Hero'
import Mission from './sections/Mission'
import HealthcareCommitment from './sections/HealthcareCommitment'
import Services from './sections/Services'
import Projects from './sections/Projects'
import Testimonials from './sections/Testimonials'
import Footer from './components/Footer'

function Home() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Navigation />

      <main>
        <Hero />

        <Services />

        <section
          id="work"
          className="flex min-h-[50vh] items-center justify-center bg-paper px-6"
        >
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">
              Our Work
            </p>

            <h2 className="mt-5 font-display text-4xl sm:text-5xl">
              Work that speaks for itself.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-charcoal/55">
              Explore the websites, software and digital solutions we have
              built along the way.
            </p>
          </div>
        </section>

        <Mission />

        <HealthcareCommitment />
        <Projects/>
        <Testimonials />

        <section
          id="contact"
          className="flex min-h-[45vh] items-center justify-center bg-charcoal px-6 text-center text-ivory"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold-light">
              Have a project?
            </p>

            <h2 className="mt-5 font-display text-5xl sm:text-6xl">
              Let&apos;s build it.
            </h2>

            <p className="mx-auto mt-6 max-w-lg text-ivory/60">
              Tell us what you are trying to build, improve or automate.
            </p>
          </div>
        </section>
        <Footer/>
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory text-charcoal">
      <div className="text-center">
        <p className="font-display text-6xl">404</p>
        <p className="mt-3 text-charcoal/50">Page not found.</p>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}