"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import RichTextEditor from "@/components/RichTextEditor"
import TagSelector from "@/components/TagSelector"

export default function AskQuestionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in required</h1>
        <p className="text-gray-600">You need to be signed in to ask a question.</p>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || tags.length === 0) {
      alert("Please fill in all fields and select at least one tag.")
      return
    }

    setIsSubmitting(true)

    try {
      // Create new question
      const newQuestion = {
        id: Date.now(),
        title: title.trim(),
        description,
        preview: description.replace(/<[^>]*>/g, "").substring(0, 200) + "...",
        tags,
        votes: 0,
        answerCount: 0,
        author: {
          username: user.username,
          avatar: user.avatar,
        },
        createdAt: new Date().toISOString(),
        status: "open",
        answers: [],
      }

      // Save to localStorage
      const existingQuestions = JSON.parse(localStorage.getItem("stackit_questions") || "[]")
      const updatedQuestions = [newQuestion, ...existingQuestions]
      localStorage.setItem("stackit_questions", JSON.stringify(updatedQuestions))

      // Redirect to the new question
      router.push(`/questions/${newQuestion.id}`)
    } catch (error) {
      console.error("Error creating question:", error)
      alert("Failed to create question. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
        <p className="text-gray-600">Get help from the community by asking a clear, detailed question.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., How to implement authentication in Next.js?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={200}
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            Be specific and imagine you're asking a question to another person.
          </p>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags *</label>
          <TagSelector selectedTags={tags} onTagsChange={setTags} maxTags={5} />
          <p className="text-sm text-gray-500 mt-2">Add up to 5 tags to describe what your question is about.</p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Details *</label>
          <RichTextEditor
            content={description}
            onChange={setDescription}
            placeholder="Provide all the details about your question. Include what you've tried and what you're expecting to happen."
          />
          <p className="text-sm text-gray-500 mt-2">
            Include all the information someone would need to answer your question.
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim() || tags.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? "Publishing..." : "Publish Question"}
          </button>
        </div>
      </form>
    </div>
  )
}
