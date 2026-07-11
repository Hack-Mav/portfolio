import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { resetSharedIntersectionObserver } from '@/utils/intersectionObserver'
import LazyImage from '../LazyImage'

// Shared observer instance reused by each LazyImage in tests
const observerMock = {
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}

// Mock IntersectionObserver as a constructible function
const mockIntersectionObserver = vi.fn(function (
  this: void,
  _callback: Function
) {
  return observerMock
})
window.IntersectionObserver =
  mockIntersectionObserver as unknown as typeof IntersectionObserver

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

describe('LazyImage', () => {
  const defaultProps = {
    src: 'https://example.com/test-image.jpg',
    alt: 'Test image',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Restore the LazyImage-specific constructible observer
    window.IntersectionObserver =
      mockIntersectionObserver as unknown as typeof IntersectionObserver
    resetSharedIntersectionObserver()
    // Reset to a default constructible implementation for each test
    mockIntersectionObserver.mockImplementation(function (
      this: void,
      _callback: Function
    ) {
      return observerMock
    })
  })

  it('renders placeholder initially', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('data:image/svg+xml')
    )
  })

  it('loads image when in view', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let storedCallback: any = null

    mockIntersectionObserver.mockImplementation(function (
      this: void,
      callback: any
    ) {
      storedCallback = callback
      return observerMock
    })

    render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    // Simulate image entering viewport
    const img = screen.getByRole('img')
    if (storedCallback) {
      storedCallback([
        {
          isIntersecting: true,
          target: img,
        } as unknown as IntersectionObserverEntry,
      ])
    }

    await waitFor(() => {
      expect(img).toHaveAttribute('src', 'https://example.com/test-image.jpg')
    })
  })

  it('shows error state when image fails to load', async () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')

    // Simulate error event
    fireEvent.error(img)

    await waitFor(() => {
      expect(screen.getByText('Failed to load image')).toBeInTheDocument()
    })
  })

  it('applies custom className', () => {
    const customClass = 'custom-test-class'

    render(
      <TestWrapper>
        <LazyImage {...defaultProps} className={customClass} />
      </TestWrapper>
    )

    const container = screen.getByRole('img').closest('div')
    expect(container).toHaveClass(customClass)
  })

  it('calls onLoad callback when image loads', async () => {
    const onLoad = vi.fn()

    render(
      <TestWrapper>
        <LazyImage {...defaultProps} onLoad={onLoad} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    fireEvent.load(img)

    expect(onLoad).toHaveBeenCalled()
  })

  it('calls onError callback when image fails', async () => {
    const onError = vi.fn()

    render(
      <TestWrapper>
        <LazyImage {...defaultProps} onError={onError} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    fireEvent.error(img)

    expect(onError).toHaveBeenCalled()
  })

  it('uses custom placeholder', () => {
    const customPlaceholder = 'https://example.com/placeholder.jpg'

    render(
      <TestWrapper>
        <LazyImage {...defaultProps} placeholder={customPlaceholder} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', customPlaceholder)
  })

  it('respects threshold option', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} threshold={0.5} />
      </TestWrapper>
    )

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.5 })
    )
  })

  it('respects rootMargin option', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} rootMargin="100px" />
      </TestWrapper>
    )

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ rootMargin: '100px' })
    )
  })

  it('shows loading skeleton initially', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    const skeleton = screen
      .getByRole('img')
      .closest('div')
      ?.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('removes loading skeleton after load', async () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    fireEvent.load(img)

    await waitFor(() => {
      const skeleton = screen
        .getByRole('img')
        .closest('div')
        ?.querySelector('.animate-pulse')
      expect(skeleton).not.toBeInTheDocument()
    })
  })

  it('has proper alt text', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Test image')
  })

  it('passes through other img props', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} width={100} height={200} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('width', '100')
    expect(img).toHaveAttribute('height', '200')
  })

  it('handles empty src gracefully', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} src="" />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
  })

  it('handles missing alt text', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} alt="" />
      </TestWrapper>
    )

    // Images with an empty alt are ignored by assistive technologies
    const img = screen.getByRole('presentation')
    expect(img).toHaveAttribute('alt', '')
  })

  it('applies blur effect during loading', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    expect(img).toHaveClass('opacity-75', 'blur-sm')
  })

  it('removes blur effect after load', async () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    fireEvent.load(img)

    await waitFor(() => {
      expect(img).toHaveClass('opacity-100', 'blur-0')
    })
  })

  it('shows error indicator when image fails', async () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    fireEvent.error(img)

    await waitFor(() => {
      const errorIndicator = screen.getByText('Failed to load image')
      expect(errorIndicator).toBeInTheDocument()
    })
  })

  it('is accessible via keyboard', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} tabIndex={0} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    img.focus()
    expect(img).toHaveFocus()
  })

  it('has proper ARIA attributes', () => {
    render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Test image')
  })

  it('handles multiple images correctly', () => {
    const { rerender } = render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
        <LazyImage src="https://example.com/image2.jpg" alt="Second image" />
      </TestWrapper>
    )

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
  })

  it('cleans up IntersectionObserver on unmount', () => {
    const { unmount } = render(
      <TestWrapper>
        <LazyImage {...defaultProps} />
      </TestWrapper>
    )

    const mockUnobserve =
      mockIntersectionObserver.mock.results[0]?.value?.unobserve
    unmount()

    expect(mockUnobserve).toHaveBeenCalled()
  })
})
