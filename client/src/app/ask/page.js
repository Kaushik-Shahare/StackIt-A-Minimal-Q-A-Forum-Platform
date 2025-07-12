"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import RichTextEditor from "@/components/RichTextEditor"
import TagSelector from "@/components/TagSelector"
import { createQuestion, getTags } from "@/services/Apiservices"

export default function AskQuestionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await getTags()
      setAvailableTags(response.results || response.data || response)
    } catch (err) {
      console.error('Error fetching tags:', err)
      // Fallback tags if API fails
      setAvailableTags([
        { id: 1, name: "React" },
        { id: 2, name: "JavaScript" },
        { id: 3, name: "Next.js" },
        { id: 4, name: "CSS" },
        { id: 5, name: "Node.js" },
        { id: 6, name: "Python" },
        { id: 7, name: "TypeScript" },
        { id: 8, name: "API" },
        { id: 9, name: "Database" },
        { id: 10, name: "Authentication" },
      ])
    }
  }

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
    setError("")
    
    if (!title.trim() || !description.trim() || selectedTags.length === 0) {
      setError("Please fill in all fields and select at least one tag.")
      return
    }

    setIsSubmitting(true)

    try {
      // Get tag IDs from selected tags
      const tagIds = selectedTags.map(tagName => {
        const tag = availableTags.find(t => t.name === tagName)
        return tag ? tag.id : null
      }).filter(Boolean)

      const questionData = {
        title: title.trim(),
        description: description,
        tag_ids: tagIds
      }

      const response = await createQuestion(questionData)
      
      // Redirect to the new question using slug
      const questionSlug = response.slug || response.data?.slug
      if (questionSlug) {
        router.push(`/questions/${questionSlug}`)
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Error creating question:", error)
      setError(error.message || "Failed to create question. Please try again.")
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

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
          <TagSelector 
            selectedTags={selectedTags} 
            onTagsChange={setSelectedTags} 
            availableTags={availableTags}
            maxTags={5} 
          />
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
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim() || selectedTags.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? "Publishing..." : "Publish Question"}
          </button>
        </div>
      </form>
    </div>
  )
}
