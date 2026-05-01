import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import axios from 'axios';

// Get API base URL from env or use default for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Namaste! I am your CitiServe Assistant. How can I help you with laws, schemes, or civic issues today?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, { message: userMsg });
      
      if (response.data.success) {
        setMessages(prev => [...prev, { text: response.data.data, isUser: false }]);
      } else {
        setMessages(prev => [...prev, { text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", isUser: false, isError: true }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error.response?.data?.message || "I'm having trouble connecting to the backend. Please ensure the server is running.";
      setMessages(prev => [...prev, { text: errorMessage, isUser: false, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#FF9933] hover:bg-[#E68A2E] text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-orange-300"
          aria-label="Open Chat Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 transition-all transform origin-bottom-right">
          
          {/* Header */}
          <div className="bg-[#138808] text-white p-4 flex justify-between items-center shadow-md">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                CitiServe Assistant
              </h3>
              <p className="text-green-100 text-xs">AI-Powered Civic Help</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-200 focus:outline-none transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.isUser 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : msg.isError 
                        ? 'bg-red-50 text-red-600 border border-red-100 rounded-bl-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                  }`}
                >
                  {/* Basic markdown-like rendering for bold text or line breaks could be added here, but keeping it simple for now */}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 text-slate-500 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-slate-100 text-slate-800 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF9933] border border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-[#000080] hover:bg-blue-800 text-white p-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
