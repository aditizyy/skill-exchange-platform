import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoginForm from "../components/auth/LoginForm"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(email, password) {
    await login(email, password)
    navigate("/dashboard")
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to your account to continue
          </p>
        </div>

        <LoginForm onLogin={handleLogin} />

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}