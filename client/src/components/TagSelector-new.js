"use client"
import { useState } from "react"

export default function TagSelector({ selectedTags, onTagsChange, availableTags = [], maxTags = 5 }) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Default tags if none provided
  const defaultTags = [
    { name: "React" },
    { name: "JavaScript" },
    { name: "Next.js" },
    { name: "CSS" },
    { name: "Node.js" },
    { name: "Python" },
    { name: "TypeScript" },
    { name: "API" },
    { name: "Database" },
    { name: "Authentication" },
    { name: "HTML" },
    { name: "Vue.js" },
    { name: "Angular" },
    { name: "Express" },
    { name: "MongoDB" },
    { name: "PostgreSQL" },
    { name: "GraphQL" },
    { name: "REST" },
    { name: "JWT" },
    { name: "OAuth" },
    { name: "AWS" },
    { name: "Docker" },
    { name: "Git" },
  ]

  const tags = availableTags.length > 0 ? availableTags : defaultTags
  
  const filteredTags = tags.filter(
    (tag) => {
      const tagName = typeof tag === 'string' ? tag : tag.name
      return tagName.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.includes(tagName)
    }
  )

  const addTag = (tag) => {
    const tagName = typeof tag === 'string' ? tag : tag.name
    if (selectedTags.length < maxTags && !selectedTags.includes(tagName)) {
      onTagsChange([...selectedTags, tagName])
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      const exactMatch = tags.find((tag) => {
        const tagName = typeof tag === 'string' ? tag : tag.name
        return tagName.toLowerCase() === inputValue.toLowerCase()
      })
      if (exactMatch) {
        addTag(exactMatch)
      } else if (inputValue.trim().length > 0) {
        addTag(inputValue.trim())
      }
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1])
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[44px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        {selectedTags.map((tag) => (
          <span key={tag} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        ))}

        {selectedTags.length < maxTags && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={selectedTags.length === 0 ? "Type to search tags..." : ""}
            className="flex-1 min-w-[120px] outline-none bg-transparent"
          />
        )}
      </div>

      {showSuggestions && inputValue && filteredTags.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredTags.slice(0, 10).map((tag, index) => {
            const tagName = typeof tag === 'string' ? tag : tag.name
            return (
              <button
                key={index}
                type="button"
                onClick={() => addTag(tag)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                {tagName}
              </button>
            )
          })}
        </div>
      )}

      {selectedTags.length >= maxTags && (
        <p className="text-sm text-gray-500 mt-1">Maximum {maxTags} tags allowed</p>
      )}
    </div>
  )
}
