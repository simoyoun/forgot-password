import React, { useState } from 'react'
import { useAuth } from './AuthProvider'
import { useNavigate } from '@tanstack/react-router'
import { GoogleLogin } from '@react-oauth/google'
import { FaApple } from 'react-icons/fa6'

export function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { signUp, signInWithGoogle, signInWithApple } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const success = await signUp(email, password, name)
      if (success) {
        navigate({ to: '/' })
      } else {
        setError('Sign up failed')
      }
    } catch (err) {
      setError('Error during sign up')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        
        <div className="flex flex-col gap-4 mb-6">
          <GoogleLogin
            onSuccess={credentialResponse => {
              signInWithGoogle()
            }}
            onError={() => {
              setError('Google sign in failed')
            }}
            width="300"
          />
          
          <button
            onClick={signInWithApple}
            className="flex items-center justify-center gap-2 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            <FaApple /> Continue with Apple
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:text-indigo-800">
            Log in
          </a>
        </div>
      </div>
    </div>
  )
}
