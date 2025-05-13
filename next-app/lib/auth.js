import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useToast } from './use-toast'
import { useRouter } from 'next/router'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { toast } = useToast()
  const router = useRouter()
  
  const {
    data: user,
    error,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/user', {
          credentials: 'include'
        })
        if (!res.ok) {
          if (res.status === 401) return null
          throw new Error('Failed to fetch user data')
        }
        return await res.json()
      } catch (err) {
        console.error('Error fetching user:', err)
        return null
      }
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })
      
      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Login failed')
      }
      
      return await res.json()
    },
    onSuccess: () => {
      refetch()
      router.push('/')
      toast({
        title: 'Login successful',
        description: 'Welcome back!'
      })
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })
      
      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Registration failed')
      }
      
      return await res.json()
    },
    onSuccess: () => {
      refetch()
      router.push('/')
      toast({
        title: 'Registration successful',
        description: 'Your account has been created!'
      })
    },
    onError: (error) => {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Logout failed')
      }
    },
    onSuccess: () => {
      refetch()
      router.push('/auth')
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully'
      })
    },
    onError: (error) => {
      toast({
        title: 'Logout failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    
    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/auth')
      }
    }, [user, isLoading, router])
    
    if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }
    
    if (!user) {
      return null
    }
    
    return <Component {...props} />
  }
}