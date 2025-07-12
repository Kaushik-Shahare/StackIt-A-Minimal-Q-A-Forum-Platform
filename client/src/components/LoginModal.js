"use client"
import { useState } from "react"
import { useAuth } from "../../../client/src/contexts/AuthContext"

export default function LoginModal({ onClose }) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData)
    onClose()
  }

  const quickLogin = (role) => {
    const userData =
      role === "admin"
        ? { username: "admin", email: "admin@stackit.com", role: "admin" }
        : { username: "user", email: "user@stackit.com", role: "user" }
    login(userData)
    onClose()
  }

  return (
    <div className="fixed inset-0 border border-gray-300 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sign In to StackIt</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">Quick login:</p>
          <div className="flex space-x-2">
            <button
              onClick={() => quickLogin("user")}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Demo User
            </button>
            <button
              onClick={() => quickLogin("admin")}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
