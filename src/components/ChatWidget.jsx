import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi! I'm here to help you generate reports about the datasets in your database. You can ask me things like 'Find out how many datasets have information about ethnicity'." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Dragging state
    const [position, setPosition] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ offsetX: 0, offsetY: 0 });
    const widgetRef = useRef(null);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Dragging logic
    const handleMouseDown = (e) => {
        if (!widgetRef.current) return;
        const rect = widgetRef.current.getBoundingClientRect();
        setIsDragging(true);
        dragStartPos.current = {
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        };
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragStartPos.current.offsetX,
                    y: e.clientY - dragStartPos.current.offsetY
                });
            }
        };
        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

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
                body: JSON.stringify({ question: query, context: 'public' })
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
        "Which datasets have information on Breast Cancer?",
        "Find datasets with genomic sequences",
        "How many datasets include ethnicity data?"
    ];

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-[#E40085] hover:bg-[#c90075] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-50"
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h2v2H9V9zm4 0h2v2h-2V9z"></path></svg>
            </button>
        );
    }

    return (
        <div 
            ref={widgetRef}
            style={position ? { left: position.x, top: position.y, bottom: 'auto', right: 'auto' } : {}}
            className={`fixed ${!position ? 'bottom-6 right-6' : ''} w-96 h-[500px] min-w-[300px] min-h-[400px] resize overflow-hidden bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col z-50`}
        >
            {/* Header */}
            <div 
                onMouseDown={handleMouseDown}
                className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200 cursor-move select-none"
            >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#E40085] rounded-full animate-pulse"></div>
                    <h3 className="text-gray-800 font-semibold">Datahub Analytics AI</h3>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.role === 'user' 
                            ? 'bg-[#E40085] text-white rounded-br-none' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                        }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                
                {messages.length === 1 && (
                    <div className="flex flex-col gap-2 mt-4">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Suggestions</p>
                        {starterPrompts.map((prompt, idx) => (
                            <button 
                                key={idx}
                                onClick={() => handleSend(prompt)}
                                className="text-left text-sm bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg border border-gray-200 shadow-sm transition-colors"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-[#E40085] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                            <div className="w-1.5 h-1.5 bg-[#E40085] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-1.5 h-1.5 bg-[#E40085] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your datasets..."
                        className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#E40085] focus:border-transparent"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-[#E40085] hover:bg-[#c90075] disabled:opacity-50 disabled:hover:bg-[#E40085] text-white p-2 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                </form>
            </div>
            
            {/* CSS Resize Handle Note: Tailwind's `resize` adds a small handle in the bottom right corner automatically */}
        </div>
    );
};

export default ChatWidget;
