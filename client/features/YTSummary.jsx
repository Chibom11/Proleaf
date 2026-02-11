import React, { useState } from 'react'
import axios from 'axios'

function YtSummary() {
  const [url, setUrl] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedTranscript, setCopiedTranscript] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log(String(url))
    try {
      const res = await axios.post(
        'http://localhost:8000/get-summary',
        { url:String(url) }
      )
      setSummary(res.data.content)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    // Extract summary only (everything before the transcript marker)
    const reportOnly = summary.split('(TrAnScRiPt)')[0];
    navigator.clipboard.writeText(reportOnly)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyTranscript = () => {
    // Extract transcript only (everything after the transcript marker)
    const parts = summary.split('(TrAnScRiPt)');
    if (parts.length > 1) {
      navigator.clipboard.writeText(parts[1].trim())
      setCopiedTranscript(true)
      setTimeout(() => setCopiedTranscript(false), 2000)
    }
  }

  const renderFormattedSummary = (text) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();

      // TARGETING THE (TrAnScRiPt) MARKER
      if (trimmedLine.includes('(TrAnScRiPt)')) {
        const rawContent = trimmedLine.replace('(TrAnScRiPt)', '').trim();
        return (
          <div key={index} className="mt-16 border-t border-white/10 pt-10">
            <h3 className="text-cyan-500/50 text-[10px] uppercase tracking-[0.5em] mb-6 font-bold">
              [ RAW_SOURCE_LOG_ENTRY ]
            </h3>
            <div className="bg-black/40 p-6 rounded-sm border border-white/5 font-mono text-[11px] leading-relaxed text-slate-500 italic whitespace-pre-wrap">
              {rawContent}
            </div>
          </div>
        );
      }
      
      // TARGETING THE (HeAdInG) MARKER FROM BACKEND
      if (trimmedLine.includes('(HeAdInG)')) {
        const cleanHeading = trimmedLine.replace('(HeAdInG)', '').trim();
        return (
          <h2 
            key={index} 
            className="text-cyan-400 font-black text-4xl mt-16 mb-8 flex items-center gap-5 uppercase tracking-tighter"
            style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.6)' }}
          >
            <div className="flex flex-col gap-1">
              <span className="w-3 h-10 bg-cyan-400 shadow-[0_0_20px_#22d3ee]"></span>
            </div>
            {cleanHeading}
          </h2>
        );
      }
      
      // Bullet Points / List Detection
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.match(/^\d+\./)) {
        return (
          <div key={index} className="flex gap-4 ml-8 mb-4 group">
            <span className="text-cyan-500 mt-1.5 shrink-0 group-hover:translate-x-1 transition-transform">▶</span>
            <p className="text-slate-300 leading-relaxed text-base opacity-90">
              {trimmedLine.replace(/^[-•]\s*/, '')}
            </p>
          </div>
        );
      }

      // Standard Content
      if (trimmedLine.length > 0) {
        return (
          <p key={index} className="text-slate-400 mb-6 leading-relaxed text-base pl-10 border-l-2 border-white/5 ml-3 font-medium">
             {trimmedLine}
          </p>
        );
      }

      return <div key={index} className="h-4"></div>;
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center py-24 px-6 font-mono text-slate-300 selection:bg-cyan-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyan-500/5 blur-[160px] rounded-full animate-pulse"></div>
      </div>

      <div className="z-10 w-full max-w-5xl">
        <div className="mb-16 space-y-3 border-l-4 border-cyan-500 pl-8">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Intelligence <span className="text-cyan-400 text-5xl">Extraction</span>
          </h1>
          <p className="text-slate-600 text-[12px] tracking-[0.6em] uppercase font-bold">
            Status: Synchronized // Port: 8000
          </p>
        </div>

        <div className="bg-[#0c0c0e] border border-white/5 p-10 rounded-sm shadow-[0_0_100px_-30px_rgba(34,211,238,0.2)] relative mb-20">
          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-cyan-500/30"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-cyan-500/30"></div>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="PASTE_YT_SOURCE_FOR_DECODING..."
              className="flex-1 bg-black/60 border border-white/10 rounded-sm px-8 py-5 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all text-xl text-cyan-50 placeholder:text-slate-800 font-mono"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-cyan-900/10 border-2 border-cyan-500/50 text-cyan-400 font-black px-16 py-5 rounded-sm hover:bg-cyan-500 hover:text-black transition-all duration-500 disabled:opacity-50 tracking-[0.3em] text-sm uppercase shadow-glow"
            >
              {loading ? "PROCESSING..." : "EXECUTE"}
            </button>
          </form>
        </div>

        {summary && (
          <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-32">
            <div className="flex items-center gap-10 mb-12">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-white/10"></div>
              <span className="text-xs uppercase tracking-[0.8em] text-cyan-400 font-black italic">Source_Decoded</span>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-cyan-500/50 to-white/10"></div>
            </div>

            <div className="bg-[#0c0c0e]/95 border border-white/10 p-12 md:p-24 rounded-sm relative overflow-hidden backdrop-blur-3xl shadow-2xl">
              
              {/* BUTTON GROUP HUD */}
              <div className="absolute top-10 right-10 z-20 flex gap-4">
                {/* Copy Transcript Button */}
                <button 
                    onClick={handleCopyTranscript}
                    className="flex items-center gap-3 px-6 py-3 border-2 border-white/5 bg-black/80 hover:border-cyan-500/50 transition-all group"
                >
                    <span className={`text-[11px] uppercase tracking-[0.2em] font-black ${copiedTranscript ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {copiedTranscript ? 'LOG_CLONED' : 'COPY_TRANSCRIPT'}
                    </span>
                </button>

                {/* Copy Intel Button */}
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-3 px-6 py-3 border-2 border-cyan-500/20 bg-black/80 hover:border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all group"
                >
                    <span className={`text-[11px] uppercase tracking-[0.2em] font-black ${copied ? 'text-black' : 'text-cyan-400'}`}>
                    {copied ? 'BUFFER_CLONED' : 'COPY_INTEL'}
                    </span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                </button>
              </div>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent)] pointer-events-none"></div>
              
              <div className="relative z-10">
                {renderFormattedSummary(summary)}
              </div>

              <div className="mt-24 pt-12 border-t border-white/10 flex flex-wrap justify-between gap-10 text-[12px] text-slate-700 tracking-[0.4em] uppercase font-black italic">
                <span>Neural_Verified: TRUE</span>
                <span>Thread_Lock: {Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
              </div>
            </div>
          </section>
        )}

        <div className="mt-12 text-center pb-20">
            {!loading ? <button 
                onClick={() => window.history.back()}
                className="text-[12px] text-slate-700 hover:text-cyan-400 uppercase tracking-[0.8em] transition-all hover:gap-8 flex items-center justify-center mx-auto group font-bold"
            >
                <span className="opacity-0 group-hover:opacity-100 transition-all text-cyan-500">{"<<<"}</span>
                [ Return to Mainframe ]
                <span className="opacity-0 group-hover:opacity-100 transition-all text-cyan-500">{">>>" }</span>
            </button>:<></>}
        </div>
      </div>
    </div>
  )
}

export default YtSummary