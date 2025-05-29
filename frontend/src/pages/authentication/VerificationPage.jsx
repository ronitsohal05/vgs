import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"

function VerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [cooldown, setCooldown] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email
  const inputRefs = useRef([])

  // On mount, check for cooldown in localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`vcodeCooldown-${email}`)
    if (saved) {
      const diff = Math.floor((new Date(saved) - new Date()) / 1000)
      if (diff > 0) {
        setCooldown(diff)
      } else {
        localStorage.removeItem(`vcodeCooldown-${email}`)
      }
    }
  }, [email])

  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000)
      return () => clearInterval(interval)
    } else {
      localStorage.removeItem(`vcodeCooldown-${email}`)
    }
  }, [cooldown, email])

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all 6 digits are entered
    if (newCode.every((digit) => digit !== "") && newCode.join("").length === 6) {
      verify(newCode.join(""))
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    // Handle paste
    if (e.key === "Enter") {
      verify(code.join(""))
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newCode = [...code]

    for (let i = 0; i < 6; i++) {
      newCode[i] = pastedData[i] || ""
    }

    setCode(newCode)

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((digit) => digit === "")
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()

    // Auto-verify if all digits are filled
    if (newCode.every((digit) => digit !== "")) {
      verify(newCode.join(""))
    }
  }

  const verify = async (codeString = code.join("")) => {
    if (codeString.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      await axios.post(
        "http://localhost:8080/auth/verify",
        new URLSearchParams({ email, code: codeString }),
      )
      setMessage("Email verified successfully! Redirecting...")
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      setError(err.response?.data || "Verification failed")
      // Clear the code on error
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const sendCode = async () => {
    setIsSending(true)
    setError("")
    setMessage("")

    try {
      await axios.post("http://localhost:8080/auth/vcode", new URLSearchParams({ email }))
      setMessage("Verification code sent to your email!")
      const expiry = new Date(Date.now() + 60000) // 60 seconds from now
      localStorage.setItem(`vcodeCooldown-${email}`, expiry.toISOString())
      setCooldown(60)
    } catch (err) {
      setError(err.response?.data || "Failed to send code")
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Email Missing</h2>
          <p className="text-gray-600 mb-6">Please go back to signup to get your verification code.</p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Go to Signup
          </button>
        </div>
      </div>
    )
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-purple-100">Enter the 6-digit code we sent to</p>
            <p className="text-white font-medium">{email}</p>
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
              {/* Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter Verification Code
                </label>
                <div className="flex justify-center space-x-3" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isVerifying}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Paste your code or enter each digit individually
                </p>
              </div>

              {/* Verify Button */}
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                  isVerifying || code.join("").length !== 6
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-[1.02] shadow-lg"
                }`}
                onClick={() => verify()}
                disabled={isVerifying || code.join("").length !== 6}
              >
                {isVerifying ? (
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
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Didn't receive the code?</span>
                </div>
              </div>

              {/* Resend Button */}
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  cooldown > 0 || isSending
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                }`}
                onClick={sendCode}
                disabled={cooldown > 0 || isSending}
              >
                {isSending ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
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
                  "Resend Code"
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Already verified?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default VerificationPage
