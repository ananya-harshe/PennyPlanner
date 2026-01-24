/**
 * API utility for authenticated requests
 */
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api'

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

export const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: getAuthHeaders(),
    ...options
  })
  return response
}

export { API_URL }
