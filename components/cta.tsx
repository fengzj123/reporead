"use client"

import { useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTA() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[150px]" />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 mb-8">
          <Sparkles className="w-7 h-7 text-indigo-400" />
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
          Let AI Do the Work
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            So You Can Build Faster
          </span>
        </h2>

        <p className="text-lg text-white/50 max-w-xl mx-auto mb-12">
          Join thousands of developers who save hours every week understanding codebases instantly.
        </p>

        {/* CTA Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-violet-500/30 rounded-2xl blur-lg opacity-50" />
              
              <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent text-white placeholder:text-white/30 px-4 py-3 focus:outline-none"
                  required
                />
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:gap-3 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-white/30 mt-4">
              Free to start. No credit card required.
            </p>
          </form>
        ) : (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">You&apos;re on the list!</span>
            </div>
            <p className="text-sm text-white/50">
              We&apos;ll send you early access when it&apos;s ready.
            </p>
          </div>
        )}

        {/* Social proof */}
        <div className="flex items-center justify-center gap-8 mt-16 pt-16 border-t border-white/5">
          <div className="flex -space-x-3">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-white/10 to-white/5"
              />
            ))}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-white/50 mt-1">Try it — analyze any repo in seconds</p>
          </div>
        </div>
      </div>
    </section>
  )
}
