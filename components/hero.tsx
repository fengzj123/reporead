"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles, Loader2 } from "lucide-react"

export function Hero() {
  const [url, setUrl] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleAnalyze() {
    if (!url.trim()) {
      setError("Please enter a GitHub repository URL")
      return
    }

    const trimmed = url.trim()
    if (!/^https?:\/\/github\.com\//.test(trimmed)) {
      setError("Please enter a valid GitHub URL (e.g., https://github.com/facebook/react)")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Analysis failed")
        return
      }

      // Store result in sessionStorage for results page
      sessionStorage.setItem("reporead_result", JSON.stringify(data))
      router.push("/results")
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !isLoading) {
      handleAnalyze()
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-white/70">Powered by Advanced AI</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="text-white">Understand Any</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            GitHub Repository
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
          Paste a repository URL and let AI instantly analyze the codebase. 
          Get clear insights on architecture, tech stack, and how to get started.
        </p>

        {/* URL Input */}
        <div className={`relative max-w-2xl mx-auto transition-all duration-500 ${isFocused ? 'scale-[1.02]' : ''}`}>
          <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500/50 via-violet-500/50 to-indigo-500/50 rounded-2xl blur-lg transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="relative flex flex-col items-center bg-white/[0.03] border border-white/10 rounded-2xl p-2 backdrop-blur-xl">
            <div className="w-full flex items-center bg-white/[0.03] rounded-xl p-2">
              <div className="flex items-center gap-3 pl-4 pr-2 text-white/30">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError("") }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="github.com/vercel/next.js"
                disabled={isLoading}
                className="flex-1 bg-transparent text-white placeholder:text-white/30 text-lg py-4 px-2 focus:outline-none disabled:opacity-50"
              />
              
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white font-medium px-6 py-4 rounded-xl transition-all duration-300 hover:gap-3 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="w-full mt-2 px-4 text-left">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 mt-16">
          {[
            { value: "50K+", label: "Repos Analyzed" },
            { value: "12K+", label: "Developers" },
            { value: "99.9%", label: "Accuracy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
