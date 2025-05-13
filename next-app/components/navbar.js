import Link from 'next/link'
import { useAuth } from '../lib/auth'

export default function Navbar() {
  const { user, logoutMutation } = useAuth()
  
  const handleLogout = () => {
    logoutMutation.mutate()
  }
  
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <span className="sr-only">Optisizer</span>
              <div className="text-xl font-bold">
                <span className="text-primary">Opti</span>
                <span className="text-black">sizer</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <span className="inline-block px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark">
                  Login / Register
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}