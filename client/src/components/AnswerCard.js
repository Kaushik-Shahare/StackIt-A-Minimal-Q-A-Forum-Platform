"use client"

export default function AnswerCard({ answer, onVote, onAccept, canAccept, currentUser }) {
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
    <div
      className={`bg-white rounded-lg border p-6 ${answer.accepted ? "border-green-200 bg-green-50" : "border-gray-200"}`}
    >
      <div className="flex items-start space-x-4">
        {/* Voting */}
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={() => onVote(answer.id, "up")}
            disabled={!currentUser}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </button>
          <span className="text-lg font-semibold text-gray-900">{answer.votes || 0}</span>
          <button
            onClick={() => onVote(answer.id, "down")}
            disabled={!currentUser}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </button>

          {/* Accept button */}
          {canAccept && (
            <button
              onClick={() => onAccept(answer.id)}
              className={`p-2 rounded-full transition-colors ${
                answer.accepted ? "bg-green-100 text-green-600" : "hover:bg-gray-100 text-gray-400 hover:text-green-600"
              }`}
              title={answer.accepted ? "Accepted answer" : "Mark as accepted"}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          {answer.accepted && (
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-600 font-medium text-sm">Accepted Answer</span>
            </div>
          )}

          <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: answer.content }} />

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <img
                src={
                  answer.author?.avatar ||
                  `https://ui-avatars.com/api/?name=${answer.author?.username}&background=3b82f6&color=fff`
                }
                alt={answer.author?.username}
                className="w-6 h-6 rounded-full"
              />
              <span>answered by {answer.author?.username}</span>
              <span>•</span>
              <span>{formatTime(answer.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
