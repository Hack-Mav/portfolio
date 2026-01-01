import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { HiHome, HiArrowLeft } from 'react-icons/hi'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Portfolio</title>
        <meta
          name="description"
          content="The page you are looking for could not be found."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center section-padding bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="text-8xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                404
              </div>
              <div className="w-24 h-1 bg-primary-600 dark:bg-primary-400 mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Page Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Oops! The page you're looking for doesn't exist or has been
                moved. Let's get you back on track.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/"
                className="btn-primary inline-flex items-center justify-center"
              >
                <HiHome className="w-5 h-5 mr-2" />
                Go Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="btn-secondary inline-flex items-center justify-center"
              >
                <HiArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </button>
            </motion.div>

            {/* Additional Help */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Looking for something specific?
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <Link
                  to="/about"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  About
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link
                  to="/projects"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Projects
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link
                  to="/contact"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
