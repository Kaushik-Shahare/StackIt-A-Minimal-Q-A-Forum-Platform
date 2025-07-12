"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import QuestionCard from "@/components/QuestionCard"
import { getQuestions, getTags } from "@/services/Apiservices"

export default function HomePage() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [tags, setTags] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchQuestionsAndTags()
  }, [])

  const fetchQuestionsAndTags = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch questions and tags in parallel
      const [questionsResponse, tagsResponse] = await Promise.all([
        getQuestions({ ordering: '-created_at' }),
        getTags()
      ])
      
      setQuestions(questionsResponse.results || questionsResponse.data || questionsResponse)
      setTags(tagsResponse.results || tagsResponse.data || tagsResponse)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load questions. Please try again.')
      
      // Fallback to mock data if API fails
      const mockQuestions = [
        {
          id: 1,
          title: "How to use React hooks effectively?",
          description: "I'm new to React hooks and wondering about best practices for useState and useEffect.",
          preview: "I'm new to React hooks and wondering about best practices...",
          tags: [{ name: "React" }, { name: "JavaScript" }],
          vote_count: 15,
          answer_count: 3,
          author: { username: "reactdev", name: "React Dev" },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          status: "open",
          slug: "how-to-use-react-hooks-effectively-1"
        },
        {
          id: 2,
          title: "Best practices for API authentication in Next.js?",
          description: "What are the recommended approaches for handling authentication in Next.js applications?",
          preview: "What are the recommended approaches for handling authentication...",
          tags: [{ name: "Next.js" }, { name: "Authentication" }, { name: "API" }],
          vote_count: 8,
          answer_count: 2,
          author: { username: "webdev123", name: "Web Dev" },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          status: "open",
          slug: "best-practices-for-api-authentication-in-nextjs-2"
        },
        {
          id: 3,
          title: "CSS Grid vs Flexbox - when to use which?",
          description: "I'm confused about when to use CSS Grid versus Flexbox for layouts.",
          preview: "I'm confused about when to use CSS Grid versus Flexbox...",
          tags: [{ name: "CSS" }],
          vote_count: 12,
          answer_count: 5,
          author: { username: "cssmaster", name: "CSS Master" },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          status: "open",
          slug: "css-grid-vs-flexbox-when-to-use-which-3"
        },
      ]
      setQuestions(mockQuestions)
      
      const mockTags = [
        { name: "React", question_count: 5 },
        { name: "JavaScript", question_count: 8 },
        { name: "Next.js", question_count: 3 },
        { name: "CSS", question_count: 4 },
        { name: "Node.js", question_count: 2 },
        { name: "Python", question_count: 6 },
        { name: "TypeScript", question_count: 3 },
        { name: "API", question_count: 7 },
        { name: "Database", question_count: 4 },
        { name: "Authentication", question_count: 2 },
      ]
      setTags(mockTags)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const params = {}
      
      if (searchTerm) {
        params.search = searchTerm
      }
      
      const orderMapping = {
        newest: '-created_at',
        oldest: 'created_at',
        votes: '-vote_count',
        answers: '-answer_count'
      }
      params.ordering = orderMapping[sortBy] || '-created_at'
      
      const response = await getQuestions(params)
      let questionsList = response.results || response.data || response
      
      // Filter by selected tags if any
      if (selectedTags.length > 0) {
        questionsList = questionsList.filter(q => 
          q.tags && q.tags.some(tag => selectedTags.includes(tag.name))
        )
      }
      
      setQuestions(questionsList)
    } catch (err) {
      console.error('Error searching questions:', err)
      setError('Failed to search questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch()
    }, 500)
    
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, sortBy, selectedTags])

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = !searchTerm || 
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
      (q.tags && q.tags.some(tag => selectedTags.includes(tag.name)))
    return matchesSearch && matchesTags
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
            {loading ? 'Loading...' : `${filteredQuestions.length} question${filteredQuestions.length !== 1 ? "s" : ""}`}
          </p>
          {error && (
            <p className="text-red-600 text-sm mt-1">{error}</p>
          )}
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
              disabled={loading}
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
            {tags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => toggleTag(tag.name)}
                disabled={loading}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag.name) 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {tag.name} {tag.question_count && `(${tag.question_count})`}
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
            disabled={loading}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredQuestions.length > 0 ? (
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
