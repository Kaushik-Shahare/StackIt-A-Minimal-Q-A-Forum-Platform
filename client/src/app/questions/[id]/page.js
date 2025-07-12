"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "../../../contexts/AuthContext"
import { useNotifications } from "../../../contexts/NotificationContext"
import RichTextEditor from "@/components/RichTextEditor"
import AnswerCard from "@/components/AnswerCard"

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [newAnswer, setNewAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuestion = () => {
      const questions = JSON.parse(localStorage.getItem("stackit_questions") || "[]")
      const foundQuestion = questions.find((q) => q.id === Number.parseInt(params.id))

      if (foundQuestion) {
        setQuestion(foundQuestion)
        setAnswers(foundQuestion.answers || [])
      }
      setLoading(false)
    }

    loadQuestion()
  }, [params.id])

  const handleVote = (type) => {
    if (!user) return

    const questions = JSON.parse(localStorage.getItem("stackit_questions") || "[]")
    const updatedQuestions = questions.map((q) => {
      if (q.id === question.id) {
        const currentVotes = q.votes || 0
        const newVotes = type === "up" ? currentVotes + 1 : currentVotes - 1
        return { ...q, votes: Math.max(0, newVotes) }
      }
      return q
    })

    localStorage.setItem("stackit_questions", JSON.stringify(updatedQuestions))
    setQuestion((prev) => ({
      ...prev,
      votes: type === "up" ? (prev.votes || 0) + 1 : Math.max(0, (prev.votes || 0) - 1),
    }))
  }

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!user || !newAnswer.trim()) return

    setIsSubmitting(true)

    try {
      const newAnswerObj = {
        id: Date.now(),
        content: newAnswer,
        author: {
          username: user.username,
          avatar: user.avatar,
        },
        votes: 0,
        createdAt: new Date().toISOString(),
        accepted: false,
      }

      // Update answers
      const updatedAnswers = [...answers, newAnswerObj]
      setAnswers(updatedAnswers)

      // Update question in localStorage
      const questions = JSON.parse(localStorage.getItem("stackit_questions") || "[]")
      const updatedQuestions = questions.map((q) => {
        if (q.id === question.id) {
          return {
            ...q,
            answers: updatedAnswers,
            answerCount: updatedAnswers.length,
          }
        }
        return q
      })

      localStorage.setItem("stackit_questions", JSON.stringify(updatedQuestions))
      setQuestion((prev) => ({ ...prev, answerCount: updatedAnswers.length }))

      // Add notification for question author
      if (question.author.username !== user.username) {
        addNotification({
          type: "answer",
          message: `New answer to your question "${question.title}"`,
        })
      }

      setNewAnswer("")
    } catch (error) {
      console.error("Error submitting answer:", error)
      alert("Failed to submit answer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnswerVote = (answerId, type) => {
    if (!user) return

    const updatedAnswers = answers.map((answer) => {
      if (answer.id === answerId) {
        const currentVotes = answer.votes || 0
        const newVotes = type === "up" ? currentVotes + 1 : currentVotes - 1
        return { ...answer, votes: Math.max(0, newVotes) }
      }
      return answer
    })

    setAnswers(updatedAnswers)

    // Update in localStorage
    const questions = JSON.parse(localStorage.getItem("stackit_questions") || "[]")
    const updatedQuestions = questions.map((q) => {
      if (q.id === question.id) {
        return { ...q, answers: updatedAnswers }
      }
      return q
    })

    localStorage.setItem("stackit_questions", JSON.stringify(updatedQuestions))
  }

  const handleAcceptAnswer = (answerId) => {
    if (!user || user.username !== question.author.username) return

    const updatedAnswers = answers.map((answer) => ({
      ...answer,
      accepted: answer.id === answerId ? !answer.accepted : false,
    }))

    setAnswers(updatedAnswers)

    // Update in localStorage
    const questions = JSON.parse(localStorage.getItem("stackit_questions") || "[]")
    const updatedQuestions = questions.map((q) => {
      if (q.id === question.id) {
        return { ...q, answers: updatedAnswers }
      }
      return q
    })

    localStorage.setItem("stackit_questions", JSON.stringify(updatedQuestions))
  }

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h1>
        <p className="text-gray-600 mb-6">The question you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Questions
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Question */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start space-x-4">
          {/* Voting */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => handleVote("up")}
              disabled={!user}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </button>
            <span className="text-lg font-semibold text-gray-900">{question.votes || 0}</span>
            <button
              onClick={() => handleVote("down")}
              disabled={!user}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: question.description }} />

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>
                  {answers.length} answer{answers.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={
                    question.author?.avatar ||
                    `https://ui-avatars.com/api/?name=${question.author?.username}&background=3b82f6&color=fff`
                  }
                  alt={question.author?.username}
                  className="w-6 h-6 rounded-full"
                />
                <span>asked by {question.author?.username}</span>
                <span>•</span>
                <span>{formatTime(question.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {answers.length} Answer{answers.length !== 1 ? "s" : ""}
        </h2>

        <div className="space-y-6">
          {answers
            .sort((a, b) => {
              // Sort by accepted first, then by votes, then by date
              if (a.accepted && !b.accepted) return -1
              if (!a.accepted && b.accepted) return 1
              if ((b.votes || 0) !== (a.votes || 0)) return (b.votes || 0) - (a.votes || 0)
              return new Date(b.createdAt) - new Date(a.createdAt)
            })
            .map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                onVote={handleAnswerVote}
                onAccept={handleAcceptAnswer}
                canAccept={user?.username === question.author?.username}
                currentUser={user}
              />
            ))}
        </div>
      </div>

      {/* Answer Form */}
      {user ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
            <RichTextEditor content={newAnswer} onChange={setNewAnswer} placeholder="Write your answer here..." />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={isSubmitting || !newAnswer.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? "Submitting..." : "Post Answer"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-600 mb-4">Sign in to post an answer</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  )
}
