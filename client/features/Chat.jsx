import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
function Chat() {
    const [userMessage, setuserMessage] = useState("")
    const [messageList, setMessageList] = useState([
        { role: 'agent', content: 'AGENT_SESSION_INITIALIZED. READY FOR DIRECTIVES.' }
    ])
const thread_id = "1";
    
const handleSend = async (e) => {
    try {
        e.preventDefault();
        if (!userMessage.trim()) return;

        const currentMessage = userMessage; // Store it before clearing state
        const newUserMessage = { role: 'user', content: currentMessage.toUpperCase() };
        
        
        setMessageList(prev => [...prev, newUserMessage]);
        setuserMessage("");

        // HIT THE BACKEND
        const res = await axios.post('http://localhost:8000/chat', { 
            message: currentMessage,
            thread_id: "1" 
        });

        
        const airesponse = { role: 'agent', content: res.data.content };
        
        setMessageList(prev => [...prev, airesponse]);

    } catch (error) {
        console.error("Connection lost:", error.message);
        const errorMsg = { role: 'agent', content: 'CRITICAL_ERROR: UPLINK_TO_SERVER_FAILED.' };
        setMessageList(prev => [...prev, errorMsg]);
    }
}
useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:8000/history/1');
                if (res.data.messages.length > 0) {
                    setMessageList(res.data.messages);
                } else {
                    setMessageList([{ role: 'agent', content: 'SESSION_INITIALIZED. NO PREVIOUS DATA FOUND.' }]);
                }
            } catch (error) {
                console.error("Failed to sync history", error);
            }
        };
        fetchHistory();
    }, [thread_id]);
    return (
        <div className="min-h-screen bg-[#020203] font-mono text-slate-400 flex flex-col">
            {/* Top Navigation HUD */}
            <nav className="border-b border-white/5 bg-[#050507]/80 backdrop-blur-xl p-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-blue-500 font-black tracking-widest uppercase">Agent_Interface</span>
                        <span className="text-[8px] text-slate-600 uppercase tracking-[0.2em]">Active_Thread: 0x882</span>
                    </div>
                </div>
                <div className="px-3 py-1 border border-white/10 rounded-full bg-white/5 text-[9px] uppercase tracking-widest text-slate-500">
                    Neural_Handshake_Secure
                </div>
            </nav>

            {/* Terminal Output Area */}
            <main className="flex-1 overflow-y-auto px-4 py-8 space-y-8 max-w-3xl w-full mx-auto scrollbar-hide">
                {messageList.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                    >
                        {/* Sender Label */}
                        <div className="flex items-center gap-2 mb-2 opacity-30 text-[9px] uppercase tracking-[0.3em] font-bold">
                            {msg.role === 'user' ? (
                                <>OPERATOR <div className="w-1 h-1 bg-white rounded-full"></div></>
                            ) : (
                                <><div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div> AGENT_CORE</>
                            )}
                        </div>

                        {/* Message Content */}
                        <div className={`p-5 rounded-sm border max-w-[90%] relative ${
                            msg.role === 'user' 
                            ? 'bg-transparent border-white/20 text-white italic' 
                            : 'bg-[#0a0a0c] border-white/5 text-blue-100 shadow-[0_0_40px_rgba(0,0,0,0.5)]'
                        }`}>
                            {/* Decorative Corner for Agent */}
                            {msg.role === 'agent' && (
                                <div className="absolute top-0 left-0 w-1 h-1 bg-blue-500"></div>
                            )}
                            
                            <p className="text-sm leading-relaxed tracking-wide">
                                {msg.content}
                            </p>
                        </div>
                    </div>
                ))}
            </main>

            {/* Command Input Hud */}
            <div className="p-6 bg-gradient-to-t from-[#020203] via-[#020203] to-transparent border-t border-white/5">
                <form 
                    onSubmit={handleSend}
                    className="max-w-3xl mx-auto relative group flex items-center gap-4"
                >
                    <div className="flex-1 relative">
                        <input 
                            type='text' 
                            value={userMessage} 
                            placeholder='INPUT_DIRECTIVE...' 
                            onChange={(e) => setuserMessage(e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 px-0 py-4 outline-none focus:border-blue-500 transition-all text-sm uppercase tracking-widest placeholder:text-slate-800"
                        />
                        {/* Input scanning animation bar */}
                        <div className="absolute bottom-0 left-0 h-[1px] bg-blue-500 w-0 group-focus-within:w-full transition-all duration-1000"></div>
                    </div>
                    
                    <button 
                        type="submit"
                        className="bg-white hover:bg-blue-500 text-black px-6 py-2 text-[10px] font-black tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                    >
                        Exec
                    </button>
                </form>
                
                
            </div>
        </div>
    )
}

export default Chat