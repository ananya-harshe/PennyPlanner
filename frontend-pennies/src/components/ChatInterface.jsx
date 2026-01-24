import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { PennyMascot } from '@/components/PennyComponents'
import { API_URL, getAuthHeaders } from '@/api/client'

export default function ChatInterface({ isModal = false, onClose }) {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: "Hi! I'm Penny, your financial advisor frog! 🐸 Ask me anything about budgeting, saving, investing, or managing debt!",
            sender: 'bot',
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const callPennyChat = async (userMessage) => {
        try {
            const response = await fetch(`${API_URL}/penny/chat`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ message: userMessage })
            })

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`)
            }

            const data = await response.json()
            return data.response || "Ribbit! I'm thinking about that... 🐸"
        } catch (error) {
            console.error('Penny chat error:', error)
            const fallbacks = [
                "Great question! The key to financial success is spending less than you earn. Try tracking your expenses for a week! 🐸",
                "Ribbit! That's a smart thing to think about! Start by creating a simple budget - list your income and expenses. 🐸",
                "I love that you're thinking about money! Remember: save first, spend second. Even small amounts add up! 🐸"
            ]
            return fallbacks[Math.floor(Math.random() * fallbacks.length)]
        }
    }

    const handleSendMessage = async () => {
        if (!input.trim()) return

        const userMessage = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const botResponseText = await callPennyChat(input)

            const botMessage = {
                id: (Date.now() + 1).toString(),
                text: botResponseText,
                sender: 'bot',
                timestamp: new Date(),
            }

            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to get response')
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const quickQuestions = [
        "How do I start saving?",
        "What is a budget?",
        "How do credit cards work?",
        "Tips for investing?"
    ]

    return (
        <div className={`flex flex-col h-full bg-gray-50/50 ${isModal ? 'rounded-t-3xl' : ''}`}>
            {/* Header if Modal */}
            {isModal && (
                <div className="bg-white p-4 rounded-t-3xl border-b-4 border-gray-100 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-2xl animate-float">
                            🐸
                        </div>
                        <div>
                            <h3 className="font-black text-gray-800">Chat with Penny</h3>
                            <p className="text-xs text-emerald-500 font-bold">Online & Ready to Help!</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 lg:px-6 space-y-4 pb-4 pt-4 custom-scrollbar">
                {!isModal && <PennyMascot message="Ask me anything about money, ribbit! 💚" size="medium" animate />}

                {/* Quick Questions */}
                <div className="mt-2 mb-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {quickQuestions.map((question, idx) => (
                            <button
                                key={idx}
                                onClick={() => setInput(question)}
                                className="flex-shrink-0 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full text-xs font-bold transition-colors flex items-center gap-1 whitespace-nowrap"
                            >
                                <Sparkles className="w-3 h-3" />
                                {question}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Messages */}
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.sender === 'bot' && (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1 text-sm">
                                🐸
                            </div>
                        )}
                        <div
                            className={`max-w-[85%] px-4 py-2.5 rounded-2xl font-medium shadow-sm text-sm ${message.sender === 'user'
                                ? 'bg-emerald-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border-2 border-gray-200'
                                }`}
                        >
                            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                            <p className={`text-[9px] mt-1 text-right opacity-70 font-bold`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1 text-sm">
                            🐸
                        </div>
                        <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border-2 border-gray-200 shadow-sm">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className={`bg-white border-t-4 border-gray-200 p-3 pb-safe z-40 ${isModal ? '' : 'lg:mb-0 mb-20 sticky bottom-0'}`}>
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask Penny..."
                        className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-gray-700 placeholder-gray-400 transition-all text-sm"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        className="bg-emerald-500 text-white p-3 rounded-xl border-b-4 border-emerald-700 hover:bg-emerald-600 active:translate-y-1 active:border-b-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
