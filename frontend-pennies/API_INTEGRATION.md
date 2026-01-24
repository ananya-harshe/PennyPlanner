# API Integration Guide

## Environment Setup

### .env File
```
VITE_BACKEND_URL=http://localhost:5000
```

### Usage in Pages
```javascript
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api'
```

## API Endpoints Expected

### Progress/User Endpoints
```
GET /api/progress - Get user progress data
  Response: {
    daily_xp: number,
    daily_goal: number,
    streak: number,
    hearts: number,
    gems: number,
    xp: number,
    badges: string[],
    completed_lessons: string[]
  }

POST /api/progress/refill-hearts - Refill hearts (costs 50 gems)
  Response: { success: boolean }
```

### Transactions Endpoints
```
GET /api/transactions - Get all transactions
  Response: {
    list: [{
      id: string,
      category: string,
      amount: number,
      date: string,
      type: 'income' | 'expense',
      description: string
    }],
    analysis: {
      total_income: number,
      total_spent: number,
      savings_rate: number,
      good_decisions: number,
      needs_improvement: number
    }
  }
```

### Lessons/Quizzes Endpoints
```
GET /api/lessons - Get all lessons
  Response: [{
    id: string,
    title: string,
    category: string,
    icon: string,
    xp_reward: number,
    is_locked: boolean
  }]

GET /api/quiz/:lessonId - Get quiz questions
  Response: {
    lesson: { title, category },
    questions: [{
      id: string,
      question: string,
      options: string[],
      correct_answer: number,
      explanation: string,
      category: string
    }]
  }

POST /api/quiz/:lessonId/complete - Submit quiz results
  Params: { correct_answers: number, total_questions: number }
  Response: {
    passed: boolean,
    score_percentage: number,
    xp_earned: number,
    perfect: boolean
  }
```

### Daily Challenge Endpoints
```
GET /api/daily-challenge - Get daily challenge
  Response: {
    completed: boolean,
    questions: [{
      id: string,
      question: string,
      options: string[],
      correct_answer: number,
      explanation: string
    }]
  }

POST /api/daily-challenge/complete - Submit daily challenge
  Params: { correct_answers: number }
  Response: {
    correct_answers: number,
    xp_earned: number,
    gems_earned: number
  }
```

### Leaderboard Endpoints
```
GET /api/leaderboard - Get leaderboard data
  Response: {
    user_rank: number,
    leaderboard: [{
      username: string,
      xp: number,
      streak: number,
      avatar_color: string
    }]
  }
```

### Badges/Achievements Endpoints
```
GET /api/badges - Get all badges
  Response: [{
    id: string,
    name: string,
    icon: string,
    earned: boolean
  }]
```

### Penny AI Endpoints
```
GET /api/penny/message?context=home - Get contextual Penny message
  Response: { message: string }

GET /api/penny/tip - Get financial tip
  Response: { tip: string }
```

## Current Implementation (Mock Data)

All pages currently use mock data with fallback patterns:

### HomePage Mock Data
```javascript
setProgress({
  daily_xp: 35,
  daily_goal: 50,
  streak: 5,
  hearts: 3,
  gems: 100,
  xp: 450,
  badges: ['badge1', 'badge2'],
  completed_lessons: ['lesson1', 'lesson2'],
})

setTransactions({
  analysis: {
    good_decisions: 12,
    needs_improvement: 3,
    savings_rate: 22,
  }
})
```

### DashboardPage Mock Data
```javascript
const mockTransactions = [
  { 
    id: '1', 
    category: 'Groceries', 
    amount: 125.50, 
    date: '2026-01-23', 
    type: 'expense' 
  },
  // ... more transactions
]
```

### QuestsPage Mock Data
```javascript
const [quests, setQuests] = useState([
  {
    id: '1',
    title: 'Budget Master',
    description: 'Create a monthly budget for all spending categories',
    reward: 250,
    difficulty: 'Easy',
    category: 'Budgeting',
    completed: true,
    progress: 100,
  },
  // ... more quests
])
```

## Integrating Real API

### Step 1: Replace Mock Data
```javascript
// Before
setPennyMessage("Hop to it! Ready to become a money master? 🐸")

// After
const pennyRes = await axios.get(`${API_URL}/penny/message?context=home`)
setPennyMessage(pennyRes.data.message)
```

### Step 2: Add Error Handling
```javascript
try {
  const res = await axios.get(`${API_URL}/endpoint`)
  setData(res.data)
} catch (e) {
  console.error("Failed to fetch", e)
  toast.error("Failed to load data. Using cached version.")
  setData(mockFallback)
}
```

### Step 3: Handle Loading States
```javascript
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    try {
      // API call
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [])

if (loading) {
  return <div className="animate-pulse">Loading...</div>
}
```

## Example: Full Integration

### HomePage.js API Integration
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const [progressRes, transRes, pennyRes] = await Promise.all([
        axios.get(`${API_URL}/progress`),
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/penny/message?context=home`)
      ])
      
      setProgress(progressRes.data)
      setTransactions(transRes.data)
      setPennyMessage(pennyRes.data.message)
    } catch (e) {
      console.error("Failed to fetch data", e)
      toast.error("Failed to load dashboard")
      
      // Fallback mock data
      setPennyMessage("Hop to it! Ready to become a money master? 🐸")
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [])
```

## Error Handling Best Practices

### Network Errors
```javascript
try {
  const res = await axios.get(url)
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 404) {
    toast.error("Resource not found")
  } else if (error.request) {
    toast.error("No response from server")
  } else {
    toast.error("Error: " + error.message)
  }
}
```

### Timeout Handling
```javascript
const axiosInstance = axios.create({
  timeout: 5000, // 5 seconds
  baseURL: API_URL
})

// Use in pages
const res = await axiosInstance.get('/endpoint')
```

## Performance Optimization

### Memoization
```javascript
import { useCallback, useMemo } from 'react'

const fetchData = useCallback(async () => {
  // Only re-create if dependencies change
}, [])

const computedData = useMemo(() => {
  // Only recompute if dependencies change
  return expensiveCalculation(data)
}, [data])
```

### Debouncing API Calls
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    fetchData()
  }, 500) // Wait 500ms after input stops
  
  return () => clearTimeout(timer)
}, [searchQuery])
```

## Debugging

### Enable Axios Logger
```javascript
import axios from 'axios'

axios.interceptors.request.use(config => {
  console.log('Request:', config)
  return config
})

axios.interceptors.response.use(
  response => {
    console.log('Response:', response)
    return response
  },
  error => {
    console.error('Error:', error)
    return Promise.reject(error)
  }
)
```

### Check Network Tab
1. Open DevTools → Network tab
2. Make API call
3. Check request headers and response body
4. Verify status code (200, 404, 500, etc.)

## Testing API Integration

### Unit Test Example
```javascript
import { render, screen, waitFor } from '@testing-library/react'
import HomePage from './HomePage'

test('loads and displays home page data', async () => {
  render(<HomePage />)
  
  await waitFor(() => {
    expect(screen.getByText(/Daily Goal/i)).toBeInTheDocument()
  })
})
```

### Manual Testing Checklist
- [ ] API call on mount
- [ ] Loading state shows
- [ ] Data displays correctly
- [ ] Error handling works
- [ ] Retry mechanism functions
- [ ] No console errors
- [ ] Toast notifications display
- [ ] All icons load properly
