import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from './firebase'
import { useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')
    
    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Password reset email sent. Please check your inbox.')
      setTimeout(() => navigate({ to: '/login' }), 3000)
    } catch (err) {
      setError('Failed to send reset email. Please check the email address.')
      console.error('Password reset error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
