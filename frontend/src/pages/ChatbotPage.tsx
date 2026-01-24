import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Wallet } from 'lucide-react';
import { theme } from '../theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your financial advisor. I can help you with budgeting tips, investment strategies, and more. What would you like to know about your finances?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input_lower = userInput.toLowerCase();

    const responses: { [key: string]: string } = {
      'budget': 'Great question! I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. This helps maintain a healthy financial balance.',
      'save': 'To save more money, consider these tips: 1) Track your spending, 2) Set up automatic transfers, 3) Cut unnecessary subscriptions, 4) Use the 30-day rule for purchases.',
      'invest': 'Investment depends on your goals and risk tolerance. Consider diversified options like index funds, bonds, or ETFs. Consult with a financial advisor for personalized advice.',
      'debt': 'To manage debt effectively: 1) List all debts, 2) Pay more than the minimum, 3) Consider the snowball or avalanche method, 4) Avoid taking on new debt.',
      'goal': 'Setting financial goals is crucial! Use SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound. Break larger goals into smaller milestones.',
    };

    for (const [key, value] of Object.entries(responses)) {
      if (input_lower.includes(key)) return value;
    }

    return "That's a good question! I can help with budgeting, saving, investing, debt management, and goal setting. Feel free to ask me anything related to your personal finances.";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-gray-200">
        <div className={`${theme.spacing.container} py-4 flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 rounded-2xl p-2">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-800">PennyPlanning</h1>
          </div>
          <div className="flex gap-6 items-center">
            <a href="/" className="nav-link">Home</a>
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/chatbot" className="nav-link-active">Advice</a>
            <a href="/quests" className="nav-link">Quests</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white border-b-4 border-gray-200 px-4">
        <div className={`${theme.spacing.container} py-8`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-sky-500 rounded-2xl p-3">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-black text-gray-800">Financial Advisor</h2>
          </div>
          <p className="text-lg text-gray-700 font-bold">Chat with our AI advisor about budgeting, saving, and investing</p>
        </div>
      </section>

      {/* Chat Container */}
      <div className={`${theme.spacing.container} py-8 flex-1`}>
        <div className="card-3d p-6 border-4 border-gray-200 h-96 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
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
                  <p className={`text-xs mt-1 font-bold ${message.sender === 'user' ? 'text-emerald-100' : 'text-gray-600'}`}>
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
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about budgeting, saving, investing..."
              className="flex-1 border-2 border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-800"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn-3d-green flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 border-t-4 border-gray-900 mt-8">
        <div className={`${theme.spacing.container} text-center font-black`}>
          <p>&copy; 2026 PennyPlanning. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
