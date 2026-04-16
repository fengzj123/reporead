"use client"

import { useState, useEffect } from "react"

const steps = [
  {
    number: "01",
    title: "Paste URL",
    description: "Simply paste any GitHub repository URL into the input field. Public or private repos are supported.",
    visual: PasteVisual
  },
  {
    number: "02", 
    title: "AI Analysis",
    description: "Our AI engine scans the entire codebase, analyzing structure, dependencies, and patterns.",
    visual: AnalysisVisual
  },
  {
    number: "03",
    title: "Get Insights",
    description: "Receive a comprehensive breakdown with actionable insights, ready to use in seconds.",
    visual: InsightsVisual
  }
]

function PasteVisual() {
  const [typed, setTyped] = useState("")
  const url = "github.com/vercel/ai"
  
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= url.length) {
        setTyped(url.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
        <svg className="w-5 h-5 text-white/30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <span className="text-white/80 font-mono">{typed}</span>
        <span className="w-0.5 h-5 bg-teal-400 animate-pulse" />
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-sm text-white/40">
        <kbd className="px-2 py-1 rounded bg-white/5 text-xs">Ctrl</kbd>
        <span>+</span>
        <kbd className="px-2 py-1 rounded bg-white/5 text-xs">V</kbd>
        <span className="ml-2">to paste</span>
      </div>
    </div>
  )
}

function AnalysisVisual() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + 2
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const tasks = [
    { name: "Scanning files", threshold: 25 },
    { name: "Analyzing dependencies", threshold: 50 },
    { name: "Mapping architecture", threshold: 75 },
    { name: "Generating insights", threshold: 100 }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Progress ring */}
      <div className="flex justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle 
              cx="48" cy="48" r="40" fill="none" stroke="url(#gradient)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.51} 251`}
              className="transition-all duration-100"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {tasks.map((task, i) => {
          const isActive = progress >= tasks[i-1]?.threshold || 0 && progress < task.threshold
          const isDone = progress >= task.threshold
          
          return (
            <div key={task.name} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
              isActive ? 'bg-teal-500/10' : ''
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                isDone ? 'bg-emerald-500/20 text-emerald-400' : 
                isActive ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 text-white/30'
              }`}>
                {isDone ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${isDone ? 'text-white/60' : isActive ? 'text-white' : 'text-white/30'}`}>
                {task.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InsightsVisual() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-emerald-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">Analysis Complete</span>
      </div>
      
      <div className="space-y-3">
        {[
          { label: "Type", value: "Next.js App (App Router)" },
          { label: "Language", value: "TypeScript — 94%" },
          { label: "Architecture", value: "Monorepo, 3 layers" },
          { label: "Build", value: "Turbopack + pnpm" }
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xs text-white/40">{item.label}</span>
            <span className="text-sm font-medium text-white/80">{item.value}</span>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 pt-2">
        <button className="flex-1 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-medium hover:bg-teal-400 transition-colors">
          View Report
        </button>
        <button className="px-4 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors">
          Export
        </button>
      </div>
    </div>
  )
}

export function Process() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="process" className="relative py-32 overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-sm text-teal-400 font-medium">Our Process</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 text-balance">
            Simple, Smart, and
            <br />Scalable Analysis
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Three steps to understanding any repository
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Visual = step.visual
            const isActive = activeStep === index
            
            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={`group relative cursor-pointer transition-all duration-500 ${
                  isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
              >
                {/* Glow effect */}
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-b from-teal-500/50 to-transparent transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                }`} />
                
                <div className={`relative h-full rounded-3xl border transition-all duration-500 overflow-hidden ${
                  isActive 
                    ? 'bg-white/[0.03] border-teal-500/30' 
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}>
                  {/* Step number */}
                  <div className="absolute top-6 right-6 text-6xl font-bold text-white/[0.03]">
                    {step.number}
                  </div>
                  
                  {/* Visual */}
                  <div className="relative min-h-[200px]">
                    <Visual />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 pt-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-1 rounded">
                        Step {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-12">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                activeStep === i ? 'w-8 bg-teal-500' : 'w-1.5 bg-white/20 hover:bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
