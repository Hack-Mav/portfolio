// src/setupTests.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { beforeEach, afterEach, vi } from 'vitest'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock scrollTo
window.scrollTo = vi.fn()

// Mock IntersectionObserver for FadeIn-based scroll animations
beforeEach(() => {
  globalThis.IntersectionObserver = vi.fn(function (
    this: void,
    callback: IntersectionObserverCallback
  ) {
    return {
      observe: (element: Element) => {
        callback(
          [
            {
              isIntersecting: true,
              target: element,
              boundingClientRect: {} as DOMRectReadOnly,
              intersectionRatio: 1,
              intersectionRect: {} as DOMRectReadOnly,
              rootBounds: null,
              time: Date.now(),
            },
          ] as unknown as IntersectionObserverEntry[],
          {} as IntersectionObserver
        )
      },
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [0],
    }
  }) as unknown as typeof IntersectionObserver
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
