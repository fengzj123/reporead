const fs = require('fs');
const page = `"use client";
import { useState, useEffect, useRef } from 'react';
interface AnalysisResult {
  repoName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  techStack: string[];
  keyFeatures: string[];
  howToRun: string[];
  pitfalls: string[];
  url: string;
  readme?: string;
}
interface HistoryEntry {
  url: string;
  repoName: string;
  analyzedAt: string;
}
async function fetchGitHubData(owner: string, repo: string) {
  const headers = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'RepoRead-App' };
  const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!metaRes.ok) throw new Error(metaRes.status === 404 ? 'Repository not found' : metaRes.status === 403 ? 'Rate limit' : 'API error');
  const meta = await metaRes.json();
  const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
  let readmeContent = '';
  if (readmeRes.ok) { const d = await readmeRes.json(); readmeContent = atob(d.content); }
  return { meta, readmeContent };
}
function validateGitHubUrl(url: string) { return /^https?:\/\/github\.com\/[\w-]+\/[\w.-]+/.test(url.trim()); }
function extractOwnerRepo(url: string) {
  const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
  if (match) return { owner: match[1], repo: match[2].replace(/\/tree\/[\w.-]+$/, '') };
  return null;
}
export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [splitRatio, setSplitRatio] = useState(35);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const s = localStorage.getItem('reporead_history'); if (s) setHistory(JSON.parse(s)); }, []);
  useEffect(() => { const p = new URLSearchParams(window.location.search); const r = p.get('repo'); if (r) { setUrl(r); handleAnalyze(r); } }, []);
  async function handleAnalyze(targetUrl?: string) {
    const inputUrl = targetUrl || url;
    const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) { setError('Please enter a GitHub URL'); return; }
    if (!validateGitHubUrl(trimmedUrl)) { setError('Please enter a valid GitHub URL'); return; }
    const ownerRepo = extractOwnerRepo(trimmedUrl);
    if (!ownerRepo) { setError('Could not parse repository info'); return; }
    setIsLoading(true); setError(''); setLoadingStep('Connecting to GitHub...');
    try {
      const data = await fetchGitHubData(ownerRepo.owner, ownerRepo.repo);
      setLoadingStep('Reading README...');
      const r: AnalysisResult = {
        repoName: data.meta.full_name, description: data.meta.description || 'No description provided',
        stars: data.meta.stargazers_count, forks: data.meta.forks_count, language: data.meta.language || 'Unknown',
        techStack: [data.meta.language || 'JavaScript'],
        keyFeatures: [`${data.meta.stargazers_count.toLocaleString()} stars`, `${data.meta.forks_count.toLocaleString()} forks`, data.meta.language ? `Primary: ${data.meta.language}` : '', data.meta.license?.name ? `License: ${data.meta.license.name}` : ''].filter(Boolean) as string[],
        howToRun: [`git clone https://github.com/${ownerRepo.owner}/${ownerRepo.repo}.git`, `cd ${ownerRepo.repo}`, 'npm install', 'npm run dev', 'Open http://localhost:3000'],
        pitfalls: ['Check compatibility before use', 'Review license terms', 'Test in dev environment first'],
        url: trimmedUrl, readme: data.readmeContent
      };
      const newHistory = [{ url: trimmedUrl, repoName: r.repoName, analyzedAt: new Date().toISOString() }, ...history.filter(h => h.url !== trimmedUrl)].slice(0, 10);
      setHistory(newHistory); localStorage.setItem('reporead_history', JSON.stringify(newHistory)); setResult(r);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); } 
    finally { setIsLoading(false); }
  }
  function handleNewAnalysis() { setResult(null); setUrl(''); window.history.pushState({}, '', window.location.pathname); inputRef.current?.focus(); }
  function loadFromHistory(h: string) { setUrl(h); setShowHistory(false); handleAnalyze(h); }
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); const startX = e.clientX; const startRatio = splitRatio;
    const handleMouseMove = (ev: MouseEvent) => { const delta = ev.clientX - startX; setSplitRatio(Math.max(20, Math.min(60, startRatio + (delta / window.innerWidth) * 100))); };
    const handleMouseUp = () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
    document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp);
  };
  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans">
      <div className="fixed inset-0 pointer-events-none"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[60%] bg-gradient-radial from-blue-600/10 via-violet-600/5 to-transparent blur-[100px]" /></div>
      <header className="relative z-50 h-14 px-6 flex items-center justify-between border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-500/20">R</div><span className="font-semibold text-sm tracking-tight">RepoRead</span></div>
          <nav className="hidden md:flex items-center gap-5"><a href="#features" className="text-xs text-white/50 hover:text-white transition-colors">Features</a><a href="#how-it-works" className="text-xs text-white/50 hover:text-white transition-colors">How it works</a><a href="#use-cases" className="text-xs text-white/50 hover:text-white transition-colors">Use Cases</a></nav>
        </div>
        <div className="flex items-center gap-3"><button onClick={() => setShowHistory(true)} className="text-xs text-white/40 hover:text-white/80 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">History</button><button onClick={() => { setUrl(''); inputRef.current?.focus(); }} className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 transition-colors">Try Now</button></div>
      </header>
      <div className="relative z-10">
        {!result ? (
          <div>
            <section className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />AI-Powered GitHub Analyzer</div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] max-w-4xl"><span className="text-white">Understand any</span><br /><span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">GitHub repository</span><br /><span className="text-white">in seconds</span></h1>
              <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">Stop spending hours reading code. Paste any GitHub URL and get instant insights about tech stack, key features, dependencies, and how to get started.</p>
              <div className="w-full max-w-2xl mb-12">
                <div className="relative group">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/50 via-violet-500/50 to-fuchsia-500/50 rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-[#18181b] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5"><div className="w-3 h-3 rounded-full bg-red-500/50" /><div className="w-3 h-3 rounded-full bg-yellow-500/50" /><div className="w-3 h-3 rounded-full bg-green-500/50" /><span className="text-xs text-white/30 ml-2">GitHub URL</span></div>
                    <textarea ref={inputRef} value={url} onChange={(e) => { setUrl(e.target.value); setError(''); }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAnalyze(); } }} placeholder="Paste a GitHub URL... (e.g. github.com/facebook/react)" className="w-full px-4 py-4 bg-transparent text-white/90 placeholder:text-white/30 resize-none focus:outline-none min-h-[80px]" rows={2} />
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/5"><span className="text-xs text-white/30">Press Enter to analyze</span><button onClick={() => handleAnalyze()} disabled={isLoading || !url.trim()} className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 flex items-center gap-2">{isLoading ? <><div className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />Analyzing</> : <><span>Analyze</span><span>→</span></>}</button></div>
                  </div>
                </div>
                {error && <p className="mt-3 text-red-400 text-xs text-center">{error}</p>}
                {isLoading && <div className="mt-6 flex flex-col items-center gap-3"><div className="w-5 h-5 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin" /><p className="text-white/40 text-xs">{loadingStep}</p></div>}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-8">{['facebook/react', 'vercel/next.js', 'twbs/bootstrap', 'microsoft/vscode'].map((s) => (<button key={s} onClick={() => { setUrl(`https://github.com/${s}`); inputRef.current?.focus(); }} className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors">{s}</button>))}</div>
              <div className="text-center"><p className="text-xs text-white/30 mb-3">Trusted by developers at</p><div className="flex items-center justify-center gap-8 opacity-40">{['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map((c) => <span key={c} className="text-sm font-semibold text-white/60">{c}</span>)}</div></div>
            </section>
            <section id="features" className="px-6 py-24 border-t border-white/5"><div className="max-w-6xl mx-auto"><div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">Everything you need to understand code</h2><p className="text-white/50 max-w-xl mx-auto">Stop reading thousands of lines of code. Get actionable insights in seconds.</p></div><div className="grid md:grid-cols-3 gap-6">{[{icon:'⚡',title:'Instant Analysis',desc:'Get comprehensive repo insights in seconds.',metric:'10x faster'},{icon:'🧠',title:'AI-Powered Insights',desc:'Advanced AI understands code structure and patterns.',metric:'95% accuracy'},{icon:'📊',title:'Tech Stack Breakdown',desc:'Instantly see all technologies and libraries.',metric:'50+ technologies'},{icon:'🚀',title:'Quick Start Guide',desc:'Get installation commands and setup instructions.',metric:'1-click setup'},{icon:'⚠️',title:'Watch Out Alerts',desc:'Know about potential issues and pitfalls.',metric:'3-5 alerts'},{icon:'🔒',title:'Privacy First',desc:'Your code stays private. Zero data retention.',metric:'100% private'}].map((f,i) => (<div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"><div className="flex items-start justify-between mb-4"><div className="text-3xl">{f.icon}</div><span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">{f.metric}</span></div><h3 className="font-semibold mb-2 group-hover:text-blue-400 transition-colors">{f.title}</h3><p className="text-sm text-white/50 leading-relaxed">{f.desc}</p></div>))}</div></div></section>
            <section id="how-it-works" className="px-6 py-24 border-t border-white/5 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent"><div className="max-w-4xl mx-auto"><div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">How it works</h2><p className="text-white/50">Three simple steps to understand any repository</p></div><div className="grid md:grid-cols-3 gap-8">{[{num:'01',title:'Paste the URL',desc:'Copy any public GitHub URL and paste it.',icon:'🔗'},{num:'02',title:'AI Analyzes',desc:'Our AI fetches code, README, and dependencies.',icon:'🤖'},{num:'03',title:'Get Insights',desc:'Receive a comprehensive breakdown.',icon:'💡'}].map((s,i) => (<div key={i} className="text-center"><div className="text-5xl mb-4">{s.icon}</div><div className="text-5xl font-bold text-white/10 mb-4">{s.num}</div><h3 className="font-semibold mb-2">{s.title}</h3><p className="text-sm text-white/50 leading-relaxed">{s.desc}</p></div>))}</div></div></section>
            <section id="use-cases" className="px-6 py-24 border-t border-white/5"><div className="max-w-6xl mx-auto"><div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">Built for every developer</h2><p className="text-white/50">Whether evaluating open-source projects or onboarding to a new codebase</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[{title:'Software Engineers',desc:'Quickly evaluate third-party libraries.',icon:'💻'},{title:'Tech Recruiters',desc:"Understand candidates' portfolio projects.",icon:'👀'},{title:'Engineering Managers',desc:'Due diligence on open-source tools.',icon:'📈'},{title:'Students & Learners',desc:'Explore popular projects to learn patterns.',icon:'🎓'},{title:'Startup Founders',desc:'Evaluate technical feasibility.',icon:'🚀'},{title:'Open Source Contributors',desc:'Understand repos before contributing.',icon:'🌟'}].map((u,i) => (<div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl"><div className="text-3xl mb-3">{u.icon}</div><h3 className="font-semibold mb-2">{u.title}</h3><p className="text-sm text-white/50 leading-relaxed">{u.desc}</p></div>))}</div></div></section>
            <section className="px-6 py-24 border-t border-white/5"><div className="max-w-4xl mx-auto"><div className="grid md:grid-cols-4 gap-8 text-center">{[{num:'50K+',label:'Repositories Analyzed'},{num:'98%',label:'User Satisfaction'},{num:'10s',label:'Average Time'},{num:'Free',label:'For Public Repos'}].map((s,i) => (<div key={i}><div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">{s.num}</div><div className="text-xs text-white/40">{s.label}</div></div>))}</div></div></section>
            <section className="px-6 py-24 border-t border-white/5 text-center"><div className="max-w-2xl mx-auto"><h2 className="text-4xl font-bold mb-4">Ready to understand any repo?</h2><p className="text-white/50 mb-8">Join thousands of developers who use RepoRead to save time.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><button onClick={() => inputRef.current?.focus()} className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors">Try Now — It's Free →</button><button className="px-8 py-3 bg-white/10 border border-white/20 font-semibold rounded-xl hover:bg-white/20 transition-colors">View on GitHub</button></div></div></section>
            <footer className="px-6 py-16 border-t border-white/5"><div className="max-w-6xl mx-auto"><div className="grid md:grid-cols-4 gap-12 mb-12"><div><div className="flex items-center gap-2 mb-4"><div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-xs">R</div><span className="font-semibold">RepoRead</span></div><p className="text-sm text-white/40 leading-relaxed">AI-powered GitHub repository analyzer. Understand any codebase in seconds.</p></div><div><h4 className="font-semibold text-sm mb-4">Product</h4><ul className="space-y-2 text-sm text-white/40"><li><a href="#features" className="hover:text-white transition-colors">Features</a></li><li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li><li><a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a></li></ul></div><div><h4 className="font-semibold text-sm mb-4">Resources</h4><ul className="space-y-2 text-sm text-white/40"><li><button className="hover:text-white transition-colors">Documentation</button></li><li><button className="hover:text-white transition-colors">API</button></li><li><button className="hover:text-white transition-colors">Support</button></li></ul></div><div><h4 className="font-semibold text-sm mb-4">Legal</h4><ul className="space-y-2 text-sm text-white/40"><li><button className="hover:text-white transition-colors">Privacy Policy</button></li><li><button className="hover:text-white transition-colors">Terms of Service</button></li><li><button className="hover:text-white transition-colors">Cookie Policy</button></li></ul></div></div><div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"><p className="text-xs text-white/30">© 2026 RepoRead. Built with AI. All rights reserved.</p><div className="flex items-center gap-4"><a href="#" className="text-white/30 hover:text-white transition-colors text-sm">Twitter</a><a href="#" className="text-white/30 hover:text-white transition-colors text-sm">GitHub</a><a href="#" className="text-white/30 hover:text-white transition-colors text-sm">Discord</a></div></div></div></footer>
          </div>
        ) : (
          <div className="h-[calc(100vh-56px)] flex overflow-hidden">
            <div className="flex flex-col border-r border-white/5" style={{ width: `${splitRatio}%` }}>
              <div className="px-4 py-3 border-b border-white/5 bg-[#09090B]/50 flex items-center justify-between"><div className="flex items-center gap-3"><button onClick={handleNewAnalysis} className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>New</button><span className="text-xs text-white/30">|</span><span className="text-xs text-white/60 truncate max-w-[200px]">{result.repoName}</span></div></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><div className="flex items-start gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-lg">📦</div><div><h2 className="font-semibold text-sm">{result.repoName}</h2><p className="text-xs text-white/50 mt-0.5">{result.description}</p></div></div><div className="flex flex-wrap gap-2"><span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">⭐ {result.stars.toLocaleString()}</span><span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">🍴 {result.forks.toLocaleString()}</span>{result.language && <span className="px-2 py-0.5 bg-blue-500/20 rounded text-xs text-blue-400">{result.language}</span>}</div></div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Tech Stack</h3><div className="flex flex-wrap gap-2">{result.techStack.map((t,i) => <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs">{t}</span>)}</div></div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Key Insights</h3><ul className="space-y-2">{result.keyFeatures.map((f,i) => <li key={i} className="flex items-center gap-2 text-xs text-white/70"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{f}</li>)}</ul></div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Quick Start</h3><div className="space-y-2">{result.howToRun.map((s,i) => <div key={i} className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-xs text-white/40">{i+1}</span><code className="text-xs bg-white/5 px-2 py-1 rounded text-white/80">{s}</code></div>)}</div></div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2"><span>⚠️</span> Watch Out</h3><ul className="space-y-2">{result.pitfalls.map((p,i) => <li key={i} className="flex items-start gap-2 text-xs text-white/60"><span className="text-yellow-500 mt-0.5">•</span>{p}</li>)}</ul></div>
              </div>
              <div className="p-3 border-t border-white/5 bg-[#09090B]/50"><div className="relative"><div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-fuchsia-500/30 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity blur-sm" /><div className="relative flex items-center gap-2 px-3 py-2 bg-[#18181b] rounded-xl border border-white/10"><input type="text" placeholder="Ask about this repo..." className="flex-1 bg-transparent text-xs placeholder:text-white/30 focus:outline-none" /><button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs hover:bg-white/20 transition-colors"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button></div></div></div>
            </div>
            <div className="w-1 bg-white/5 hover:bg-blue-500/50 cursor-col-resize transition-colors shrink-0" onMouseDown={handleMouseDown} />
            <div className="flex-1 flex flex-col overflow-hidden" style={{ width: `${100-splitRatio}%` }}>
              <div className="flex items-center border-b border-white/5 bg-[#09090B]/50 shrink-0"><button onClick={() => setActiveTab('code')} className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === 'code' ? 'text-white border-blue-500' : 'text-white/40 border-transparent hover:text-white/80'}`}>Code</button><button onClick={() => setActiveTab('preview')} className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === 'preview' ? 'text-white border-blue-500' : 'text-white/40 border-transparent hover:text-white/80'}`}>Preview</button><div className="flex-1" /><button onClick={() => setTerminalOpen(!terminalOpen)} className="px-4 py-2.5 text-xs text-white/40 hover:text-white/80 flex items-center gap-1.5 transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Terminal</button></div>
              <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === 'code' ? (<div className="flex-1 flex overflow-hidden"><div className="w-48 border-r border-white/5 overflow-y-auto bg-[#0a0a0b] p-2"><div className="text-xs text-white/30 px-2 py-1 mb-1">Files</div>{result.readme ? <div className="space-y-0.5"><div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 text-xs text-white/70"><span>📄</span> README.md</div><div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-xs text-white/50 cursor-pointer"><span>📁</span> src/</div><div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-xs text-white/50 cursor-pointer"><span>📄</span> package.json</div></div> : <div className="text-xs text-white/30 px-2 py-1">No files</div>}</div><div className="flex-1 overflow-auto bg-[#0f0f10] p-4"><div className="font-mono text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{result.readme ? result.readme.slice(0, 500) + '...' : result.description}</div></div></div>) : (<div className="flex-1 flex flex-col overflow-hidden bg-white"><div className="h-10 bg-[#e5e5e5] border-b border-[#d1d1d1] flex items-center px-4 gap-3 shrink-0"><div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#ff5f57]" /><div className="w-3 h-3 rounded-full bg-[#febc2e]" /><div className="w-3 h-3 rounded-full bg-[#28c840]" /></div><div className="flex-1 h-7 bg-white rounded-lg px-3 flex items-center text-xs text-gray-500 border border-[#d1d1d1]">{result.url}</div></div><div className="flex-1 p-8 bg-white overflow-auto"><div className="max-w-2xl mx-auto"><div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-3xl">📦</div><div><h1 className="text-2xl font-bold text-gray-900">{result.repoName}</h1><p className="text-gray-500 mt-1">{result.description}</p></div></div><div className="flex gap-4 mb-8"><span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">⭐ {result.stars.toLocaleString()}</span><span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">🍴 {result.forks.toLocaleString()}</span>{result.language && <span className="px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700">{result.language}</span>}</div><p className="text-gray-600 leading-relaxed">{result.readme ? result.readme.slice(0, 500) + '...' : 'README content would appear here...'}</p></div></div></div>)}
                {terminalOpen && <div className="h-40 border-t border-white/5 bg-[#0a0a0b] p-3 overflow-auto shrink-0"><div className="font-mono text-xs text-green-400 space-y-1"><div>$ git clone https://github.com/{result.repoName}</div><div className="text-white/40">Cloning into 'repo'...</div><div className="text-white/40">Receiving objects: 100%</div><div>$ cd {result.repoName.split('/')[1]}</div><div>$ npm install</div><div className="text-white/40">added 247 packages in 5s</div><div className="text-white/40">$ npm run dev</div><div className="text-green-400">✓ Ready on http://localhost:3000</div></div></div>}
              </div>
            </div>
          </div>
        )}
      </div>
      {showHistory && (<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowHistory(false)}><div className="w-full max-w-sm bg-[#18181b] rounded-2xl border border-white/10 overflow-hidden" onClick={(e) => e.stopPropagation()}><div className="px-4 py-3 border-b border-white/5 flex justify-between items-center"><h3 className="font-semibold text-sm">History</h3><button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white">✕</button></div><div className="max-h-64 overflow-y-auto">{history.length === 0 ? <p className="px-4 py-8 text-center text-white/30 text-sm">No history yet</p> : <div className="divide-y divide-white/5">{history.map((h,i) => (<button key={i} onClick={() => loadFromHistory(h.url)} className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors"><p className="text-sm font-medium truncate">{h.repoName}</p><p className="text-xs text-white/30 mt-0.5">{new Date(h.analyzedAt).toLocaleDateString()}</p></button>))}</div>}</div></div>)}
    </div>
  );
}`;

fs.writeFileSync('src/app/page.tsx', page);
console.log('Page written:', page.length, 'chars');
