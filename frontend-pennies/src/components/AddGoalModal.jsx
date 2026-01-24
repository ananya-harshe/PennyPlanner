import React, { useState } from 'react'
import { X, Target, Save } from 'lucide-react'
import { toast } from 'sonner'
import { API_URL, getAuthHeaders } from '@/api/client'
import { useAuth } from '@/store/authContext'

export default function AddGoalModal({ onClose }) {
    const { setGoalsData } = useAuth()
    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title || !amount) return

        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/goals`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    title,
                    target_amount: parseFloat(amount),
                    type: 'savings', // Default to savings for now
                    icon: 'piggy-bank'
                })
            })

            const data = await response.json()

            if (data.success) {
                toast.success("Goal created successfully!")

                // Update local cache
                // We need to fetch fresh list or append? 
                // Best to just refresh the list in parent Context, but here we can just do a dirty append if we had access to prev state.
                // Actually, let's force a refresh or we can fetch fresh goals here and update context.
                const refreshRes = await fetch(`${API_URL}/goals`, { headers: getAuthHeaders() });
                const freshList = await refreshRes.json();
                setGoalsData(freshList.data);

                onClose()
            } else {
                toast.error(data.error || "Failed to create goal")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to create goal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-bounce-in">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <Target size={24} />
                        </div>
                        <h2 className="text-xl font-black">New Financial Goal</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Goal Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. New Car, Emergency Fund"
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Target Amount ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            min="1"
                            step="0.01"
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">Creating...</span>
                        ) : (
                            <>
                                <Save size={20} />
                                Create Goal
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
