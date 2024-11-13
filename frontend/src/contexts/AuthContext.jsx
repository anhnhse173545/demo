import api from '@/config/api'
import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          await fetchUser(token)
        } catch (error) {
          console.error('Error initializing auth:', error)
          logout()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const fetchUser = async (token) => {
    try {
      const response = await api.get('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message)
      throw error
    }
  }

  const login = async (phone, password) => {
    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', { phone, password })
      const { accessToken, refreshToken, role } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      await fetchUser(accessToken)
      
      switch (role) {
        case 'Customer':
          navigate('/')
          break
        case 'Manager':
          navigate('/manager-dashboard')
          break
        case 'Delivery Staff':
          navigate('/ds-dashboard')
          break
        case 'Sales Staff':
          navigate('/ss-dashboard')
          break
        case 'Consulting Staff':
          navigate('/cs-dashboard')
          break
        default:
          throw new Error('Invalid user role')
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    navigate('/login')
  }

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await api.post('/api/auth/refresh-token', { refreshToken })
      const { accessToken, refreshToken: newRefreshToken } = response.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      return accessToken
    } catch (error) {
      console.error('Error refreshing token:', error.response?.data || error.message)
      logout()
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}