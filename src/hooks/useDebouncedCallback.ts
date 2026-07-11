import { useCallback, useEffect, useRef } from 'react'

/**
 * Creates a debounced version of the provided callback that delays invocation
 * until after `delay` milliseconds have elapsed since the last call.
 */
export const useDebouncedCallback = <T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): {
  invoke: (...args: Parameters<T>) => void
  cancel: () => void
} => {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const invoke = useCallback(
    (...args: Parameters<T>) => {
      cancel()

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [cancel, delay]
  )

  return { invoke, cancel }
}

/**
 * Creates a throttled version of the provided callback that ensures the
 * callback is executed at most once within the specified interval.
 */
export const useThrottledCallback = <T extends (...args: never[]) => void>(
  callback: T,
  interval: number
): {
  invoke: (...args: Parameters<T>) => void
  cancel: () => void
} => {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isThrottledRef = useRef(false)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    isThrottledRef.current = false
  }, [])

  const invoke = useCallback(
    (...args: Parameters<T>) => {
      if (isThrottledRef.current) {
        return
      }

      callbackRef.current(...args)
      isThrottledRef.current = true

      timeoutRef.current = setTimeout(() => {
        isThrottledRef.current = false
        timeoutRef.current = null
      }, interval)
    },
    [interval]
  )

  return { invoke, cancel }
}
