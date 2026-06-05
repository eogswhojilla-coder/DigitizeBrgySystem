import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, ArrowDown, Sparkles } from "lucide-react";
import axios from "axios";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, text: "Hello! 👋 Welcome to the Barangay AI Assistant. How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [showPrompts, setShowPrompts] = useState(true);
  const bottomRef = useRef(null);

  // Generate session ID on component mount
  useEffect(() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(id);
    fetchPrompts();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Fetch predefined prompts
  const fetchPrompts = async () => {
    try {
      const response = await axios.get('/api/chatbot/prompts');
      if (response.data.success) {
        setPrompts(response.data.prompts);
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    }
  };

  // Send message to backend
  const send = async (messageText = null) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Hide prompts after first message
    if (showPrompts) setShowPrompts(false);

    // Add user message
    const userMsg = { id: Date.now(), text, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const response = await axios.post('/api/chatbot/send', {
        message: text,
        session_id: sessionId
      });

      setTyping(false);

      if (response.data.success) {
        // Add bot response with proper formatting
        const botMsg = {
          id: Date.now() + 1,
          text: response.data.response,
          isUser: false,
          messageId: response.data.message_id
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      setTyping(false);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false
      };
      setMessages((prev) => [...prev, errorMsg]);
      console.error('Failed to send message:', error);
    }
  };

  // Handle prompt click
  const handlePromptClick = (question) => {
    send(question);
  };

  return (
    <>
      {/* Floating Chat Button with Custom Image */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Toggle chat"
          className="transition-transform hover:scale-105 active:scale-95 
            focus:outline-none"
        >
          {isOpen ? (
            <div className="w-16 h-16 flex items-center justify-center rounded-full
              bg-blue-700 text-white shadow-xl hover:bg-blue-800">
              <ArrowDown size={28} />
            </div>
          ) : (
            <img 
              src="/images/chatbot.png" 
              alt="Ask for Help - Chat Bot"
              className="w-auto h-24 object-contain drop-shadow-2xl animate-bounce [animation-duration:2s]"
            />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[9998]
            w-[380px] flex flex-col rounded-2xl overflow-hidden
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 shadow-xl"
          style={{ height: 550 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20
              flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm flex items-center gap-1">
                Barangay AI Assistant
                <Sparkles size={12} className="text-yellow-300" />
              </p>
              <p className="text-blue-200 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400
                  inline-block animate-pulse" />
                Online & Ready to Help
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3
            bg-gray-50 dark:bg-gray-800">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-end gap-2
                  ${m.isUser ? "flex-row-reverse" : ""}`}
              >
                {!m.isUser && (
                  <div className="w-7 h-7 rounded-full bg-blue-700
                    flex items-center justify-center flex-shrink-0">
                    <Bot size={13} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3 py-2.5 text-sm
                    leading-relaxed rounded-2xl whitespace-pre-line
                    ${m.isUser
                      ? "bg-blue-700 text-white rounded-br-sm"
                      : `bg-white dark:bg-gray-700
                         text-gray-900 dark:text-gray-100
                         border border-gray-200 dark:border-gray-600
                         rounded-bl-sm shadow-sm`
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-700
                  flex items-center justify-center flex-shrink-0">
                  <Bot size={13} className="text-white" />
                </div>
                <div className="bg-white dark:bg-gray-700 border
                  border-gray-200 dark:border-gray-600 px-4 py-3
                  rounded-2xl rounded-bl-sm flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-600
                        animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Predefined Prompts */}
            {showPrompts && prompts.length > 0 && messages.length === 1 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium px-1">
                  Quick Questions:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {prompts.slice(0, 6).map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handlePromptClick(prompt.question)}
                      className="text-left px-3 py-2 text-xs bg-white dark:bg-gray-700
                        border border-gray-200 dark:border-gray-600 rounded-lg
                        hover:bg-blue-50 dark:hover:bg-gray-600
                        hover:border-blue-300 dark:hover:border-blue-500
                        transition-colors text-gray-700 dark:text-gray-200"
                    >
                      {prompt.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200
            dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Type your question…"
                disabled={typing}
                className="flex-1 px-4 py-2.5 rounded-full text-sm
                  border border-gray-200 dark:border-gray-600
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  outline-none focus:ring-2 focus:ring-blue-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all"
              />
              <button
                onClick={() => send()}
                disabled={typing || !input.trim()}
                aria-label="Send"
                className="w-10 h-10 rounded-full bg-blue-700 text-white
                  flex items-center justify-center flex-shrink-0
                  hover:bg-blue-800 active:scale-95 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:bg-blue-700"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
              Powered by Barangay AI Assistant
            </p>
          </div>
        </div>
      )}
    </>
  );
}