import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import universities from "../../data/us_universities.json"
import NavBar from "../../components/Navbar"

function SignupPage() {
  const [first, setFirst] = useState("")
  const [last, setLast] = useState("")
  const [email, setEmail] = useState("")
  const [university, setUniversity] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState([])
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, feedback: ["Password is required"] }

    let strength = 0
    const feedback = []

    // Length check
    if (pwd.length >= 8) {
      strength += 25
    } else {
      feedback.push("Password should be at least 8 characters")
    }

    // Lowercase check
    if (/[a-z]/.test(pwd)) {
      strength += 25
    } else {
      feedback.push("Include lowercase letters")
    }

    // Uppercase check
    if (/[A-Z]/.test(pwd)) {
      strength += 25
    } else {
      feedback.push("Include uppercase letters")
    }

    // Number and special character check
    if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) {
      strength += 25
    } else {
      feedback.push("Include numbers and special characters")
    }

    return { strength, feedback }
  }

  useEffect(() => {
    const { strength, feedback } = calculatePasswordStrength(password)
    setPasswordStrength(strength)
    setPasswordFeedback(feedback)
  }, [password])

  const isStrongPassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
    return regex.test(pwd)
  }

  const isValidEmail = (email) => {
    return email.endsWith(".edu")
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500"
    if (passwordStrength < 50) return "bg-orange-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak"
    if (passwordStrength < 50) return "Fair"
    if (passwordStrength < 75) return "Good"
    return "Strong"
  }

  const signup = async () => {
    setError("")

    if (!first || !last || !email || !university || !password || !confirm) {
      setError("All fields are required")
      return
    }

    if (!isValidEmail(email)) {
      setError("Please use a valid .edu email address")
      return
    }

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      )
      return
    }

    setIsSubmitting(true)
    try {
      const res = await axios.post(
        "http://localhost:8080/auth/signup",
        new URLSearchParams({
          first,
          last,
          email,
          password,
          university,
        }),
      )
      alert(res.data)
      navigate("/verify", { state: { email } })
    } catch (err) {
      setError(err.response?.data || "Signup failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-purple-100">Join our academic community</p>
            </div>

            <div className="p-8">
              {/* Error Alert */}
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

              <div className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="First Name"
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Last Name"
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Email</label>
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
                    />
                  </div>
                  {email && !isValidEmail(email) && (
                    <p className="mt-1 text-sm text-red-600">Please use a valid .edu email address</p>
                  )}
                </div>

                {/* University Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <select
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                    >
                      <option value="">Select University</option>
                      {universities.map((u, idx) => (
                        <option key={idx} value={u.name}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Password strength:</span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength < 50
                              ? "text-red-600"
                              : passwordStrength < 75
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                      {passwordFeedback.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {passwordFeedback.map((feedback, index) => (
                            <p key={index} className="text-xs text-gray-600 flex items-center">
                              <svg className="w-3 h-3 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {feedback}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
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
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    <input
                      type="password"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        password && confirm && password !== confirm ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Confirm your password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>
                  {password && confirm && password !== confirm && (
                    <p className="mt-1 text-sm text-red-600">Passwords don't match</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                    isSubmitting ||
                    !first ||
                    !last ||
                    !email ||
                    !university ||
                    !password ||
                    !confirm ||
                    password !== confirm ||
                    !isStrongPassword(password)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] shadow-lg"
                  }`}
                  onClick={signup}
                  disabled={
                    isSubmitting ||
                    !first ||
                    !last ||
                    !email ||
                    !university ||
                    !password ||
                    !confirm ||
                    password !== confirm ||
                    !isStrongPassword(password)
                  }
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
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignupPage