import { Heading, Text } from '@components'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <Heading
        as="h1"
        size="xl"
        variant="primary"
        className="text-8xl md:text-9xl"
      >
        404
      </Heading>
      <Heading as="h2" size="md" className="mt-4">
        Page Not Found
      </Heading>
      <Text muted className="mt-2 max-w-md text-center">
        The page you're looking for doesn't exist or has been moved.
      </Text>
      <Link
        to={ROUTES.HOME}
        className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
      >
        Go back home
      </Link>
    </div>
  )
}

export default NotFound
