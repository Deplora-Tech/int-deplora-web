'use client'

import { ChevronLeft } from 'lucide-react'
import { useState, useCallback, useRef, useEffect } from 'react'

interface ResizablePanelProps {
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
}

export function ResizablePanel({ 
  children, 
  defaultWidth = 400,
  minWidth = 350,
  maxWidth = 450 
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && resizeRef.current) {
      const newWidth = e.clientX - resizeRef.current.getBoundingClientRect().left
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth)
      }
    }
  }, [isResizing, minWidth, maxWidth])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    }
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    if (isCollapsed) {
      setWidth(defaultWidth)
    }
  }

  return (
    <div ref={resizeRef} className="flex">
      <div 
        style={{ width: isCollapsed ? 0 : width }} 
        className="flex-shrink-0 transition-[width] duration-300 ease-in-out"
      >
        {children}
      </div>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 -left-px w-px bg-gradient-to-b from-transparent via-neutral-800 to-transparent" />
        <button
          onClick={toggleCollapse}
          className="w-6 h-24 flex items-center justify-center hover:bg-neutral-800/50 text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
        {!isCollapsed && (
          <div
            onMouseDown={startResizing}
            className="absolute inset-y-0 right-0 w-1 cursor-col-resize"
          />
        )}
      </div>
    </div>
  )
}

