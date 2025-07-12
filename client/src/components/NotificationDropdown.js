"use client"
import { useNotifications } from "../../../client/src/contexts/NotificationContext"
import Link from "next/link"

export default function NotificationDropdown({ onClose }) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications()
  const recentNotifications = notifications.slice(0, 5)

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border py-2 z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        {notifications.some((n) => !n.read) && (
          <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800">
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {recentNotifications.length > 0 ? (
          recentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${
                !notification.read ? "bg-blue-50" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? "bg-blue-500" : "bg-gray-300"}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(notification.timestamp)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            <p>No notifications yet</p>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t">
        <Link href="/notifications" onClick={onClose} className="text-sm text-blue-600 hover:text-blue-800">
          View all notifications
        </Link>
      </div>
    </div>
  )
}
