import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function WelcomePage() {
  const [showModules, setShowModules] = useState(false)
  const navigate = useNavigate()

  const modules = [
    { title: "Mail Crafter", desc: "Synthesize executive replies", path: "/mail" },
    { title: "Summarize YT", desc: "Extract core intelligence", path: "/summary" },
    { title: "PDF Parser", desc: "Deep-dive data drafting", path: "/pdf" }
  ]

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-mono text-slate-300 selection:bg-blue-500/30">
      {/* Dynamic Background: Subdued Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="z-10 flex flex-col items-center max-w-4xl w-full">
        {/* Core Interface Icon */}
        <div className="mb-10 relative">
          <div className="w-20 h-20 border border-white/10 flex items-center justify-center bg-[#0c0c0e] shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
            <div className="w-10 h-10 border border-blue-500/30 rotate-45 animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_#3b82f6]"></div>
          </div>
          <div className="absolute -top-2 -left-2 w-2 h-2 border-t border-l border-blue-500"></div>
          <div className="absolute -bottom-2 -right-2 w-2 h-2 border-b border-r border-blue-500"></div>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">
            Executive <span className="text-blue-500">Agent Sync</span>
          </h1>
          <p className="text-slate-500 text-[10px] tracking-[0.3em] uppercase">
            System Ready // Standing by for Directives
          </p>
        </div>

        {/* The Action Zone: Task Initiation */}
        <div className="mt-16 flex flex-col items-center gap-12">
          <div className="group relative">
            <button 
              onClick={() => setShowModules(!showModules)}
              className={`relative z-10 w-20 h-20 bg-transparent border rounded-full flex flex-col items-center justify-center transition-all duration-500 active:scale-95 group ${showModules ? 'border-blue-500 bg-blue-500/10 rotate-45 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5'}`}
            >
              <span className={`text-3xl font-light transition-colors ${showModules ? 'text-blue-400' : 'text-white group-hover:text-blue-400'}`}>+</span>
            </button>
            
            {!showModules && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[9px] tracking-[0.4em] text-blue-400 uppercase font-bold">New Directive</span>
              </div>
            )}
          </div>

          {/* Fading Modules Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ease-out transform ${showModules ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
            {modules.map((m, i) => (
              <div 
                key={i} 
                onClick={() => navigate(m.path)}
                className="group cursor-pointer w-64 bg-[#0c0c0e] border border-white/5 p-6 rounded-sm relative overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Internal Glow Effect */}
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/15 transition-colors"></div>
                
                <div className="relative z-10 space-y-3 text-left">
                  <div className="text-blue-500 text-[10px] opacity-50 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-widest">Module_0{i+1}</div>
                  <h3 className="text-white text-sm font-bold tracking-wider uppercase group-hover:text-blue-400 transition-colors">{m.title}</h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter group-hover:text-slate-400 transition-colors">{m.desc}</p>
                </div>

                {/* Bottom Accent Bar */}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-blue-500 group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Stats Display */}
        <div className={`mt-24 w-full max-w-md bg-[#0c0c0e]/50 border border-white/5 p-4 rounded-sm transition-all duration-1000 ${showModules ? 'opacity-10 blur-sm scale-95' : 'opacity-100'}`}>
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
            <span className="text-[9px] text-slate-500 tracking-widest uppercase">Active_Protocols</span>
            <span className="text-[9px] text-blue-500 font-bold">v1.0.2</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-400 tracking-tighter italic">Auth_Link_Secure</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-1 h-1 bg-slate-700"></div>
              <span className="text-[10px] tracking-tighter italic">Latency_Check_0ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle UI Footer */}
      <div className="fixed bottom-6 w-full px-10 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity duration-500">
        <div className="text-[8px] uppercase tracking-widest">Auth: Secure_Tunnel_01</div>
        <div className="text-[8px] uppercase tracking-widest italic font-bold">Priority: Efficiency</div>
      </div>
    </div>
  )
}

export default WelcomePage