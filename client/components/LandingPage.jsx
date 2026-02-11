import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()
  const [bootText, setBootText] = useState("")
  const fullText = "Initializing Proleaf Intelligence Layer..."

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setBootText(fullText.slice(0, i))
      i++
      if (i > fullText.length) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050505] text-slate-300 font-mono overflow-hidden selection:bg-cyan-500/30">

      {/* Ambient Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Scan Line */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">

        {/* Boot Text */}
        <div className="absolute top-10 text-[10px] tracking-widest text-cyan-500/70">
          {bootText}
          <span className="animate-pulse">█</span>
        </div>

        {/* Header */}
        <div className="mb-16 space-y-4 text-center">

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
            <span className="text-[10px] tracking-[0.4em] text-cyan-500 uppercase">
              Neural Core Active
            </span>
          </div>

          <h1 className="relative text-6xl font-bold tracking-tighter text-white uppercase italic">
            PROLEAF
            <span className="absolute inset-0 blur-3xl bg-cyan-500/20 animate-glow-pulse -z-10"></span>
          </h1>

          <p className="text-xs text-slate-500 tracking-[0.3em] uppercase">
            Document Intelligence Terminal
          </p>

          <div className="w-24 h-[1px] bg-cyan-500/40 mx-auto mt-4"></div>
        </div>

        {/* Core Panel */}
        <div className="max-w-2xl w-full bg-[#0c0c0e]/90 backdrop-blur-sm border border-white/5 p-10 shadow-[0_0_80px_-20px_rgba(6,182,212,0.2)] relative transition-all duration-500 hover:shadow-[0_0_100px_-10px_rgba(6,182,212,0.35)] animate-fade-in">

          {/* HUD Corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500/40"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/40"></div>

          <div className="space-y-6 text-sm leading-relaxed text-slate-400">
            <p>
              Upload any document. Convert static pages into an interactive intelligence layer.
            </p>

            <p>
              Query. Extract. Analyze. Operate.
            </p>

            <div className="border-l-2 border-cyan-500 pl-4 text-cyan-400 text-xs tracking-widest uppercase">
              One Thread. One Document. Total Context Control.
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6">

            <button
              onClick={() => navigate('register')}
              className="relative overflow-hidden flex-1 bg-cyan-600/10 border border-cyan-500/50 text-cyan-400 font-bold py-4 group hover:bg-cyan-500 hover:text-black transition-all duration-300"
            >
              <span className="relative z-10 tracking-[0.3em] text-xs">
                INITIATE ACCESS
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>

            <button
              onClick={() => navigate('login')}
              className="relative overflow-hidden flex-1 bg-transparent border border-white/10 text-slate-400 font-bold py-4 group hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300"
            >
              <span className="tracking-[0.3em] text-xs">
                AUTHENTICATE
              </span>
            </button>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center justify-between text-[9px] text-slate-600 tracking-tight border-t border-white/5 pt-4 w-full max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
            PROLEAF_CORE_v1.0
          </div>
          <div>
            REPO-LA-FA STACK ACTIVE
          </div>
        </div>

      </div>
    </div>
  )
}

export default LandingPage
