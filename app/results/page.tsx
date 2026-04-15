"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star, GitFork, Code, AlertTriangle, Rocket, Copy, CheckCircle, Activity, Package, FolderTree, ShieldCheck, ShieldAlert } from "lucide-react"

interface HealthDetails {
  dependencyFreshness: string
  hasTests: boolean
  hasTypes: boolean
  maintenanceStatus: string
}

interface KeyModule {
  name: string
  path: string
  desc: string
}

interface AnalysisResult {
  repoName: string
  description: string
  stars: number
  forks: number
  language: string | null
  license: string | null
  url: string
  techStack: string[]
  keyModules: KeyModule[]
  keyFeatures: string[]
  howToRun: string[]
  pitfalls: string[]
  healthScore: number
  healthDetails: HealthDetails
}

function HealthBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400"
  const bg = score >= 80 ? "bg-green-500/10 border-green-500/30" : score >= 60 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30"
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${bg}`}>
      <Activity className={`w-4 h-4 ${color}`} />
      <span className={`font-bold ${color}`}>{score}</span>
      <span className="text-white/50 text-sm">Health</span>
    </div>
  )
}

function DetailPill({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
      {good ? (
        <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
      )}
      <span className="text-white/50 text-xs">{label}:</span>
      <span className={`text-xs font-medium ${good ? "text-green-400" : "text-red-400"}`}>{value}</span>
    </div>
  )
}

function FreshnessLabel({ freshness }: { freshness: string }) {
  const map: Record<string, { label: string; color: string }> = {
    good: { label: "Fresh", color: "text-green-400" },
    concerning: { label: "Outdated", color: "text-yellow-400" },
    outdated: { label: "Very Old", color: "text-red-400" },
  }
  const { label, color } = map[freshness] || { label: freshness, color: "text-white/50" }
  return <span className={color}>{label}</span>
}

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = sessionStorage.getItem("reporead_result")
    if (stored) {
      try {
        setResult(JSON.parse(stored))
      } catch {
        console.error("Failed to parse stored result")
      }
    }
  }, [])

  function copyResults() {
    if (!result) return
    const text = `
# ${result.repoName}

${result.description || "No description"}

## ⭐ Stats
- Stars: ${result.stars.toLocaleString()}
- Forks: ${result.forks.toLocaleString()}
- Language: ${result.language || "N/A"}
- License: ${result.license || "N/A"}
- Health Score: ${result.healthScore}/100

## 🛠 Tech Stack
${result.techStack.map(t => `- ${t}`).join("\n")}

## 📦 Key Modules
${result.keyModules.map(m => `- **${m.name}** (${m.path}): ${m.desc}`).join("\n")}

## ✨ Key Features
${result.keyFeatures.map(f => `- ${f}`).join("\n")}

## 🚀 How to Run
${result.howToRun.map((s, i) => `${i + 1}. ${s}`).join("\n")}

## ⚠️ Common Pitfalls
${result.pitfalls.map(p => `- ${p}`).join("\n")}

## 🔍 Health Details
- Dependency Freshness: ${result.healthDetails.dependencyFreshness}
- Has Tests: ${result.healthDetails.hasTests}
- Has Types: ${result.healthDetails.hasTypes}
- Maintenance: ${result.healthDetails.maintenanceStatus}
    `.trim()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!mounted) return null

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Analysis Results</h1>
          <p className="text-white/50 mb-6">Analyze a repository first to see results here.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-6 py-3 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Analyze Another</span>
          </Link>
          <button
            onClick={copyResults}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy Results"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Repo Header */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl">
              📖
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{result.repoName}</h1>
              <p className="text-lg text-white/50">{result.description || "No description provided"}</p>
            </div>
          </div>

          {/* Stats + Health badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white/70">{result.stars.toLocaleString()} stars</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <GitFork className="w-4 h-4 text-white/40" />
              <span className="text-white/70">{result.forks.toLocaleString()} forks</span>
            </div>
            {result.language && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <Code className="w-4 h-4 text-indigo-400" />
                <span className="text-indigo-400">{result.language}</span>
              </div>
            )}
            {result.license && (
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-white/50 text-sm">License: {result.license}</span>
              </div>
            )}
            <HealthBadge score={result.healthScore} />
          </div>
        </div>

        {/* Health Details Row */}
        {result.healthDetails && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Health Details
            </h2>
            <div className="flex flex-wrap gap-3">
              <DetailPill
                label="Dependencies"
                value={<FreshnessLabel freshness={result.healthDetails.dependencyFreshness} />}
                good={result.healthDetails.dependencyFreshness === "good"}
              />
              <DetailPill
                label="Tests"
                value={result.healthDetails.hasTests ? "Yes" : "No"}
                good={result.healthDetails.hasTests}
              />
              <DetailPill
                label="Types"
                value={result.healthDetails.hasTypes ? "Yes" : "No"}
                good={result.healthDetails.hasTypes}
              />
              <DetailPill
                label="Maintenance"
                value={result.healthDetails.maintenanceStatus}
                good={result.healthDetails.maintenanceStatus === "active"}
              />
            </div>
          </section>
        )}

        {/* Tech Stack */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">🛠</span>
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {result.techStack.map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Key Modules */}
        {result.keyModules && result.keyModules.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-indigo-400" />
              Key Modules
            </h2>
            <div className="space-y-3">
              {result.keyModules.map((mod, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{mod.name}</span>
                      <code className="text-xs text-white/30 font-mono">{mod.path}</code>
                    </div>
                    <p className="text-sm text-white/50">{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">✨</span>
            Key Features
          </h2>
          <ul className="space-y-3">
            {result.keyFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How to Run */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-400" />
            How to Run
          </h2>
          <ol className="space-y-3">
            {result.howToRun.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-sm font-medium shrink-0">
                  {i + 1}
                </span>
                <code className="text-white/80 bg-white/5 px-3 py-1.5 rounded-lg text-sm font-mono">
                  {step}
                </code>
              </li>
            ))}
          </ol>
        </section>

        {/* Pitfalls */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Common Pitfalls
          </h2>
          <ul className="space-y-3">
            {result.pitfalls.map((pitfall, i) => (
              <li key={i} className="flex items-start gap-3 text-white/60">
                <span className="text-yellow-400 mt-0.5">⚠️</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
          <Link href="/" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium px-6 py-3 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Analyze Another
          </Link>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </main>
    </div>
  )
}
