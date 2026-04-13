#!/usr/bin/env python3
# Appends the workspace view (part 2)

part2 = '''          <div className="h-[calc(100vh-56px)] flex overflow-hidden">
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
                  <div className="flex items-start gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-lg">📦</div><div><h2 className="font-semibold text-sm">{result.repoName}</h2><p className="text-xs text-white/50 mt-0.5">{result.description}</p></div></div>
                  <div className="flex flex-wrap gap-2"><span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">⭐ {result.stars.toLocaleString()}</span><span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">🍴 {result.forks.toLocaleString()}</span>{result.language && <span className="px-2 py-0.5 bg-blue-500/20 rounded text-xs text-blue-400">{result.language}</span>}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Tech Stack</h3><div className="flex flex-wrap gap-2">{result.techStack.map((t,i) => <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs">{t}</span>)}</div></div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Key Insights</h3><ul className="space-y-2">{result.keyFeatures.map((f,i) => <li key={i} className="flex items-center gap-2 text-xs text-white/70"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{f}</li>)}</ul></div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Quick Start</h3><div className="space-y-2">{result.howToRun.map((s,i) => <div key={i} className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-xs text-white/40">{i+1}</span><code className="text-xs bg-white/5 px-2 py-1 rounded text-white/80">{s}</code></div>)}</div></div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10"><h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2"><span>⚠️</span> Watch Out</h3><ul className="space-y-2">{result.pitfalls.map((p,i) => <li key={i} className="flex items-start gap-2 text-xs text-white/60"><span className="text-yellow-500 mt-0.5">•</span>{p}</li>)}</ul></div>
              </div>
              <div className="p-3 border-t border-white/5 bg-[#09090B]/50">
                <div className="relative">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-fuchsia-500/30 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity blur-sm" />
                  <div className="relative flex items-center gap-2 px-3 py-2 bg-[#18181b] rounded-xl border border-white/10">
                    <input type="text" placeholder="Ask about this repo..." className="flex-1 bg-transparent text-xs placeholder:text-white/30 focus:outline-none" />
                    <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs hover:bg-white/20 transition-colors"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
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
                      {result.readme ? <div className="space-y-0.5"><div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 text-xs text-white/70"><span>📄</span> README.md</div><div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-xs text-white/50 cursor-pointer"><span>📁</span> src/</div><div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-xs text-white/50 cursor-pointer"><span>📄</span> package.json</div></div> : <div className="text-xs text-white/30 px-2 py-1">No files</div>}
                    </div>
                    <div className="flex-1 overflow-auto bg-[#0f0f10] p-4"><div className="font-mono text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{result.readme ? result.readme.slice(0, 500) + "..." : result.description}</div></div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    <div className="h-10 bg-[#e5e5e5] border-b border-[#d1d1d1] flex items-center px-4 gap-3 shrink-0"><div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#ff5f57]" /><div className="w-3 h-3 rounded-full bg-[#febc2e]" /><div className="w-3 h-3 rounded-full bg-[#28c840]" /></div><div className="flex-1 h-7 bg-white rounded-lg px-3 flex items-center text-xs text-gray-500 border border-[#d1d1d1]">{result.url}</div></div>
                    <div className="flex-1 p-8 bg-white overflow-auto"><div className="max-w-2xl mx-auto"><div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-3xl">📦</div><div><h1 className="text-2xl font-bold text-gray-900">{result.repoName}</h1><p className="text-gray-500 mt-1">{result.description}</p></div></div><div className="flex gap-4 mb-8"><span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">⭐ {result.stars.toLocaleString()}</span><span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">🍴 {result.forks.toLocaleString()}</span>{result.language && <span className="px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700">{result.language}</span>}</div><p className="text-gray-600 leading-relaxed">{result.readme ? result.readme.slice(0, 500) + "..." : "README content would appear here..."}</p></div></div>
                  </div>
                )}
                {terminalOpen && <div className="h-40 border-t border-white/5 bg-[#0a0a0b] p-3 overflow-auto shrink-0"><div className="font-mono text-xs text-green-400 space-y-1"><div>$ git clone https://github.com/{result.repoName}</div><div className="text-white/40">Cloning into "repo"...</div><div className="text-white/40">Receiving objects: 100%</div><div>$ cd {result.repoName.split("/")[1]}</div><div>$ npm install</div><div className="text-white/40">added 247 packages in 5s</div><div className="text-white/40">$ npm run dev</div><div className="text-green-400">✓ Ready on http://localhost:3000</div></div></div>}
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
              <button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white">✕</button>
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
'''

with open('src/app/page.tsx', 'a') as f:
    f.write(part2)
print("Part 2 appended, total bytes:", 24173 + len(part2))
