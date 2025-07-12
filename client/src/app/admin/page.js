"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../../../client/src/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("questions")
  const [questions, setQuestions] = useState([])
  const [users, setUsers] = useState([])
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showBanModal, setShowBanModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [globalMessage, setGlobalMessage] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    if (!isAdmin) {
      router.push("/")
      return
    }

    // Load data
    const savedQuestions = JSON.parse(localStorage.getItem("stackit_questions") || "[]")
    setQuestions(savedQuestions)

    // Mock users data
    const mockUsers = [
      { id: 1, username: "reactdev", email: "reactdev@example.com", status: "active", joinDate: "2024-01-15" },
      { id: 2, username: "webdev123", email: "webdev123@example.com", status: "active", joinDate: "2024-02-01" },
      { id: 3, username: "cssmaster", email: "cssmaster@example.com", status: "active", joinDate: "2024-02-10" },
      { id: 4, username: "spammer", email: "spam@example.com", status: "banned", joinDate: "2024-03-01" },
    ]
    setUsers(mockUsers)
  }, [user, isAdmin, router])

  const updateQuestionStatus = (questionId, newStatus) => {
    const updatedQuestions = questions.map((q) => (q.id === questionId ? { ...q, status: newStatus } : q))
    setQuestions(updatedQuestions)
    localStorage.setItem("stackit_questions", JSON.stringify(updatedQuestions))
  }

  const banUser = (userId) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, status: "banned" } : u))
    setUsers(updatedUsers)
    setShowBanModal(false)
    setSelectedUser(null)
  }

  const unbanUser = (userId) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, status: "active" } : u))
    setUsers(updatedUsers)
  }

  const sendGlobalMessage = () => {
    if (globalMessage.trim()) {
      alert(`Global message sent: "${globalMessage}"`)
      setGlobalMessage("")
      setShowMessageModal(false)
    }
  }

  const downloadReport = (type) => {
    const data = type === "users" ? users : questions
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${type}_report_${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  if (!user || !isAdmin) {
    return null
  }

  const pendingQuestions = questions.filter((q) => q.status === "pending" || !q.status)
  const acceptedQuestions = questions.filter((q) => q.status === "accepted")
  const rejectedQuestions = questions.filter((q) => q.status === "rejected")
  const activeUsers = users.filter((u) => u.status === "active")
  const bannedUsers = users.filter((u) => u.status === "banned")

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage questions, users, and platform settings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingQuestions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Banned Users</p>
              <p className="text-2xl font-bold text-gray-900">{bannedUsers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "questions", label: "Questions", count: questions.length },
              { id: "users", label: "Users", count: users.length },
              { id: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">{tab.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "questions" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Question Management</h2>
                <button
                  onClick={() => downloadReport("questions")}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Download Report
                </button>
              </div>

              <div className="space-y-6">
                {/* Pending Questions */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    Pending Questions ({pendingQuestions.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingQuestions.map((question) => (
                      <div key={question.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{question.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              by {question.author?.username} • {new Date(question.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {question.tags?.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => updateQuestionStatus(question.id, "accepted")}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateQuestionStatus(question.id, "rejected")}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {pendingQuestions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No pending questions</p>
                    )}
                  </div>
                </div>

                {/* Accepted Questions */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    Accepted Questions ({acceptedQuestions.length})
                  </h3>
                  <div className="space-y-3">
                    {acceptedQuestions.slice(0, 5).map((question) => (
                      <div key={question.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{question.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              by {question.author?.username} • {new Date(question.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => updateQuestionStatus(question.id, "rejected")}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                    {acceptedQuestions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No accepted questions</p>
                    )}
                  </div>
                </div>

                {/* Rejected Questions */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    Rejected Questions ({rejectedQuestions.length})
                  </h3>
                  <div className="space-y-3">
                    {rejectedQuestions.slice(0, 5).map((question) => (
                      <div key={question.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{question.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              by {question.author?.username} • {new Date(question.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => updateQuestionStatus(question.id, "accepted")}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    ))}
                    {rejectedQuestions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No rejected questions</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                <button
                  onClick={() => downloadReport("users")}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Download Report
                </button>
              </div>

              <div className="space-y-6">
                {/* Active Users */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Active Users ({activeUsers.length})</h3>
                  <div className="space-y-3">
                    {activeUsers.map((user) => (
                      <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{user.username}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">
                              Joined {new Date(user.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowBanModal(true)
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Ban User
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Banned Users */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Banned Users ({bannedUsers.length})</h3>
                  <div className="space-y-3">
                    {bannedUsers.map((user) => (
                      <div key={user.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{user.username}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-red-600">Banned</p>
                          </div>
                          <button
                            onClick={() => unbanUser(user.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Unban
                          </button>
                        </div>
                      </div>
                    ))}
                    {bannedUsers.length === 0 && <p className="text-gray-500 text-center py-4">No banned users</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Platform Settings</h2>

              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Global Messaging</h3>
                  <p className="text-sm text-gray-600 mb-4">Send a platform-wide message to all users</p>
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Global Message
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Data Export</h3>
                  <p className="text-sm text-gray-600 mb-4">Download platform data for analysis and backup</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => downloadReport("users")}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Export User Data
                    </button>
                    <button
                      onClick={() => downloadReport("questions")}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Export Question Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ban User Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ban User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to ban <strong>{selectedUser.username}</strong>? This action will prevent them from
              accessing the platform.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => banUser(selectedUser.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Ban User
              </button>
              <button
                onClick={() => {
                  setShowBanModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Global Message</h3>
            <textarea
              value={globalMessage}
              onChange={(e) => setGlobalMessage(e.target.value)}
              placeholder="Enter your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={sendGlobalMessage}
                disabled={!globalMessage.trim()}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send Message
              </button>
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setGlobalMessage("")
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
