import { Spinner } from '@/design-system'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Spinner size={size} aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
