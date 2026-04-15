"use client"

import { useState } from "react"
import { FileCode2, GitBranch, Boxes, Terminal, CheckCircle2 } from "lucide-react"

const services = [
  {
    id: "overview",
    title: "Project Overview",
    subtitle: "Instant Understanding",
    description: "Get a comprehensive summary of any repository in seconds. Understand the project's purpose, features, and capabilities without reading thousands of lines of code.",
    icon: FileCode2,
    demo: OverviewDemo
  },
  {
    id: "architecture", 
    title: "Tech Architecture",
    subtitle: "Deep Analysis",
    description: "Visualize the entire tech stack, dependencies, and architectural patterns. From frameworks to databases, understand every layer of the application.",
    icon: Boxes,
    demo: ArchitectureDemo
  },
  {
    id: "usage",
    title: "Usage Guide",
    subtitle: "Quick Start",
    description: "Get step-by-step instructions to clone, install, configure, and run any project. No more guessing or hunting through sparse documentation.",
    icon: Terminal,
    demo: UsageDemo
  },
  {
    id: "insights",
    title: "Code Insights",
    subtitle: "Smart Analysis",
    description: "Discover code quality metrics, potential issues, and improvement suggestions. Understand the codebase health at a glance.",
    icon: GitBranch,
    demo: InsightsDemo
  }
]

function OverviewDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
          <FileCode2 className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <div className="text-sm font-medium text-white">vercel/next.js</div>
          <div className="text-xs text-white/40">React Framework</div>
        </div>
        <div className="ml-auto px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">Active</div>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-white/60 leading-relaxed">
          Next.js is a React framework for building full-stack web applications. It provides server-side rendering, static generation, and API routes out of the box.
        </p>
        
        <div className="flex flex-wrap gap-2">
          {["React", "TypeScript", "Node.js", "Webpack"].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-white/60">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 pt-3">
        {[
          { label: "Stars", value: "128K" },
          { label: "Forks", value: "27K" },
          { label: "Issues", value: "2.1K" }
        ].map((stat) => (
          <div key={stat.label} className="text-center p-3 rounded-xl bg-white/[0.02]">
            <div className="text-lg font-semibold text-white">{stat.value}</div>
            <div className="text-xs text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ArchitectureDemo() {
  const layers = [
    { name: "Frontend", items: ["React 18", "TypeScript", "Tailwind CSS"], color: "indigo" },
    { name: "Backend", items: ["Node.js", "API Routes", "Middleware"], color: "violet" },
    { name: "Data", items: ["PostgreSQL", "Prisma ORM", "Redis"], color: "emerald" }
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-sm font-medium text-white">Architecture Breakdown</span>
        <span className="text-xs text-white/40">3 Layers Detected</span>
      </div>
      
      {layers.map((layer, index) => (
        <div key={layer.name} className="relative">
          {index > 0 && (
            <div className="absolute -top-2 left-5 w-px h-2 bg-white/10" />
          )}
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl bg-${layer.color}-500/10 flex items-center justify-center shrink-0`}>
              <div className={`w-2 h-2 rounded-full bg-${layer.color}-400`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white mb-2">{layer.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {layer.items.map((item) => (
                  <span key={item} className="px-2 py-0.5 rounded bg-white/5 text-xs text-white/60">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function UsageDemo() {
  const steps = [
    { cmd: "git clone https://github.com/vercel/next.js", done: true },
    { cmd: "cd next.js && pnpm install", done: true },
    { cmd: "pnpm dev", done: false }
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-xs text-white/40 ml-2">Terminal</span>
      </div>
      
      <div className="font-mono text-sm space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-emerald-400 shrink-0">$</span>
            <span className="text-white/70 break-all">{step.cmd}</span>
            {step.done && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
          </div>
        ))}
        <div className="flex items-center gap-2 text-white/40">
          <span className="text-emerald-400">$</span>
          <span className="animate-pulse">|</span>
        </div>
      </div>
      
      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
        <div className="text-xs text-emerald-400">Ready to start</div>
        <div className="text-sm text-white/60 mt-1">Run pnpm dev to start the development server on localhost:3000</div>
      </div>
    </div>
  )
}

function InsightsDemo() {
  const metrics = [
    { label: "Code Quality", value: 92, color: "emerald" },
    { label: "Documentation", value: 78, color: "indigo" },
    { label: "Test Coverage", value: 85, color: "violet" }
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-sm font-medium text-white">Health Score</span>
        <span className="text-2xl font-bold text-emerald-400">A+</span>
      </div>
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">{metric.label}</span>
              <span className="text-white font-medium">{metric.value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-400`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
        <span className="text-sm text-white/60">Well-maintained repository with active development</span>
      </div>
    </div>
  )
}

export function Services() {
  const [activeService, setActiveService] = useState("overview")
  const active = services.find(s => s.id === activeService)!
  const DemoComponent = active.demo

  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="text-sm text-indigo-400 font-medium">Our Services</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 text-balance">
            AI Solutions That Decode
            <br />Any Codebase
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            We analyze, document, and explain repositories so you can focus on building, not deciphering
          </p>
        </div>

        {/* Services grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Service list */}
          <div className="space-y-4">
            {services.map((service) => {
              const Icon = service.icon
              const isActive = activeService === service.id
              
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 group ${
                    isActive 
                      ? 'bg-white/[0.03] border-indigo-500/30' 
                      : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-indigo-500/20' : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-white/60'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{service.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/40'
                        }`}>
                          {service.subtitle}
                        </span>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Demo panel */}
          <div className="sticky top-24">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <DemoComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
