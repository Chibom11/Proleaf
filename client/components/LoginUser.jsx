import React from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function LoginUser() {
    const [username, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const res = await axios.post(
                'http://localhost:5050/api/login',
                { username, email, password },
                { withCredentials: true }
            );
            localStorage.setItem('user-id', res.data.user.id);
            toast.success("Identity Verified")
            navigate('/welcome-page')
        } catch (error) {
            console.log(error)
            toast.error("Authentication Failed")
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-mono text-slate-300 selection:bg-amber-500/30">
            {/* Ambient Background Grid - Consistent with Landing */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            
            <div className="w-full max-w-md z-10">
                <div className="mb-10 space-y-2 border-l-2 border-amber-500 pl-4">
                    <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic">
                        Resume Neural Link
                    </h1>
                    <p className="text-amber-500/60 text-xs tracking-[0.2em] font-bold">
                        PHASE 02: IDENTITY_VERIFICATION
                    </p>
                </div>

                <div className="bg-[#0c0c0e] border border-white/5 p-8 rounded-sm shadow-[0_0_50px_-12px_rgba(245,158,11,0.15)] relative group">
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber-500/40"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-amber-500/40"></div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="relative group">
                            <label className="text-[10px] text-slate-500 uppercase mb-2 block tracking-widest">Entity Alias</label>
                            <input 
                                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-amber-500 transition-colors text-amber-50 placeholder:text-slate-800"
                                type='text' 
                                placeholder='RECALL_USER_ID' 
                                value={username} 
                                onChange={(e) => setUserName(e.target.value)} 
                            />
                        </div>

                        <div className="relative">
                            <label className="text-[10px] text-slate-500 uppercase mb-2 block tracking-widest">Comm-Channel</label>
                            <input 
                                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-amber-500 transition-colors text-amber-50 placeholder:text-slate-800"
                                type='email' 
                                placeholder='UPLINK_PROTOCOL' 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        <div className="relative">
                            <label className="text-[10px] text-slate-500 uppercase mb-2 block tracking-widest">Neural Key</label>
                            <input 
                                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-amber-500 transition-colors text-amber-50 placeholder:text-slate-800"
                                type='password' 
                                placeholder='••••••••' 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>

                        <button className="w-full relative overflow-hidden bg-amber-600/10 border border-amber-500/50 text-amber-400 font-bold py-4 group hover:bg-amber-500 hover:text-black transition-all duration-300">
                            <span className="relative z-10 tracking-[0.3em] text-xs">RE-ESTABLISH CONNECTION</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        </button>
                    </form>

                    <div className="mt-10 flex items-center justify-between text-[9px] text-slate-600 tracking-tighter border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2 text-amber-500/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                            WAITING_FOR_HANDSHAKE
                        </div>
                        <button 
                            onClick={() => navigate('/')}
                            className="hover:text-amber-400 transition-colors uppercase"
                        >
                            [ Register New Agent ]
                        </button>
                    </div>
                </div>
                
                {/* Visual Footer Info */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="h-[1px] bg-white/5"></div>
                    <div className="text-[8px] text-center text-slate-700 uppercase tracking-widest -mt-1">Identity v4.0</div>
                    <div className="h-[1px] bg-white/5"></div>
                </div>
            </div>
        </div>
    )
}

export default LoginUser