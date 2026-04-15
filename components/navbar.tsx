"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/5' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
              RepoRead
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {["Services", "Process", "Case Studies", "Pricing"].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <button className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all duration-300">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  )
}
