import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/auth'
import Footer from '../components/footer'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  
  const { user, isLoading, loginMutation, registerMutation } = useAuth()
  const router = useRouter()
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!username.trim()) {
      newErrors.username = 'Username is required'
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (isLogin) {
      loginMutation.mutate({ username, password })
    } else {
      registerMutation.mutate({ username, password })
    }
  }
  
  if (isLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  return (
    <>
      <Head>
        <title>{isLogin ? 'Login' : 'Register'} | Optisizer</title>
        <meta name="description" content="Login or create an account to use Optisizer" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex">
          {/* Form side */}
          <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 w-full md:w-1/2 bg-white">
            <div className="max-w-md w-full mx-auto space-y-8">
              <div>
                <h1 className="mt-6 text-center text-3xl font-extrabold">
                  <span className="text-primary">Opti</span><span className="text-black">sizer</span>
                </h1>
                <h2 className="mt-2 text-center text-xl font-medium text-gray-900">
                  {isLogin ? 'Sign in to your account' : 'Create your account'}
                </h2>
              </div>
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md -space-y-px">
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.username ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loginMutation.isPending || registerMutation.isPending}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {(loginMutation.isPending || registerMutation.isPending) ? (
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </span>
                    ) : null}
                    {isLogin ? 'Sign in' : 'Sign up'}
                  </button>
                </div>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Hero side */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-blue-700 items-center justify-center p-8">
            <div className="max-w-lg text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Advanced Image Resizing Tool</h2>
              <p className="text-xl mb-6">
                Resize and optimize your images for any platform while maintaining the highest quality
              </p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Precise control over dimensions
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save in multiple formats (JPG, PNG, WebP)
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Social media dimension presets
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Maintain aspect ratio
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  )
}