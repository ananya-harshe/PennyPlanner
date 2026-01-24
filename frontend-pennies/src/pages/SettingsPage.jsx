import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Save, FileText, Trash2, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/store/authContext'
import { API_URL, getAuthHeaders } from '@/api/client'

export default function SettingsPage() {
    const navigate = useNavigate()
    const { logout, user } = useAuth()

    const [dailyGoal, setDailyGoal] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    // File upload state (placeholder)
    const [fileName, setFileName] = useState(null)

    useEffect(() => {
        // Fetch current goal... technically we could get this from /progress or context
        // For now, let's just initialize or fetch if needed. 
        // Since user object might have daily_goal or we can fetch progress.
        fetchProgress()
    }, [])

    const fetchProgress = async () => {
        try {
            const response = await fetch(`${API_URL}/progress`, { headers: getAuthHeaders() })
            const data = await response.json()
            if (data.daily_goal) {
                setDailyGoal(data.daily_goal)
            }
        } catch (e) {
            console.error("Failed to fetch settings", e)
        } finally {
            setFetching(false)
        }
    }

    const handleUpdateGoal = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ daily_goal: Number(dailyGoal) })
            })

            if (!response.ok) throw new Error('Failed to update')

            toast.success('Daily goal updated successfully! 🎯')
        } catch (error) {
            toast.error('Failed to update goal')
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFileName(file.name)
            // Placeholder logic for now
            toast.success(`Selected file: ${file.name}`)
            toast.info('Transaction processing logic coming soon! 🚧')
        }
    }

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone! ⚠️')) {
            return
        }

        try {
            const response = await fetch(`${API_URL}/users/me`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            })

            if (!response.ok) throw new Error('Failed to delete')

            toast.success('Account deleted. Goodbye! 👋')
            logout()
            navigate('/login')
        } catch (error) {
            toast.error('Failed to delete account')
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin text-4xl">⚙️</div>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
            <h1 className="text-2xl font-black text-gray-800 mb-6">Settings</h1>

            {/* Daily Goal Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-4 border-gray-100">
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                    🎯 Daily Goal
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">XP Target per Day</label>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                value={dailyGoal}
                                onChange={(e) => {
                                    const val = e.target.value
                                    setDailyGoal(val === '' ? '' : Number(val))
                                }}
                                placeholder="50"
                                className="flex-1 p-3 bg-gray-50 rounded-xl font-bold text-gray-800 border-2 border-gray-200 focus:border-emerald-500 outline-none transition-colors placeholder:text-gray-300"
                            />
                            <button
                                onClick={handleUpdateGoal}
                                disabled={loading}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                <Save size={20} />
                                Save
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Set your daily learning target to keep your streak alive!</p>
                </div>
            </div>

            {/* Transaction Upload Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-4 border-gray-100">
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                    📄 Upload Transactions
                </h2>
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept=".txt,.csv"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="font-bold text-gray-600">
                            {fileName ? fileName : "Click to upload transaction file"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Supported formats: .txt, .csv</p>
                    </div>
                </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-4 border-red-50">
                <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                    <ShieldAlert size={24} />
                    Danger Zone
                </h2>

                <div className="space-y-4">
                    <button
                        onClick={logout}
                        className="w-full p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full p-4 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border-2 border-transparent hover:border-red-300"
                    >
                        <Trash2 size={20} />
                        Delete Account
                    </button>
                </div>
            </div>

            <div className="text-center text-xs text-gray-300 font-bold mt-8">
                PennyPlanner v0.1.0
            </div>
        </div>
    )
}
