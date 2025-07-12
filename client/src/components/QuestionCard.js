import Link from "next/link"

export default function QuestionCard({ question }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  // Helper function to get tag name (handle both string and object formats)
  const getTagName = (tag) => {
    return typeof tag === 'string' ? tag : tag.name
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link
            href={`/questions/${question.slug || question.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {question.title}
          </Link>

          <p className="text-gray-600 mt-2 line-clamp-3">
            {question.preview || 
             (question.description && question.description.length > 200 
               ? question.description.substring(0, 200) + "..." 
               : question.description)}
          </p>

          <div className="flex items-center space-x-4 mt-4">
            <div className="flex flex-wrap gap-2">
              {question.tags?.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {getTagName(tag)}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <span>{question.vote_count || question.votes || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{question.answer_count || question.answerCount || 0} answers</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={
                  question.author?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(question.author?.name || question.author?.username || 'User')}&background=3b82f6&color=fff`
                }
                alt={question.author?.name || question.author?.username || 'User'}
                className="w-6 h-6 rounded-full"
              />
              <span>{question.author?.name || question.author?.username || 'Anonymous'}</span>
              <span>•</span>
              <span>{formatTime(question.created_at || question.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
