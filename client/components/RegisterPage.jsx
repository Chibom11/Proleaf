import React from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function RegisterPage() {
    const [username, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const res = await axios.post(
                'http://localhost:5050/api/register_user',
                { username, email, password },
                { withCredentials: true }
            );
            // localStorage.setItem('user-id', res.data.user.id);
            toast.success("Connection Established")
            navigate('/welcome-page')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-mono text-slate-300 selection:bg-cyan-500/30">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            
            <div className="w-full max-w-md z-10">
                <div className="mb-10 space-y-2 border-l-2 border-cyan-500 pl-4">
                    <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic">
                        Initiate Neural Link
                    </h1>
                    <p className="text-cyan-500/60 text-xs tracking-[0.2em] font-bold">
                        PHASE 01: AGENT_SYNCHRONIZATION
                    </p>
                </div>

                <div className="bg-[#0c0c0e] border border-white/5 p-8 rounded-sm shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)] relative group">
                    {/* Corner Brackets for a "HUD" feel */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500/40"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/40"></div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="relative group">
                            <label className="text-[10px] text-slate-500 uppercase mb-2 block tracking-widest">Assign Entity Alias</label>
                            <input 
                                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-cyan-500 transition-colors text-cyan-50 placeholder:text-slate-800"
                                type='text' 
                                placeholder='USER_ID_00' 
                                value={username} 
                                onChange={(e) => setUserName(e.target.value)} 
                            />
                        </div>

                        <div className="relative">
                            <label className="text-[10px] text-slate-500 uppercase mb-2 block tracking-widest">Comm-Channel Protocol</label>
                            <input 
                                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-cyan-500 transition-colors text-cyan-50 placeholder:text-slate-800"
                                type='email' 
                                placeholder='UPLINK@NETWORK.CORE' 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        <div className="relative">
                            <label className="text-[10px] text-slate-500 uppercase mb-2 block tracking-widest">Neural Encryption Key</label>
                            <input 
                                className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-cyan-500 transition-colors text-cyan-50 placeholder:text-slate-800"
                                type='password' 
                                placeholder='••••••••' 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>

                        <button className="w-full relative overflow-hidden bg-cyan-600/10 border border-cyan-500/50 text-cyan-400 font-bold py-4 group hover:bg-cyan-500 hover:text-black transition-all duration-300">
                            <span className="relative z-10 tracking-[0.3em] text-xs">ESTABLISH HANDSHAKE</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        </button>
                    </form>

                    <div className="mt-10 flex items-center justify-between text-[9px] text-slate-600 tracking-tighter border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                            SYSTEM_READY
                        </div>
                        <button 
                            onClick={() => navigate('/login')}
                            className="hover:text-cyan-400 transition-colors uppercase"
                        >
                            [ Re-Authenticate Existing Agent ]
                        </button>
                    </div>
                </div>
                
                {/* Visual Footer Info */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="h-[1px] bg-white/5"></div>
                    <div className="text-[8px] text-center text-slate-700 uppercase tracking-widest -mt-1">Handshake v4.0</div>
                    <div className="h-[1px] bg-white/5"></div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage