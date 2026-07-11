import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as Sentry from '@sentry/react'
import AppErrorBoundary from '../AppErrorBoundary'

// Mock the Sentry module
vi.mock('@sentry/react', () => {
  const actual = vi.importActual('@sentry/react')
  return {
    ...actual,
    captureException: vi.fn(),
    withScope: vi.fn(callback => {
      const scope = {
        setExtras: vi.fn(),
        setTag: vi.fn(),
      }
      if (callback) {
        callback(scope)
      }
      return scope
    }),
    showReportDialog: vi.fn(),
    configureScope: vi.fn(),
    init: vi.fn(),
  }
})

// Mock a component that throws an error
const ErrorComponent = () => {
  throw new Error('Test error')
}

// Mock a working component
const WorkingComponent = () => <div>All good!</div>

describe('AppErrorBoundary', () => {
  // Reset mocks before and after each test
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.error to avoid error logs in test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <AppErrorBoundary>
        <WorkingComponent />
      </AppErrorBoundary>
    )

    expect(screen.getByText('All good!')).toBeInTheDocument()
  })

  it('displays fallback UI when child throws an error', () => {
    // Render the error boundary with a component that throws
    render(
      <AppErrorBoundary>
        <ErrorComponent />
      </AppErrorBoundary>
    )

    // Verify the error boundary shows the fallback UI
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()

    // Verify Sentry was called with an error
    expect(Sentry.captureException).toHaveBeenCalled()
    expect(Sentry.withScope).toHaveBeenCalled()
  })

  it('calls onError when provided and error occurs', () => {
    const onError = vi.fn()

    render(
      <AppErrorBoundary onError={onError}>
        <ErrorComponent />
      </AppErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(String))
    expect(Sentry.captureException).toHaveBeenCalled()
  })

  it('resets error state when resetError is called', () => {
    // Create a test component that can toggle between error and working state
    const TestComponent = ({ shouldError = false }) => {
      if (shouldError) {
        throw new Error('Test error')
      }
      return <div>All good!</div>
    }

    // First render with error
    const { container, rerender } = render(
      <AppErrorBoundary>
        <TestComponent shouldError={true} />
      </AppErrorBoundary>
    )

    // Verify error state is shown
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()

    // Find and click the reset button
    const resetButton = screen.getByRole('button', { name: /try again/i })

    // Use act to handle the state update
    act(() => {
      fireEvent.click(resetButton)

      // Re-render with a non-error state in the same act block
      rerender(
        <AppErrorBoundary>
          <TestComponent shouldError={false} />
        </AppErrorBoundary>
      )
    })

    // The error boundary should now show the working component
    expect(screen.getByText('All good!')).toBeInTheDocument()
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
  })

  it('uses custom fallback when provided', () => {
    const CustomFallback = ({
      error,
      resetError,
    }: {
      error: Error
      resetError: () => void
    }) => (
      <div>
        <h1>Custom Error</h1>
        <p>{error.message}</p>
        <button onClick={resetError}>Retry</button>
      </div>
    )

    render(
      <AppErrorBoundary fallback={CustomFallback}>
        <ErrorComponent />
      </AppErrorBoundary>
    )

    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })
})
