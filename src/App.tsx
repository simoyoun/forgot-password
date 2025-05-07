import React from 'react'
import { Outlet, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from './auth/AuthProvider'

const App = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                activeProps={{
                  className: 'border-indigo-500 text-gray-900'
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/inventory"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                activeProps={{
                  className: 'border-indigo-500 text-gray-900'
                }}
              >
                Inventory
              </Link>
              <Link
                to="/sales"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                activeProps={{
                  className: 'border-indigo-500 text-gray-900'
                }}
              >
                Sales
              </Link>
              <Link
                to="/customers"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                activeProps={{
                  className: 'border-indigo-500 text-gray-900'
                }}
              >
                Customers
              </Link>
              <Link
                to="/employees"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                activeProps={{
                  className: 'border-indigo-500 text-gray-900'
                }}
              >
                Employees
              </Link>
              <Link
                to="/reports"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                activeProps={{
                  className: 'border-indigo-500 text-gray-900'
                }}
              >
                Reports
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <>
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-500 mr-4">{user?.name}</span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
