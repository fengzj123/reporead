"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const cases = [
  {
    quote: "Instantly understand any open source project before you commit",
    description: "Paste a GitHub URL and get a complete breakdown of tech stack, key modules, and how to run it — all powered by AI.",
    gradient: "from-indigo-500 to-violet-500"
  },
  {
    quote: "Evaluate libraries and frameworks in seconds, not hours",
    description: "Compare architecture, dependencies, and code quality across multiple repositories to make faster technical decisions.",
    gradient: "from-violet-500 to-pink-500"
  },
  {
    quote: "Onboard to new codebases without reading a single line",
    description: "Get AI-generated documentation, module summaries, and health scores for any repository — new or legacy.",
    gradient: "from-emerald-500 to-teal-500"
  }
]

export function CaseStudies() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(cases.length - 1, currentIndex + 1)
    setCurrentIndex(newIndex)
  }

  return (
    <section id="case-studies" className="relative py-32 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="text-sm text-indigo-400 font-medium">Case Studies</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 text-balance">
              See How Teams Use
              <br />RepoRead
            </h2>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/40">Drag to explore</span>
            <div className="flex gap-2">
              <button 
                onClick={() => scroll('left')}
                disabled={currentIndex === 0}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                disabled={currentIndex === cases.length - 1}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cards carousel */}
        <div ref={containerRef} className="overflow-hidden -mx-6 px-6">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 2)}%)` }}
          >
            {cases.map((caseStudy, index) => (
              <div 
                key={index}
                className="w-full md:w-[calc(50%-12px)] flex-shrink-0"
              >
                <div className="group relative h-full">
                  {/* Top gradient border */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${caseStudy.gradient}`} />
                  
                  <div className="h-full rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:bg-white/[0.03] transition-colors">
                    {/* Top gradient accent */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${caseStudy.gradient} flex items-center justify-center mb-6`}>
                      <span className="w-3 h-3 rounded-full bg-white/80" />
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-6">
                      &ldquo;{caseStudy.quote}&rdquo;
                    </blockquote>
                    
                    {/* Description */}
                    <p className="text-sm text-white/50 leading-relaxed">
                      {caseStudy.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {cases.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'w-8 bg-indigo-500' : 'w-1.5 bg-white/20 hover:bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
