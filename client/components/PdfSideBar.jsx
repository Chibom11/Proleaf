import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import axios from 'axios'

function PdfSideBar() {
  const navigate = useNavigate()
  const [threads, setThreads] = useState([])
  const user_id = parseInt(localStorage.getItem('user-id'))
  const [hide, setHide] = useState(true)

  const getThreads = async () => {
    if (!user_id) return;
    try {
      const res = await axios.post('http://localhost:8000/get-threads', { user_id });
      setThreads(res.data.all_threads);
    } catch (err) {
      console.error("Fetch threads error:", err);
    }
  }

  const handleDeleteThread = async (thread_id, user_id) => {
    await axios.delete('http://localhost:8000/delete-thread', { data: { user_id: user_id, thread_id: thread_id } })
    await getThreads()
    window.history.go(-1);
  }

  const handleNewThread = async () => {
    const newThread = crypto.randomUUID();
    try {
      await axios.post('http://localhost:8000/create-thread', {
        user_id: user_id,
        thread_id: newThread
      });
      await getThreads();
      navigate(`/pdf/pdfuploads/${newThread}`);
    } catch (err) {
      console.error("Error creating thread", err);
    }
  }

  useEffect(() => {
    getThreads()
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050505] text-slate-300 font-mono overflow-hidden">
      {/* Ambient Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Main Layout Container */}
      <div className="relative z-10 flex h-screen">
        
        {/* SIDEBAR TOGGLE (Floating Tab) */}
        <button 
          onClick={() => setHide(!hide)}
          className="absolute bottom-6 left-6 z-50 p-3 bg-[#0c0c0e] border border-cyan-500/30 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all duration-300 rounded-sm text-[10px] tracking-widest font-bold uppercase"
        >
          {hide ? "[ COLLAPSE_HUB ]" : "[ EXPAND_HUB ]"}
        </button>

        {/* LEFT SIDEBAR */}
        {hide && (
          <div className="w-[320px] bg-[#0c0c0e]/80 backdrop-blur-md border-r border-white/5 flex flex-col animate-in slide-in-from-left duration-500">
            
            {/* Sidebar Header */}
            <div className="p-8 border-b border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] tracking-[0.4em] text-cyan-500 uppercase font-bold">Threads_Database</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tighter italic">ACTIVE_LOGS</h2>
            </div>

            {/* Action Area */}
            <div className="p-6">
              <button 
                onClick={handleNewThread}
                className="w-full py-4 bg-cyan-600/10 border border-cyan-500/50 text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
              >
                + INITIALIZE_NEW_THREAD
              </button>
            </div>

            {/* Threads List */}
            <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-24 scrollbar-hide">
              {threads.map((el) => (
                <div key={el} className="group relative">
                  <NavLink 
                    to={`pdfuploads/${el}`}
                    className={({ isActive }) => 
                      `flex items-center justify-between p-4 border transition-all duration-300 ${
                        isActive 
                        ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" 
                        : "bg-transparent border-transparent text-slate-500 hover:border-white/10 hover:text-slate-300"
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-[8px] opacity-50 font-bold">0x{el.slice(0, 4)}</span>
                      <p className="text-xs tracking-wider truncate uppercase">Intelligence_Report</p>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteThread(el, user_id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500/50 hover:text-red-500 transition-all text-[10px]"
                    >
                      [DEL]
                    </button>
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIGHT PANEL (Main Terminal) */}
        <div className="flex-1 relative overflow-y-auto">
          {/* HUD CORNER ACCENT */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-cyan-500/10 pointer-events-none"></div>
          
          <div className="p-12">
            <Outlet />
          </div>

          {/* BACKGROUND SCAN LINE */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan opacity-20"></div>
        </div>
      </div>
    </div>
  )
}

export default PdfSideBar