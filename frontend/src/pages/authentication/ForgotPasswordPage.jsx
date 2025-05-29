"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [cooldown, setCooldown] = useState(0)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // On mount: check if there's a cooldown saved
  useEffect(() => {
    const saved = localStorage.getItem(`resetCooldown-${email}`)
    if (saved) {
      const remaining = Math.floor((new Date(saved) - new Date()) / 1000)
      if (remaining > 0) {
        setCooldown(remaining)
      } else {
        localStorage.removeItem(`resetCooldown-${email}`)
      }
    }
  }, [email])

  // Decrement cooldown every second
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000)
      return () => clearInterval(interval)
    } else {
      localStorage.removeItem(`resetCooldown-${email}`)
    }
  }, [cooldown, email])

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async () => {
    setError("")
    setMessage("")

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      await axios.post("http://localhost:8080/auth/forgot-password", new URLSearchParams({ email }))
      setMessage("Password reset link sent to your email!")
      const expireAt = new Date(Date.now() + 60000) // 60 seconds from now
      localStorage.setItem(`resetCooldown-${email}`, expireAt.toISOString())
      setCooldown(60)
    } catch (err) {
      setError(err.response?.data || "Failed to send reset link. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
            <p className="text-purple-100">No worries, we'll send you reset instructions</p>
          </div>

          <div className="p-8">
            {/* Success Message */}
            {message && !error && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-green-700 text-sm">{message}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Instructions */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <input
                    type="email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      email && !isValidEmail(email) ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="your.email@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSubmitting}
                  />
                </div>
                {email && !isValidEmail(email) && (
                  <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                  isSubmitting || cooldown > 0 || !email || !isValidEmail(email)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] shadow-lg"
                }`}
                onClick={handleSubmit}
                disabled={isSubmitting || cooldown > 0 || !email || !isValidEmail(email)}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </div>
                ) : cooldown > 0 ? (
                  `Resend in ${formatTime(cooldown)}`
                ) : (
                  "Send Reset Link"
                )}
              </button>

              {/* Additional Info */}
              {message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-blue-700 text-sm">
                      <p className="font-medium mb-1">Check your email</p>
                      <p>
                        We sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset
                        your password.
                      </p>
                      <p className="mt-2 text-xs">Didn't receive the email? Check your spam folder or try again.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Sign In
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/signup")}
                    className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Security Notice</p>
              <p>
                For your security, password reset links expire after 15 minutes. If you don't receive an email, please
                check your spam folder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
