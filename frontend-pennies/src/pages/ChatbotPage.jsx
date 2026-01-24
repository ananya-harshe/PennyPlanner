import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { PennyMascot } from '@/components/PennyComponents'
import { API_URL, getAuthHeaders } from '@/api/client'

export default function ChatbotPage() {
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
      // Fallback responses if API fails
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
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen lg:px-0">
      {/* Mobile Header Spacer if needed, or handled by layout */}

      <div className="flex-1 overflow-y-auto px-4 lg:px-8 space-y-4 pb-4 pt-4 lg:pt-8 custom-scrollbar">
        <PennyMascot message="Ask me anything about money! 💚" size="medium" animate />

        {/* Quick Questions */}
        <div className="mt-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(question)
                }}
                className="flex-shrink-0 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full text-sm font-bold transition-colors flex items-center gap-1 whitespace-nowrap"
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
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1">
                🐸
              </div>
            )}
            <div
              className={`max-w-[85%] lg:max-w-md px-5 py-3 rounded-2xl font-medium shadow-sm text-sm lg:text-base ${message.sender === 'user'
                ? 'bg-emerald-500 text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none border-2 border-gray-200'
                }`}
            >
              <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
              <p
                className={`text-[10px] mt-1 text-right opacity-70 font-bold`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1">
              🐸
            </div>
            <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border-2 border-gray-200 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      {/* Mobile: Fixed above nav. Desktop: Sticky at bottom of container */}
      <div className="bg-white border-t-4 border-gray-200 p-4 sticky bottom-0 z-40 lg:mb-0 mb-20">
        <div className="flex gap-3 max-w-4xl mx-auto items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Penny about money..."
            className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-gray-700 placeholder-gray-400 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-emerald-500 text-white p-3 rounded-2xl border-b-4 border-emerald-700 hover:bg-emerald-600 active:translate-y-1 active:border-b-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
