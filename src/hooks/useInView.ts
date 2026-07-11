import { useEffect, useRef, useState } from 'react'
import { observe, unobserve } from '@/utils/intersectionObserver'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
  initial?: boolean
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
  initial = false,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(initial)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    return observe(
      element,
      entry => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) {
            unobserve(element)
          }
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )
  }, [threshold, rootMargin, once])

  return { ref, isInView }
}
