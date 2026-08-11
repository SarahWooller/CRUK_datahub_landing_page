import React, { useState, useRef, useEffect } from 'react';

export const AdminAnalyticsTab = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Welcome to the Admin Analytics Dashboard. You can ask me to generate reports or statistical summaries about all datasets in the hub, such as 'Break down the total datasets by cancer type'." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text) => {
        const query = text || input;
        if (!query.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: query }]);
        setInput('');
        setIsLoading(true);

        try {
            const aiUrl = import.meta.env.VITE_AI_URL || "http://localhost:8001";
            const response = await fetch(`${aiUrl}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: query, context: 'admin' })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                text: data.answer || "I couldn't process that query."
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                text: "Sorry, I'm having trouble connecting to the analytics server right now." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const starterPrompts = [
        "Generate a breakdown of datasets by cancer type",
        "Which lead research institutes have contributed the most datasets?",
        "What is the total population size across all datasets?",
        "How many datasets include ethnicity data?"
    ];

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col h-[700px]">
            <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#E40085]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    AI Analytics & Governance
                </h2>
                <p className="text-gray-500 text-sm mt-1">Ask questions about your data hub to generate statistical reports instantly.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-[#E40085] text-white rounded-br-none' 
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}>
                            <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                
                {messages.length === 1 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                        {starterPrompts.map((prompt, idx) => (
                            <button 
                                key={idx}
                                onClick={() => handleSend(prompt)}
                                className="text-sm bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-full border border-gray-300 shadow-sm transition-colors"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-[#E40085] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                            <div className="w-2 h-2 bg-[#E40085] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-2 h-2 bg-[#E40085] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-3 max-w-4xl mx-auto"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for a statistical breakdown..."
                        className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E40085] focus:border-transparent transition-all shadow-sm"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-[#E40085] hover:bg-[#c90075] disabled:opacity-50 disabled:hover:bg-[#E40085] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center min-w-[100px]"
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </form>
            </div>
        </div>
    );
};
