import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for managing focus within a container
 * Traps focus within the container and returns focus to the trigger element when unmounted
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    // Store the currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    // Get all focusable elements within the container
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus the first element
    firstElement?.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Add event listener
    container.addEventListener('keydown', handleTabKey)

    // Cleanup
    return () => {
      container.removeEventListener('keydown', handleTabKey)
      // Restore focus to the previous element
      previousFocusRef.current?.focus()
    }
  }, [isActive])

  return containerRef
}

/**
 * Custom hook for managing keyboard navigation
 * Provides arrow key navigation and enter/space activation for custom components
 */
export function useKeyboardNavigation(
  items: HTMLElement[],
  onSelect?: (index: number) => void,
  options: {
    orientation?: 'horizontal' | 'vertical'
    loop?: boolean
    activateOnEnter?: boolean
    activateOnSpace?: boolean
  } = {}
) {
  const {
    orientation = 'vertical',
    loop = true,
    activateOnEnter = true,
    activateOnSpace = true,
  } = options

  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const handleKeyDown = (e: KeyboardEvent) => {
    const { key } = e
    let newIndex = selectedIndex

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        newIndex = selectedIndex + 1
        if (newIndex >= items.length) {
          newIndex = loop ? 0 : items.length - 1
        }
        break

      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        newIndex = selectedIndex - 1
        if (newIndex < 0) {
          newIndex = loop ? items.length - 1 : 0
        }
        break

      case 'Home':
        e.preventDefault()
        newIndex = 0
        break

      case 'End':
        e.preventDefault()
        newIndex = items.length - 1
        break

      case 'Enter':
        if (activateOnEnter && selectedIndex >= 0) {
          e.preventDefault()
          onSelect?.(selectedIndex)
        }
        return

      case ' ':
        if (activateOnSpace && selectedIndex >= 0) {
          e.preventDefault()
          onSelect?.(selectedIndex)
        }
        return

      default:
        return
    }

    // Update selected index and focus
    if (newIndex !== selectedIndex && items?.[newIndex]) {
      setSelectedIndex(newIndex)
      items[newIndex]!.focus()
    }
  }

  return {
    handleKeyDown,
    setSelectedIndex,
    selectedIndex,
  }
}

/**
 * Custom hook for managing focus restoration
 * Automatically restores focus when a component unmounts
 */
export function useFocusRestore(restoreOnUnmount: boolean = true) {
  const triggerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!restoreOnUnmount) return

    const trigger = triggerRef.current
    if (!trigger) return

    return () => {
      // Restore focus to the trigger element
      trigger.focus()
    }
  }, [restoreOnUnmount])

  return triggerRef
}

/**
 * Custom hook for skip links functionality
 * Helps users skip to main content or navigation
 */
export function useSkipLinks() {
  const skipLinksRef = useRef<HTMLDivElement>(null)

  const skipToMain = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView()
    }
  }

  const skipToNavigation = () => {
    const navigation = document.getElementById('main-navigation')
    if (navigation) {
      navigation.focus()
      navigation.scrollIntoView()
    }
  }

  return {
    skipLinksRef,
    skipToMain,
    skipToNavigation,
  }
}

/**
 * Custom hook for managing ARIA live regions
 * Provides screen reader announcements for dynamic content
 */
export function useAriaLive() {
  const liveRegionRef = useRef<HTMLDivElement>(null)

  const announce = (
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    liveRegion.textContent = message

    document.body.appendChild(liveRegion)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion)
    }, 1000)
  }

  return {
    liveRegionRef,
    announce,
  }
}

/**
 * Custom hook for managing focus indicators
 * Improves visibility of focused elements for keyboard users
 */
export function useFocusIndicator() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add focus indicator class when using keyboard
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation')
      }
    }

    const handleMouseDown = () => {
      // Remove focus indicator class when using mouse
      document.body.classList.remove('keyboard-navigation')
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])
}

/**
 * Utility function to generate unique IDs for accessibility
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Utility function to check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ]

  return focusableSelectors.some(selector => element.matches(selector))
}

/**
 * Utility function to get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ]

  const selector = focusableSelectors.join(', ')
  return Array.from(container.querySelectorAll(selector)) as HTMLElement[]
}
