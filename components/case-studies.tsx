"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const cases = [
  {
    quote: "RepoRead helped our team onboard 3x faster by understanding complex codebases instantly",
    company: "TechFlow",
    description: "A fast-growing startup needed to quickly onboard new developers to their monorepo. RepoRead provided instant architecture understanding and setup guides.",
    impact: [
      { value: "3x", label: "Faster Onboarding" },
      { value: "40%", label: "Time Saved" },
      { value: "12", label: "Repos Analyzed" },
      { value: "2hrs", label: "Avg. Time Saved" }
    ],
    gradient: "from-indigo-500 to-violet-500"
  },
  {
    quote: "We evaluated 50+ open source libraries in a week instead of a month",
    company: "NexaCorp",
    description: "The engineering team needed to evaluate multiple libraries for their new project. RepoRead provided quick comparisons of architecture and code quality.",
    impact: [
      { value: "50+", label: "Libraries Analyzed" },
      { value: "75%", label: "Evaluation Time Cut" },
      { value: "A+", label: "Chosen Lib Quality" },
      { value: "1 Week", label: "Decision Time" }
    ],
    gradient: "from-violet-500 to-pink-500"
  },
  {
    quote: "Understanding legacy codebases went from days to minutes",
    company: "GrowthPeak",
    description: "Inherited a legacy codebase with minimal documentation. RepoRead mapped the entire architecture and generated comprehensive documentation.",
    impact: [
      { value: "847", label: "Files Mapped" },
      { value: "100%", label: "Coverage" },
      { value: "5min", label: "Analysis Time" },
      { value: "0", label: "Surprises Left" }
    ],
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    quote: "Due diligence for acquisitions became effortless with instant code analysis",
    company: "ScaleByte",
    description: "During M&A evaluations, the tech team needed to quickly assess multiple company codebases. RepoRead provided detailed technical insights in minutes.",
    impact: [
      { value: "8", label: "Companies Evaluated" },
      { value: "90%", label: "Faster DD" },
      { value: "$2M", label: "Deal Value" },
      { value: "A+", label: "Tech Score" }
    ],
    gradient: "from-orange-500 to-red-500"
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
                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-6">
                      &ldquo;{caseStudy.quote}&rdquo;
                    </blockquote>
                    
                    {/* Company */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${caseStudy.gradient} flex items-center justify-center text-white font-bold`}>
                        {caseStudy.company[0]}
                      </div>
                      <span className="font-medium text-white">{caseStudy.company}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-white/50 leading-relaxed mb-8">
                      {caseStudy.description}
                    </p>
                    
                    {/* Impact stats */}
                    <div className="grid grid-cols-4 gap-4">
                      {caseStudy.impact.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-lg font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-white/40">{stat.label}</div>
                        </div>
                      ))}
                    </div>
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
