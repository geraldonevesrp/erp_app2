"use client"

import { X } from "lucide-react"
import { useState, KeyboardEvent, useRef, useEffect } from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  onTagCreate?: (tag: string) => Promise<void>
  onTagRemove?: (tag: string) => Promise<void>
  placeholder?: string
  className?: string
}

export function TagInput({
  value = [],
  onChange,
  onTagCreate,
  onTagRemove,
  placeholder,
  className
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      
      // Se tiver função de criação, chama ela primeiro
      if (onTagCreate) {
        await onTagCreate(inputValue.trim())
      }
      
      // Adiciona a tag à lista
      onChange([...value, inputValue.trim()])
      setInputValue("")
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove a última tag quando pressionar backspace com input vazio
      const lastTag = value[value.length - 1]
      if (onTagRemove) {
        await onTagRemove(lastTag)
      }
      onChange(value.slice(0, -1))
    }
  }

  const handleRemoveTag = async (tagToRemove: string) => {
    // Se tiver função de remoção, chama ela primeiro
    if (onTagRemove) {
      await onTagRemove(tagToRemove)
    }
    
    // Remove a tag da lista
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  // Foca no input quando clicar no container
  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-wrap gap-1 p-2 bg-white border rounded-md cursor-text min-h-[42px]",
        className
      )}
      onClick={handleContainerClick}
    >
      {value.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md group"
        >
          {tag}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveTag(tag)
            }}
            className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-blue-200"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 outline-none bg-transparent min-w-[120px]"
      />
    </div>
  )
}
