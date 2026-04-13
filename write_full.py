#!/usr/bin/env python3
"""Write complete RepoRead landing page with all UI improvements."""

part1 = '''"use client";
import { useState, useEffect, useRef } from "react";

interface AnalysisResult {
  repoName: string; description: string; stars: number; forks: number; language: string;
  techStack: string[]; keyFeatures: string[]; howToRun: string[]; pitfalls: string[]; url: string; readme?: string;
}
interface HistoryEntry { url: string; repoName: string; analyzedAt: string; }

async function fetchGitHubData(owner: string, repo: string) {
  const headers = { "Accept": "application/vnd.github.v3+json", "User-Agent": "RepoRead-App" };
  const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!metaRes.ok) throw new Error(metaRes.status === 404 ? "Repository not found" : metaRes.status === 403 ? "Rate limit" : "API error");
  const meta = await metaRes.json();
  const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
  let readmeContent = "";
  if (readmeRes.ok) { const d = await readmeRes.json(); readmeContent = atob(d.content); }
  return { meta, readmeContent };
}

function validateGitHubUrl(url: string) { return /^https?:\\/\\/github\\.com\\/[\\w-]+\\/[\\w.-]+/.test(url.trim()); }
function extractOwnerRepo(url: string) {
  const match = url.match(/github\\.com\\/([\\w-]+)\\/([\\w.-]+)/);
  if (match) return { owner: match[1], repo: match[2].replace(/\\/tree\\/[\\w.-]+$/, "") };
  return null;
}

// Gradient SVG Icons
function LightningIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#lg1)"/></svg>); }
function BrainIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M12 4a4 4 0 014 4c0 1.1-.45 2.1-1.17 2.83L12 14l-2.83-3.17A4 4 0 0112 4z" fill="url(#lg2)"/><path d="M12 14v6M9 17h6M8 9a2 2 0 11-4 0 2 2 0 014 0zM20 9a2 2 0 11-4 0 2 2 0 014 0z" stroke="url(#lg2)" strokeWidth="1.5" strokeLinecap="round"/></svg>); }
function ChartIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M3 3v18h18" stroke="url(#lg3)" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 16l4-4 4 4 5-6" stroke="url(#lg3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function RocketIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" fill="url(#lg4)"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="url(#lg4)" strokeWidth="1.5" strokeLinecap="round"/></svg>); }
function WarningIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f97316"/></linearGradient></defs><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="url(#lg5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function LockIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="url(#lg6)"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="url(#lg6)" strokeWidth="1.5" strokeLinecap="round"/></svg>); }
// How it works icons
function LinkIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="hw1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="url(#hw1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="url(#hw1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ChipIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="hw2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><rect x="4" y="4" width="16" height="16" rx="2" stroke="url(#hw2)" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" fill="url(#hw2)"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" stroke="url(#hw2)" strokeWidth="1.5" strokeLinecap="round"/></svg>); }
function InsightIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="hw3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1H9a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" stroke="url(#hw3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
// Use case icons
function CodeIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><polyline points="16,18 22,12 16,6" stroke="url(#uc1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8,6 2,12 8,18" stroke="url(#uc1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function SearchIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><circle cx="11" cy="11" r="8" stroke="url(#uc2)" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="url(#uc2)" strokeWidth="2" strokeLinecap="round"/></svg>); }
function AnalyticsIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M18 20V10M12 20V4M6 20v-6" stroke="url(#uc3)" strokeWidth="2" strokeLinecap="round"/></svg>); }
function LearnIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="url(#uc4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke="url(#uc4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function StartupIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" fill="url(#uc5)"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="url(#uc5)" strokeWidth="1.5" strokeLinecap="round"/></svg>); }
function GitBranchIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><circle cx="18" cy="18" r="3" stroke="url(#uc6)" strokeWidth="1.5"/><circle cx="6" cy="6" r="3" stroke="url(#uc6)" strokeWidth="1.5"/><path d="M6 21V9a9 9 0 009 9" stroke="url(#uc6)" strokeWidth="1.5" strokeLinecap="round"/></svg>); }

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [splitRatio, setSplitRatio] = useState(35);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { const s = localStorage.getItem("reporead_history"); if (s) setHistory(JSON.parse(s)); }, []);
  useEffect(() => { const p = new URLSearchParams(window.location.search); const r = p.get("repo"); if (r) { setUrl(r); handleAnalyze(r); } }, []);

  async function handleAnalyze(targetUrl?: string) {
    const inputUrl = targetUrl || url; const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) { setError("Please enter a GitHub URL"); return; }
    if (!validateGitHubUrl(trimmedUrl)) { setError("Please enter a valid GitHub URL"); return; }
    const ownerRepo = extractOwnerRepo(trimmedUrl);
    if (!ownerRepo) { setError("Could not parse repository info"); return; }
    setIsLoading(true); setError(""); setLoadingStep("Connecting to GitHub...");
    try {
      const data = await fetchGitHubData(ownerRepo.owner, ownerRepo.repo);
      setLoadingStep("Reading README...");
      const r: AnalysisResult = {
        repoName: data.meta.full_name, description: data.meta.description || "No description provided",
        stars: data.meta.stargazers_count, forks: data.meta.forks_count, language: data.meta.language || "Unknown",
        techStack: [data.meta.language || "JavaScript"],
        keyFeatures: [`${data.meta.stargazers_count.toLocaleString()} stars`, `${data.meta.forks_count.toLocaleString()} forks`, data.meta.language ? `Primary: ${data.meta.language}` : "", data.meta.license?.name ? `License: ${data.meta.license.name}` : ""].filter(Boolean) as string[],
        howToRun: [`git clone https://github.com/${ownerRepo.owner}/${ownerRepo.repo}.git`, `cd ${ownerRepo.repo}`, "npm install", "npm run dev", "Open http://localhost:3000"],
        pitfalls: ["Check compatibility before use", "Review license terms", "Test in dev environment first"],
        url: trimmedUrl, readme: data.readmeContent
      };
      const newHistory = [{ url: trimmedUrl, repoName: r.repoName, analyzedAt: new Date().toISOString() }, ...history.filter(h => h.url !== trimmedUrl)].slice(0, 10);
      setHistory(newHistory); localStorage.setItem("reporead_history", JSON.stringify(newHistory)); setResult(r);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); } 
    finally { setIsLoading(false); }
  }

  function handleNewAnalysis() { setResult(null); setUrl(""); window.history.pushState({}, "", window.location.pathname); inputRef.current?.focus(); }
  function loadFromHistory(h: string) { setUrl(h); setShowHistory(false); handleAnalyze(h); }
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); const startX = e.clientX; const startRatio = splitRatio;
    const handleMouseMove = (ev: MouseEvent) => { const delta = ev.clientX - startX; setSplitRatio(Math.max(20, Math.min(60, startRatio + (delta / window.innerWidth) * 100))); };
    const handleMouseUp = () => { document.removeEventListener("mousemove", handleMouseMove); document.removeEventListener("mouseup", handleMouseUp); };
    document.addEventListener("mousemove", handleMouseMove); document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradientFlow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-delay-100 { animation-delay: 100ms; }
        .animate-delay-200 { animation-delay: 200ms; }
        .animate-delay-300 { animation-delay: 300ms; }
        .animate-delay-400 { animation-delay: 400ms; }
        .animate-delay-500 { animation-delay: 500ms; }
        .animate-delay-600 { animation-delay: 600ms; }
        .gradient-flow { background-size: 200% 200%; animation: gradientFlow 3s ease infinite; }
      `}</style>
      <div className="fixed inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',backgroundSize:'24px 24px'}}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[60%] bg-gradient-radial from-blue-600/10 via-violet-600/5 to-transparent blur-[100px]" />
      </div>
      <header className="relative z-50 h-14 px-6 flex items-center justify-between border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-500/20">R</div><span className="font-semibold text-sm tracking-tight">RepoRead</span></div>
          <nav className="hidden md:flex items-center gap-5"><a href="#features" className="text-xs text-white/50 hover:text-white transition-colors">Features</a><a href="#how-it-works" className="text-xs text-white/50 hover:text-white transition-colors">How it works</a><a href="#use-cases" className="text-xs text-white/50 hover:text-white transition-colors">Use Cases</a></nav>
        </div>
        <div className="flex items-center gap-3"><button onClick={() => setShowHistory(true)} className="text-xs text-white/40 hover:text-white/80 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">History</button><button onClick={() => { setUrl(""); inputRef.current?.focus(); }} className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 transition-colors">Try Now</button></div>
      </header>
      <div className="relative z-10">
        {!result ? (
          <div>
            <section className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="animate-fade-in-up animate-delay-100 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />AI-Powered GitHub Analyzer</div>
              <h1 className="animate-fade-in-up animate-delay-200 text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] max-w-4xl"><span className="text-white">Understand any</span><br /><span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">GitHub repository</span><br /><span className="text-white">in seconds</span></h1>
              <p className="animate-fade-in-up animate-delay-300 text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">Stop spending hours reading code. Paste any GitHub URL and get instant insights about tech stack, key features, dependencies, and how to get started.</p>
              <div className="animate-fade-in-up animate-delay-400 w-full max-w-2xl mb-12">
                <div className="relative group"><div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/50 via-violet-500/50 to-fuchsia-500/50 rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-[#18181b] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-xs text-white/30 ml-2">GitHub URL</span></div>
                    <textarea ref={inputRef} value={url} onChange={(e) => { setUrl(e.target.value); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAnalyze(); } }} placeholder="Paste a GitHub URL... (e.g. github.com/facebook/react)" className="w-full px-4 py-4 bg-transparent text-white/90 placeholder:text-white/30 resize-none focus:outline-none min-h-[80px] focus:ring-2 focus:ring-blue-500/50" rows={2} />
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/5"><span className="text-xs text-white/30">Press Enter to analyze</span><button onClick={() => handleAnalyze()} disabled={isLoading || !url.trim()} className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40">{isLoading ? "Analyzing..." : "Analyze"}</button></div>
                  </div>
                </div>
                {error && <p className="mt-3 text-red-400 text-xs text-center">{error}</p>}
                {isLoading && <div className="mt-6 flex flex-col items-center gap-3"><div className="w-5 h-5 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin" /><p className="text-white/40 text-xs">{loadingStep}</p></div>}
              </div>
              <div className="animate-fade-in-up animate-delay-500 flex flex-wrap justify-center gap-2 mb-8">{["facebook/react", "vercel/next.js", "twbs/bootstrap", "microsoft/vscode"].map((s) => (<button key={s} onClick={() => { setUrl(`https://github.com/${s}`); inputRef.current?.focus(); }} className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">{s}</button>))}</div>
              <div className="animate-fade-in-up animate-delay-600 text-center"><p className="text-xs text-white/30 mb-3">Trusted by developers at</p><div className="flex items-center justify-center gap-8 opacity-40">{["Google", "Microsoft", "Amazon", "Meta", "Netflix"].map((c) => <span key={c} className="text-sm font-semibold text-white/60">{c}</span>)}</div></div>
            </section>
            <section id="features" className="px-6 py-24 border-t border-white/5"><div className="max-w-6xl mx-auto"><div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">Everything you need to understand code</h2><p className="text-white/50 max-w-xl mx-auto">Stop reading thousands of lines of code. Get actionable insights in seconds.</p></div><div className="grid md:grid-cols-3 gap-6">{[{icon:<LightningIcon className="w-8 h-8" />,title:"Instant Analysis",desc:"Get comprehensive repo insights in seconds.",metric:"10x faster"},{icon:<BrainIcon className="w-8 h-8" />,title:"AI-Powered Insights",desc:"Advanced AI understands code structure and patterns.",metric:"95% accuracy"},{icon:<ChartIcon className="w-8 h-8" />,title:"Tech Stack Breakdown",desc:"Instantly see all technologies and libraries.",metric:"50+ technologies"},{icon:<RocketIcon className="w-8 h-8" />,title:"Quick Start Guide",desc:"Get installation commands and setup instructions.",metric:"1-click setup"},{icon:<WarningIcon className="w-8 h-8" />,title:"Watch Out Alerts",desc:"Know about potential issues and pitfalls.",metric:"3-5 alerts"},{icon:<LockIcon className="w-8 h-8" />,title:"Privacy First",desc:"Your code stays private. Zero data retention.",metric:"100% private"}].map((f,i) => (<div key={i} className="group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300"><div className="flex items-start justify-between mb-4"><div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/10">{f.icon}</div><span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">{f.metric}</span></div><h3 className="font-semibold mb-2 group-hover:text-blue-400 transition-colors">{f.title}</h3><p className="text-sm text-white/50 leading-relaxed">{f.desc}</p></div>))}</div></div></section>
            <section id="how-it-works" className="px-6 py-24 border-t border-white/5 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent"><div className="max-w-4xl mx-auto"><div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">How it works</h2><p className="text-white/50">Three simple steps to understand any repository</p></div><div className="grid md:grid-cols-3 gap-8">{[{icon:<LinkIcon className="w-10 h-10" />,num:"01",title:"Paste the URL",desc:"Copy any public GitHub URL and paste it."},{icon:<ChipIcon className="w-10 h-10" />,num:"02",title:"AI Analyzes",desc:"Our AI fetches code, README, and dependencies."},{icon:<InsightIcon className="w-10 h-10" />,num:"03",title:"Get Insights",desc:"Receive a comprehensive breakdown."}].map((s,i) => (<div key={i} className="text-center"><div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 flex items-center justify-center animate-pulse">{s.icon}</div><div className="text-6xl font-bold text-white/5 mt-4">{s.num}</div><h3 className="font-semibold mt-2">{s.title}</h3><p className="text-sm text-white/50 mt-1 leading-relaxed">{s.desc}</p></div>))}</div></div></section>
            <section id="use-cases" className="px-6 py-24 border-t border-white/5"><div className="max-w-6xl mx-auto"><div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">Built for every developer</h2><p className="text-white/50">Whether evaluating open-source projects or onboarding to a new codebase</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[{icon:<CodeIcon className="w-6 h-6" />,title:"Software Engineers",desc:"Quickly evaluate third-party libraries."},{icon:<SearchIcon className="w-6 h-6" />,title:"Tech Recruiters",desc:"Understand candidates' portfolio projects."},{icon:<AnalyticsIcon className="w-6 h-6" />,title:"Engineering Managers",desc:"Due diligence on open-source tools."},{icon:<LearnIcon className="w-6 h-6" />,title:"Students & Learners",desc:"Explore popular projects to learn patterns."},{icon:<StartupIcon className="w-6 h-6" />,title:"Startup Founders",desc:"Evaluate technical feasibility."},{icon:<GitBranchIcon className="w-6 h-6" />,title:"Open Source Contributors",desc:"Understand repos before contributing."}].map((u,i) => (<div key={i} className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300"><div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-3">{u.icon}</div><h3 className="font-semibold mb-2">{u.title}</h3><p className="text-sm text-white/50 leading-relaxed">{u.desc}</p></div>))}</div></div></section>
            <section className="px-6 py-24 border-t border-white/5"><div className="max-w-4xl mx-auto"><div className="grid md:grid-cols-4 gap-8 text-center">{[{num:"50000",label:"Repositories Analyzed",prefix:""},{num:"98",label:"User Satisfaction",prefix:"%"},{num:"10",label:"Average Seconds",prefix:""},{num:"0",label:"Cost for Public Repos",prefix:""}].map((s,i