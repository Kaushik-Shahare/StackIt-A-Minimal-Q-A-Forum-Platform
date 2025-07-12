"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import QuestionCard from "@/components/QuestionCard"


export default function HomePage() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [sortBy, setSortBy] = useState("newest")

  const availableTags = [
    "React",
    "JavaScript",
    "Next.js",
    "CSS",
    "Node.js",
    "Python",
    "TypeScript",
    "API",
    "Database",
    "Authentication",
  ]

  useEffect(() => {
    // Load questions from localStorage or use mock data
    const savedQuestions = localStorage.getItem("stackit_questions")
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions))
    } else {
      const mockQuestions = [
        {
          id: 1,
          title: "How to use React hooks effectively?",
          description: "I'm new to React hooks and wondering about best practices for useState and useEffect.",
          preview: "I'm new to React hooks and wondering about best practices...",
          tags: ["React", "JavaScript"],
          votes: 15,
          answerCount: 3,
          author: { username: "reactdev", avatar: null },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          status: "open",
        },
        {
          id: 2,
          title: "Best practices for API authentication in Next.js?",
          description: "What are the recommended approaches for handling authentication in Next.js applications?",
          preview: "What are the recommended approaches for handling authentication...",
          tags: ["Next.js", "Authentication", "API"],
          votes: 8,
          answerCount: 2,
          author: { username: "webdev123", avatar: null },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          status: "open",
        },
        {
          id: 3,
          title: "CSS Grid vs Flexbox - when to use which?",
          description: "I'm confused about when to use CSS Grid versus Flexbox for layouts.",
          preview: "I'm confused about when to use CSS Grid versus Flexbox...",
          tags: ["CSS"],
          votes: 12,
          answerCount: 5,
          author: { username: "cssmaster", avatar: null },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          status: "open",
        },
      ]
      setQuestions(mockQuestions)
      localStorage.setItem("stackit_questions", JSON.stringify(mockQuestions))
    }
  }, [])

  const filteredQuestions = questions
    .filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => q.tags.includes(tag))
      return matchesSearch && matchesTags
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "votes":
          return (b.votes || 0) - (a.votes || 0)
        case "answers":
          return (b.answerCount || 0) - (a.answerCount || 0)
        default:
          return 0
      }
    })

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Questions</h1>
          <p className="text-gray-600">
            {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""}
          </p>
        </div>
        {user && (
          <Link
            href="/ask"
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ask Question
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by tags:</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="votes">Most Votes</option>
            <option value="answers">Most Answers</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => <QuestionCard key={question.id} question={question} />)
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No questions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedTags.length > 0
                ? "Try adjusting your search or filters."
                : "Be the first to ask a question!"}
            </p>
            {user && (
              <div className="mt-6">
                <Link
                  href="/ask"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Ask the first question
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  
}
