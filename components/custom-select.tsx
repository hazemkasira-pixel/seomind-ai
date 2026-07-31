'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search, X } from 'lucide-react'

type Option = {
  value: string
  label: string
}

type OptionGroup = {
  label: string
  options: Option[]
}

type CustomSelectProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  groups: OptionGroup[]
  disabled?: boolean
  searchable?: boolean
}

export function CustomSelect({ 
  value, 
  onChange, 
  placeholder, 
  groups, 
  disabled = false,
  searchable = true 
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // إغلاق الـ dropdown لما المستخدم يدوس بره
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('') // مسح البحث عند الإغلاق
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // التركيز على حقل البحث عند فتح الـ dropdown
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, searchable])

  // العثور على الـ label الخاص بالقيمة المختارة
  const getSelectedLabel = () => {
    if (!value) return placeholder
    for (const group of groups) {
      const found = group.options.find(opt => opt.value === value)
      if (found) return found.label
    }
    return value
  }

  // فلترة الخيارات بناءً على البحث
  const filteredGroups = searchable && searchQuery.trim() !== ''
    ? groups.map(group => ({
        ...group,
        options: group.options.filter(option =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(group => group.options.length > 0)
    : groups

  const hasResults = filteredGroups.length > 0

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`h-12 w-full rounded-xl border bg-background/50 px-4 text-left text-sm transition-all flex items-center justify-between ${
          disabled
            ? 'border-border/50 bg-background/30 text-muted-foreground/50 cursor-not-allowed'
            : value
            ? 'border-teal/50 text-foreground bg-background/80'
            : 'border-border text-muted-foreground/60 hover:border-teal/30'
        } ${isOpen && !disabled ? 'border-teal/50 ring-2 ring-teal/20' : ''}`}
      >
        <span className="truncate flex-1">{getSelectedLabel()}</span>
        {value && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange('')
            }}
            className="ml-2 p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="custom-scrollbar absolute z-50 mt-2 w-full rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl max-h-80 overflow-hidden">
          {/* حقل البحث */}
          {searchable && (
            <div className="sticky top-0 z-10 p-3 border-b border-border/50 bg-background/95 backdrop-blur-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background/50 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* النتائج */}
          <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
            {hasResults ? (
              filteredGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/30">
                    {group.label}
                  </div>
                  {group.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value)
                        setIsOpen(false)
                        setSearchQuery('')
                      }}
                      className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-colors ${
                        value === option.value
                          ? 'bg-teal/10 text-teal font-medium'
                          : 'text-foreground hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {value === option.value && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found for "{searchQuery}"</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-teal text-sm hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}