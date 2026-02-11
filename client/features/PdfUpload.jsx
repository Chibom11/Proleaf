import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
function PdfUpload() {
    const navigate=useNavigate()
    const { id } = useParams();
    const [threaddetails, setThreaddetails] = useState([]);
    const [pdf, setPdf] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputMessage,setInputMessage]=useState([])
    const [messages,setMessages]=useState([])
    
    const user_id = parseInt(localStorage.getItem('user-id'));

    // Function to fetch status (reusable)
    const fetchThreadStatus = async (targetId) => {
        try {
            const td = await axios.post('http://localhost:8000/get-thread-details', {
                thread_id: targetId
            });
            console.log(td)

           
            setThreaddetails(td.data.details[0]);
            
            
        } catch (error) {
            console.error("Error fetching thread details:", error);
            setThreaddetails([]); // Reset on error
        }    
    };    
    
    // const handleFailure=async()=>{
    //                 await axios.delete('http://localhost:8000/upload-failed',{thread_id:String(id)})
    //                 toast.error("Upload Failed")
    //     }

    // This triggers every time the URL ID changes (Sidebar switch)
    useEffect(() => {
        if (id) {
            setPdf(null); 
            fetchThreadStatus(id);
            getUserandAgentMessages(id);
        }    
    }, [id]); // CRITICAL: Watch for ID changes    

    const handleUpload = async () => {
        if (!pdf) return;
        setLoading(true);
        try {
            const form = new FormData();
            form.append('user_id', user_id);
            form.append('thread_id', id);
            form.append('file', pdf);

            await axios.post('http://localhost:8000/upload-pdf', form, { withCredentials: true });
            
            // After upload succeeds, fetch status to hide the upload UI
            await fetchThreadStatus(id);
        
        } catch (error) {
        } finally {
            setLoading(false);
        }    
    }    

const handleMessages = async () => {
    if (!inputMessage.trim()) return;

    const currentQuestion = inputMessage;
    setInputMessage(""); // Clear input immediately
    const userMessage = { role: 'user', content: currentQuestion };
    setMessages((prev) => [...prev, userMessage]);

    try {
        await axios.post('http://localhost:8000/ask', {
            user_id: Number(user_id),
            thread_id: String(id),
            question: currentQuestion
        });    
        
        // Refresh the chat list to show the new question and the AI's answer
        await getUserandAgentMessages(id);
    } catch (error) {
        console.error("Failed to send message:", error);
    }    
};    
  const getUserandAgentMessages=async(threadid)=>{
    const res=await axios.post('http://localhost:8000/get-thread-messages',{thread_id:threadid})  
    setMessages(res.data.messages)
    console.log(res.data)
  }  


    const isCompleted = threaddetails?.status?.includes('completed')
        


    if (loading) return <p>Processing PDF...</p>;

   return (
    
    <div className="max-w-4xl mx-auto min-h-screen p-6 bg-gray-50">
            <button 
                onClick={() => navigate('/welcome-page')}
                className="text-[12px] text-slate-700 hover:text-cyan-400 uppercase tracking-[0.8em] transition-all hover:gap-8 flex items-center justify-center mx-auto group font-bold"
            >
                <span className="opacity-0 group-hover:opacity-100 transition-all text-cyan-500">{"<<<"}</span>
                [ Return to Mainframe ]
                <span className="opacity-0 group-hover:opacity-100 transition-all text-cyan-500">{">>>" }</span>
            </button>
        {isCompleted ? (
            <div className="flex flex-col h-[85vh] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-white">
                    <h3 className="text-green-600 font-bold flex items-center gap-2">
                        <span className="text-xl"></span> Intelligence Extracted
                    </h3>
                    <h1 className="text-sm text-gray-500 truncate mt-1">
                        File: {threaddetails?.filename || "Document Ready"}
                    </h1>
                </div>
                
                {/* Message Display Area */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
                    {messages.map((el, index) => (
                        <div 
                            key={index} 
                            className={`flex flex-col ${el.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                                el.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                            }`}>
                                <p className="leading-relaxed">{el.content}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1 uppercase font-medium">
                                {el.role === 'user' ? 'You' : 'AI'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Ask me about the PDF..." 
                        className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        value={inputMessage} 
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleMessages()}
                    />
                    <button 
                        onClick={handleMessages}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-md active:scale-95"
                    >
                        Send
                    </button>
                </div>
            </div>
        ) : (
            /* Upload View */
            <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload PDF to Thread</h2>
                <p className="text-gray-500 mb-6 italic">{id}</p>
                
                <label className="flex flex-col items-center gap-4">
                    <input 
                        type="file" 
                        accept=".pdf" 
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        onChange={(e) => setPdf(e.target.files[0])} 
                    />
                    
                    {pdf && (
                        <button 
                            onClick={handleUpload}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:-translate-y-1 shadow-lg"
                        >
                            Start Intelligence Extraction
                        </button>
                    )}
                </label>
            </div>
        )}
   
    </div>
     
        
);
}

export default PdfUpload;