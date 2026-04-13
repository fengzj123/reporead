"use client";
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

function validateGitHubUrl(url: string) { return /^https?:\/\/github\.com\/[\w-]+\/[\w.-]+/.test(url.trim()); }
function extractOwnerRepo(url: string) {
  const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
  if (match) return { owner: match[1], repo: match[2].replace(/\/tree\/[\w.-]+$/, "") };
  return null;
}

// Feature Icons - Gradient SVG
function LightningIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#lg1)"/></svg>); }
function BrainIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><circle cx="12" cy="12" r="9" stroke="url(#lg2)" strokeWidth="1.5"/><path d="M12 8v4l3 3" stroke="url(#lg2)" strokeWidth="1.5" strokeLinecap="round"/></svg>); }
function ChartIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><path d="M3 3v18h18" stroke="url(#lg3)" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 16l4-4 4 4 5-6" stroke="url(#lg3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function RocketIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" fill="url(#lg4)"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" fill="url(#lg4)"/></svg>); }
function WarningIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f97316"/></linearGradient></defs><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="url(#lg5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function LockIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="lg6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="url(#lg6)"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="url(#lg6)" strokeWidth="1.5" strokeLinecap="round"/></svg>); }
// How it works Icons - Large display
function LinkIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="hw1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="url(#hw1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="url(#hw1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ChipIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="hw2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><rect x="4" y="4" width="16" height="16" rx="2" stroke="url(#hw2)" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" fill="url(#hw2)"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" stroke="url(#hw2)" strokeWidth="1.5" strokeLinecap="round"/></svg>); }
function InsightIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="hw3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1H9a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" stroke="url(#hw3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
// Use case Icons
function CodeIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><polyline points="16,18 22,12 16,6" stroke="url(#uc1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8,6 2,12 8,18" stroke="url(#uc1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function SearchIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><circle cx="11" cy="11" r="8" stroke="url(#uc2)" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="url(#uc2)" strokeWidth="2" strokeLinecap="round"/></svg>); }
function AnalyticsIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><path d="M18 20V10M12 20V4M6 20v-6" stroke="url(#uc3)" strokeWidth="2" strokeLinecap="round"/></svg>); }
function LearnIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="url(#uc4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke="url(#uc4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function StartupIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" fill="url(#uc5)"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" fill="url(#uc5)"/></svg>); }
function GitBranchIcon({ className }: { className?: string }) { return (<svg className={className} viewBox="0 0 24 24" fill="none"><defs><linearGradient id="uc6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs><circle cx="18" cy="18" r="3" stroke="url(#uc6)" strokeWidth="1.5"/><circle cx="6" cy="6" r="3" stroke="url(#uc6)" strokeWidth="1.5"/><path d="M6 21V9a9 9 0 009 9" stroke="url(#uc6)" strokeWidth="1.5" strokeLinecap="round"/></svg>); }

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
      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; } .animate-delay-100 { animation-delay: 100ms; } .animate-delay-200 { animation-delay: 200ms; } .animate-delay-300 { animation-delay: 300ms; } .animate-delay-400 { animation-delay: 400ms; } .animate-delay-500 { animation-delay: 500ms; } @keyframes float { 0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; } 50% { transform: translateY(-30px) scale(1.05); opacity: 1; } }`}</style>
      <>
        {/* Gradient Orbs - Blue/Cyan tones, reduced opacity */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Orb 1 - Blue, top left */}
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/20 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
          {/* Orb 2 - Cyan-teal, top right */}
          <div className="absolute -top-10 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-cyan-400/25 to-teal-500/15 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" style={{animationDelay: '-3s'}} />
          {/* Orb 3 - Sky blue, bottom left */}
          <div className="absolute top-1/2 -left-32 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-sky-400/20 to-blue-500/10 blur-[80px] animate-[float_12s_ease-in-out_infinite]" style={{animationDelay: '-5s'}} />
          {/* Orb 4 - Cool blue-gray, bottom right */}
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-slate-500/20 to-blue-600/15 blur-[90px] animate-[float_9s_ease-in-out_infinite_reverse]" style={{animationDelay: '-2s'}} />
        </div>
        
        {/* Noise Texture Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-[100]" 
             style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '256px 256px'}} />
      </>
      <header className="relative z-50 h-14 px-6 flex items-center justify-between border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-500/20">R</div><span className="font-semibold text-sm tracking-tight">RepoRead</span></div>
          <nav className="hidden md:flex items-center gap-5"><a href="#features" className="text-xs text-white/50 hover:text-white transition-colors">Features</a><a href="#how-it-works" className="text-xs text-white/50 hover:text-white transition-colors">How it works</a><a href="#use-cases" className="text-xs text-white/50 hover:text-white transition-colors">Use Cases</a></nav>
        </div>
        <div className="flex items-center gap-3"><button onClick={() => setShowHistory(true)} className="text-xs text-white/40 hover:text-white/80 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">History</button><button onClick={() => { setUrl(""); inputRef.current?.focus(); }} className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 transition-colors">Try Now</button></div>
      </header>
      <div className="relative z-10">
        {!result ? (
          <div>
            <section className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="animate-fade-in-up animate-delay-100 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />AI-Powered GitHub Analyzer</div>
              <h1 className="animate-fade-in-up animate-delay-200 text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"><span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">One URL.</span><br /><span className="text-white">Every repo, decoded.</span></h1>
              <p className="animate-fade-in-up animate-delay-300 text-lg text-white/50 max-w-2xl mb-10">Paste any GitHub URL. Get complete insights — tech stack, key features, and how to get started.</p>
              <div className="animate-fade-in-up animate-delay-400 w-full max-w-2xl mb-12">
                <div className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-teal-500/50 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-[#18181b] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-xs text-white/30 ml-2">GitHub URL</span></div>
                    <textarea ref={inputRef} value={url} onChange={(e) => { setUrl(e.target.value); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAnalyze(); } }} placeholder="Paste a GitHub URL..." className="w-full px-4 py-4 bg-transparent text-white/90 placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-20" />
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/5"><span className="text-xs text-white/30">Press Enter to analyze</span><button onClick={() => handleAnalyze()} disabled={isLoading || !url.trim()} className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40">{isLoading ? "Analyzing..." : "Analyze"}</button></div>
                  </div>
                </div>
                {error && <p className="mt-3 text-red-400 text-xs text-center">{error}</p>}
                {isLoading && <div className="mt-6 flex flex-col items-center gap-3"><div className="w-5 h-5 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin" /><p className="text-white/40 text-xs">{loadingStep}</p></div>}
              </div>
              <div className="animate-fade-in-up animate-delay-500 flex flex-wrap justify-center gap-2 mb-8">{["facebook/react", "vercel/next.js", "twbs/bootstrap", "microsoft/vscode"].map((s) => (<button key={s} onClick={() => { setUrl(`https://github.com/${s}`); inputRef.current?.focus(); }} className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">{s}</button>))}</div>
              <div className="animate-fade-in-up animate-delay-500 text-center"><p className="text-xs text-white/30 mb-3">Trusted by developers at</p><div className="flex items-center justify-center gap-8 opacity-40">{["Google", "Microsoft", "Amazon", "Meta", "Netflix"].map((c) => <span key={c} className="text-sm font-semibold text-white/60">{c}</span>)}</div></div>
            </section>
            <section id="features" className="px-6 py-24 border-t border-white/5"><div className="max-w-6xl mx-auto"><div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">Everything you need to understand code</h2><p className="text-white/50 max-w-xl mx-auto">Stop reading thousands of lines of code. Get actionable insights in seconds.</p></div><div className="grid md:grid-cols-3 gap-6">{[{icon:<LightningIcon className="w-8 h-8" />,title:"Instant Analysis",desc:"Get comprehensive repo insights in seconds.",metric:"10x faster"},{icon:<BrainIcon className="w-8 h-8" />,title:"AI-Powered Insights",desc:"Advanced AI understands code structure and patterns.",metric:"95% accuracy"},{icon:<ChartIcon className="w-8 h-8" />,title:"Tech Stack Breakdown",desc:"Instantly see all technologies and libraries.",metric:"50+ technologies"},{icon:<RocketIcon className="w-8 h-8" />,title:"Quick Start Guide",desc:"Get installation commands and setup instructions.",metric:"1-click setup"},{icon:<WarningIcon className="w-8 h-8" />,title:"Watch Out Alerts",desc:"Know about potential issues and pitfalls.",metric:"3-5 alerts"},{icon:<LockIcon className="w-8 h-8" />,title:"Privacy First",desc:"Your code stays private. Zero data retention.",metric:"100% private"}].map((f,i) => (<div key={i} className="group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:-translate-y-1 hover:border-cyan-500/30 transition-all duration-300"><div className="flex items-start justify-between mb-4"><div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/10">{f.icon}</div><span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">{f.metric}</span></div><h3 className="font-semibold mb-2 group-hover:text-blue-400 transition-colors">{f.title}</h3><p className="text-sm text-white/50 leading-relaxed">{f.desc}</p></div>))}</div></div></section>
            <section id="how-it-works" className="px-6 py-24 border-t border-white/5 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent"><div className="max-w-4xl mx-auto"><div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">How it works</h2><p className="text-white/50">Three simple steps to understand any repository</p></div><div className="grid md:grid-cols-3 gap-8">{[{icon:<LinkIcon className="w-12 h-12" />,num:"01",title:"Paste the URL",desc:"Copy any public GitHub URL and paste it."},{icon:<ChipIcon className="w-12 h-12" />,num:"02",title:"AI Analyzes",desc:"Our AI fetches code, README, and dependencies."},{icon:<InsightIcon className="w-12 h-12" />,num:"03",title:"Get Insights",desc:"Receive a comprehensive breakdown."}].map((s,i) => (<div key={i} className="text-center"><div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center animate-pulse">{s.icon}</div><div className="text-6xl font-bold text-white/5 mt-4">{s.num}</div><h3 className="font-semibold mt-2">{s.title}</h3><p className="text-sm text-white/50 mt-1 leading-relaxed">{s.desc}</p></div>))}</div></div></section>
            <section id="use-cases" className="px-6 py-24 border-t border-white/5"><div className="max-w-6xl mx-auto"><div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">Built for every developer</h2><p className="text-white/50">Whether evaluating open-source projects or onboarding to a new codebase</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[{icon:<CodeIcon className="w-6 h-6" />,title:"Software Engineers",desc:"Quickly evaluate third-party libraries."},{icon:<SearchIcon className="w-6 h-6" />,title:"Tech Recruiters",desc:"Understand candidates portfolio projects."},{icon:<AnalyticsIcon className="w-6 h-6" />,title:"Engineering Managers",desc:"Due diligence on open-source tools."},{icon:<LearnIcon className="w-6 h-6" />,title:"Students & Learners",desc:"Explore popular projects to learn patterns."},{icon:<StartupIcon className="w-6 h-6" />,title:"Startup Founders",desc:"Evaluate technical feasibility."},{icon:<GitBranchIcon className="w-6 h-6" />,title:"Open Source Contributors",desc:"Understand repos before contributing."}].map((u,i) => (<div key={i} className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300"><div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-3">{u.icon}</div><h3 className="font-semibold mb-2">{u.title}</h3><p className="text-sm text-white/50 leading-relaxed">{u.desc}</p></div>))}</div></div></section>
            <section className="px-6 py-24 border-t border-white/5"><div className="max-w-4xl mx-auto"><div className="grid md:grid-cols-4 gap-8 text-center
; gap-8 text-center">{[{num:"50000",label:"Repositories Analyzed"},{num:"98",label:"User Satisfaction",suffix:"%"},{num:"10",label:"Average Seconds"},{num:"Free",label:"For Public Repos"}].map((s,i) => (<div key={i}><div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">{s.num}{s.suffix || ""}</div><div className="text-xs text-white/40">{s.label}</div></div>))}</div></div></section>
            <section className="px-6 py-24 border-t border-white/5 text-center"><div className="max-w-2xl mx-auto"><h2 className="text-4xl font-bold mb-4">Ready to understand any repo?</h2><p className="text-white/50 mb-8">Join thousands of developers who use RepoRead to save time.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><button onClick={() => inputRef.current?.focus()} className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors">Try Now - It is Free</button><button className="px-8 py-3 bg-white/10 border border-white/20 font-semibold rounded-xl hover:bg-white/20 transition-colors">View on GitHub</button></div></div></section>
            <footer className="px-6 py-16 border-t border-white/5"><div className="max-w-6xl mx-auto"><div className="grid md:grid-cols-4 gap-12 mb-12"><div><div className="flex items-center gap-2 mb-4"><div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center font-bold text-xs">R</div><span className="font-semibold">RepoRead</span></div><p className="text-sm text-white/40 leading-relaxed">AI-powered GitHub repository analyzer. Understand any codebase in seconds.</p></div><div><h4 className="font-semibold text-sm mb-4">Product</h4><ul className="space-y-2 text-sm text-white/40"><li><a href="#features" className="hover:text-white transition-colors">Features</a></li><li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li><li><a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a></li></ul></div><div><h4 className="font-semibold text-sm mb-4">Resources</h4><ul className="space-y-2 text-sm text-white/40"><li><button className="hover:text-white transition-colors">Documentation</button></li><li><button className="hover:text-white transition-colors">API</button></li><li><button className="hover:text-white transition-colors">Support</button></li></ul></div><div><h4 className="font-semibold text-sm mb-4">Legal</h4><ul className="space-y-2 text-sm text-white/40"><li><button className="hover:text-white transition-colors">Privacy Policy</button></li><li><button className="hover:text-white transition-colors">Terms of Service</button></li><li><button className="hover:text-white transition-colors">Cookie Policy</button></li></ul></div></div><div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"><p className="text-xs text-white/30"> 2026 RepoRead. Built with AI. All rights reserved.</p><div className="flex items-center gap-4"><a href="#" className="text-white/30 hover:text-white transition-colors text-sm">Twitter</a><a href="#" className="text-white/30 hover:text-white transition-colors text-sm">GitHub</a><a href="#" className="text-white/30 hover:text-white transition-colors text-sm">Discord</a></div></div></div></footer>
          </div>
        ) : (
          <div className="h-[calc(100vh-56px)] flex overflow-hidden">
            <div className="flex flex-col border-r border-white/5" style={{ width: `${splitRatio}%` }}>
              <div className="px-4 py-3 border-b border-white/5 bg-[#09090B]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={handleNewAnalysis} className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>New</button>
                  <span className="text-xs text-white/30">|</span>
                  <span className="text-xs text-white/60 truncate max-w-[200px]">{result.repoName}</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-start gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-lg">R</div><div><h2 className="font-semibold text-sm">{result.repoName}</h2><p className="text-xs text-white/50 mt-0.5">{result.description}</p></div></div>
                  <div className="flex flex-wrap gap-2"><span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">{result.stars.toLocaleString()} stars</span><span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">{result.forks.toLocaleString()} forks</span>{result.language && <span className="px-2 py-0.5 bg-blue-500/20 rounded text-xs text-blue-400">{result.language}</span>}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Tech Stack</h3><div className="flex flex-wrap gap-2">{result.techStack.map((t,i) => <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs">{t}</span>)}</div></div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Key Insights</h3><ul className="space-y-2">{result.keyFeatures.map((f,i) => <li key={i} className="flex items-center gap-2 text-xs text-white/70"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{f}</li>)}</ul></div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Quick Start</h3><div className="space-y-2">{result.howToRun.map((s,i) => <div key={i} className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-xs text-white/40">{i+1}</span><code className="text-xs bg-white/5 px-2 py-1 rounded text-white/80">{s}</code></div>)}</div></div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2"><span>W</span> Watch Out</h3><ul className="space-y-2">{result.pitfalls.map((p,i) => <li key={i} className="flex items-start gap-2 text-xs text-white/60"><span className="text-yellow-500 mt-0.5">*</span>{p}</li>)}</ul></div>
              </div>
              <div className="p-3 border-t border-white/5 bg-[#09090B]/50">
                <div className="relative">
                  <div className="absolute -inset-px bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity blur-sm" />
                  <div className="relative flex items-center gap-2 px-3 py-2 bg-[#18181b] rounded-xl border border-white/10">
                    <input type="text" placeholder="Ask about this repo..." className="flex-1 bg-transparent text-xs placeholder:text-white/30 focus:outline-none" />
                    <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs hover:bg-white/20 transition-colors"> Send</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1 bg-white/5 hover:bg-blue-500/50 cursor-col-resize transition-colors shrink-0" onMouseDown={handleMouseDown} />
            <div className="flex-1 flex flex-col overflow-hidden" style={{ width: `${100-splitRatio}%` }}>
              <div className="flex items-center border-b border-white/5 bg-[#09090B]/50 shrink-0">
                <button onClick={() => setActiveTab("code")} className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === "code" ? "text-white border-blue-500" : "text-white/40 border-transparent hover:text-white/80"}`}>Code</button>
                <button onClick={() => setActiveTab("preview")} className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === "preview" ? "text-white border-blue-500" : "text-white/40 border-transparent hover:text-white/80"}`}>Preview</button>
                <div className="flex-1" />
                <button onClick={() => setTerminalOpen(!terminalOpen)} className="px-4 py-2.5 text-xs text-white/40 hover:text-white/80 flex items-center gap-1.5 transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Terminal</button>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === "code" ? (
                  <div className="flex-1 flex overflow-hidden">
                    <div className="w-48 border-r border-white/5 overflow-y-auto bg-[#0a0a0b] p-2">
                      <div className="text-xs text-white/30 px-2 py-1 mb-1">Files</div>
                      {result.readme ? <div className="space-y-0.5"><div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 text-xs text-white/70"><span>doc</span> README.md</div><div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-xs text-white/50 cursor-pointer"><span>dir</span> src/</div><div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-xs text-white/50 cursor-pointer"><span>doc</span> package.json</div></div> : <div className="text-xs text-white/30 px-2 py-1">No files</div>}
                    </div>
                    <div className="flex-1 overflow-auto bg-[#0f0f10] p-4"><div className="font-mono text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{result.readme ? result.readme.slice(0, 500) + "..." : result.description}</div></div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    <div className="h-10 bg-[#e5e5e5] border-b border-[#d1d1d1] flex items-center px-4 gap-3 shrink-0"><div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#ff5f57]" /><div className="w-3 h-3 rounded-full bg-[#febc2e]" /><div className="w-3 h-3 rounded-full bg-[#28c840]" /></div><div className="flex-1 h-7 bg-white rounded-lg px-3 flex items-center text-xs text-gray-500 border border-[#d1d1d1]">{result.url}</div></div>
                    <div className="flex-1 p-8 bg-white overflow-auto"><div className="max-w-2xl mx-auto"><div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-3xl">R</div><div><h1 className="text-2xl font-bold text-gray-900">{result.repoName}</h1><p className="text-gray-500 mt-1">{result.description}</p></div></div><div className="flex gap-4 mb-8"><span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{result.stars.toLocaleString()} stars</span><span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{result.forks.toLocaleString()} forks</span>{result.language && <span className="px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700">{result.language}</span>}</div><p className="text-gray-600 leading-relaxed">{result.readme ? result.readme.slice(0, 500) + "..." : "README content would appear here..."}</p></div></div>
                  </div>
                )}
                {terminalOpen && <div className="h-40 border-t border-white/5 bg-[#0a0a0b] p-3 overflow-auto shrink-0"><div className="font-mono text-xs text-green-400 space-y-1"><div>$ git clone https://github.com/{result.repoName}</div><div className="text-white/40">Cloning into "repo"...</div><div className="text-white/40">Receiving objects: 100%</div><div>$ cd {result.repoName.split("/")[1]}</div><div>$ npm install</div><div className="text-white/40">added 247 packages in 5s</div><div className="text-white/40">$ npm run dev</div><div className="text-green-400">Ready on http://localhost:3000</div></div></div>}
              </div>
            </div>
          </div>
        )}
      </div>
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowHistory(false)}>
          <div className="w-full max-w-sm bg-[#18181b] rounded-2xl border border-white/10 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-semibold text-sm">History</h3>
              <button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white">X</button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <p className="px-4 py-8 text-center text-white/30 text-sm">No history yet</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {history.map((h,i) => (
                    <button key={i} onClick={() => loadFromHistory(h.url)} className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors">
                      <p className="text-sm font-medium truncate">{h.repoName}</p>
                      <p className="text-xs text-white/30 mt-0.5">{new Date(h.analyzedAt).toLocaleDateString()}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
