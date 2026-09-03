import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { auth } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError('')

      const provider = new GoogleAuthProvider()

      provider.setCustomParameters({
        prompt: 'select_account',
      })

      await signInWithPopup(auth, provider)

      navigate('/admin')
    } catch (err) {
      console.error('Admin login failed:', err)

      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled.')
      } else if (err.code === 'auth/popup-blocked') {
        setError('Your browser blocked the sign-in popup. Please allow popups and try again.')
      } else {
        setError('Unable to sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    navigate('/admin', { replace: true })
    return null
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#f7f5f0] text-[#242321]">

      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-[#9b7a42]/10" />

        <div className="absolute -bottom-56 -left-40 h-[600px] w-[600px] rounded-full border border-[#9b7a42]/10" />

        <div className="absolute left-1/2 top-0 h-full w-px bg-black/[0.035]" />

      </div>


      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">

        {/* Top bar */}
        <div className="flex items-center justify-between">

          <a
            href="/"
            className="font-display text-xl font-semibold tracking-[0.16em]"
          >
            ABHINAVA
          </a>

          <a
            href="/"
            className="flex items-center gap-2 text-xs text-black/40 transition-colors hover:text-black"
          >
            <ArrowLeft size={14} />
            Back to website
          </a>

        </div>


        {/* Main */}
        <div className="flex flex-1 items-center justify-center py-16">

          <div className="w-full max-w-md">

            {/* Brand mark */}
            <div className="flex justify-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#9b7a42]/30">

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9b7a42]/20">

                  <span className="font-display text-lg text-[#9b7a42]">
                    A
                  </span>

                </div>

              </div>

            </div>


            {/* Heading */}
            <div className="mt-8 text-center">

              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#9b7a42]">
                Abhinava Administration
              </p>

              <h1 className="mt-4 font-display text-4xl sm:text-5xl">
                Welcome back.
              </h1>

              <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-black/45">
                Sign in to manage the content, projects and information
                presented across Abhinava.
              </p>

            </div>


            {/* Login card */}
            <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-8">

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-5 py-3.5 text-sm font-medium transition-all duration-300 hover:border-black/25 hover:bg-[#faf9f6] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-black/20 text-[11px] font-semibold">
                G
                </div>

                {loading
                  ? 'Signing you in...'
                  : 'Continue with Google'}

              </button>


              {/* Error */}
              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs leading-5 text-red-600">
                  {error}
                </div>
              )}


              {/* Security note */}
              <div className="mt-7 flex gap-3 border-t border-black/[0.06] pt-6">

                <ShieldCheck
                  size={17}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-[#9b7a42]"
                />

                <p className="text-xs leading-5 text-black/40">
                  This area is restricted to authorized Abhinava
                  administrators. Authentication alone does not grant
                  administrative access.
                </p>

              </div>

            </div>


            {/* Footer note */}
            <p className="mt-8 text-center text-[10px] uppercase tracking-[0.25em] text-black/25">
              Secure Administration
            </p>

          </div>

        </div>

      </div>

    </main>
  )
}