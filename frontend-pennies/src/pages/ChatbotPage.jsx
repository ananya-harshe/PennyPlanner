import React, { useState, useRef, useEffect } from 'react'
import { Send, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { PennyMascot } from '@/components/PennyComponents'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi! I'm Penny, your financial advisor. Ask me anything about budgeting, saving, investing, or managing debt!",
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

  const callGeminiAPI = async (userMessage) => {
    if (!GEMINI_API_KEY) {
      return "I need my API key configured! Add VITE_GEMINI_API_KEY to your .env file to use me."
    }

    try {
      const response = await fetch(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are Penny, a friendly financial advisor frog 🐸. Give concise, practical financial advice in 1-2 sentences. User asked: ${userMessage}`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 200,
              temperature: 0.7,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."
    } catch (error) {
      console.error('Gemini API error:', error)
      return "I'm having trouble connecting to my AI brain right now. Try again in a moment!"
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
      const botResponseText = await callGeminiAPI(input)
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: botResponseText,
          sender: 'bot',
          timestamp: new Date(),
        },
      ])
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-24">
      <PennyMascot message="Ask me anything about money! 💚" size="medium" animate />

      {/* API Key Warning */}
      {!GEMINI_API_KEY && (
        <div className="mx-4 mt-4 bg-orange-100 border-2 border-orange-400 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm font-bold text-orange-800">Gemini API Key Missing</p>
            <p className="text-xs text-orange-700 mt-1">Add VITE_GEMINI_API_KEY to .env to enable AI responses</p>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-4 mt-6">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl font-bold ${
                message.sender === 'user'
                  ? 'bg-emerald-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none border-2 border-gray-300'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 font-bold ${
                  message.sender === 'user' ? 'text-emerald-100' : 'text-gray-600'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border-2 border-gray-300">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 px-4 py-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about budgeting, saving, investing..."
            className="flex-1 border-2 border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-800"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-emerald-500 text-white font-black rounded-2xl px-6 border-b-4 border-emerald-700 hover:bg-emerald-600 active:translate-y-1 active:border-b-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
