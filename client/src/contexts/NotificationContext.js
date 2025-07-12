"use client"
import { createContext, useContext, useState, useEffect } from "react"

const NotificationContext = createContext()

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Load notifications from localStorage
    const saved = localStorage.getItem("stackit_notifications")
    if (saved) {
      setNotifications(JSON.parse(saved))
    } else {
      // Mock notifications
      const mockNotifications = [
        {
          id: 1,
          type: "answer",
          message: 'New answer to your question "How to use React hooks?"',
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: 2,
          type: "comment",
          message: "Someone commented on your answer",
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: 3,
          type: "mention",
          message: "You were mentioned in a comment",
          read: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
      ]
      setNotifications(mockNotifications)
      localStorage.setItem("stackit_notifications", JSON.stringify(mockNotifications))
    }
  }, [])

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      timestamp: new Date().toISOString(),
      ...notification,
    }
    const updated = [newNotification, ...notifications]
    setNotifications(updated)
    localStorage.setItem("stackit_notifications", JSON.stringify(updated))
  }

  const markAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(updated)
    localStorage.setItem("stackit_notifications", JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem("stackit_notifications", JSON.stringify(updated))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
