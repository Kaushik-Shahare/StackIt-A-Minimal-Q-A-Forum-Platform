"use client"
import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for logged-in user
    const savedUser = localStorage.getItem("stackit_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    const user = {
      id: userData.id || Date.now(),
      username: userData.username,
      email: userData.email,
      role: userData.role || "user",
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.username}&background=3b82f6&color=fff`,
    }
    setUser(user)
    localStorage.setItem("stackit_user", JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("stackit_user")
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
