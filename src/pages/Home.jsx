import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { HiArrowRight, HiDownload } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import ProjectCard from '@components/ui/ProjectCard'
import LoadingSpinner from '@components/ui/LoadingSpinner'
import { githubService } from '@/services/github'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const data = await githubService.getRepositories()
        // Get top 6 projects by stars
        const featured = data
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6)
        setProjects(featured)
      } catch (err) {
        setError('Failed to load projects')
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProjects()
  }, [])

  return (
    <>
      <Helmet>
        <title>Home | Portfolio</title>
        <meta
          name="description"
          content="Full-stack developer passionate about creating innovative web solutions"
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container-max">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Full-Stack Developer &{' '}
                <span className="text-primary-600 dark:text-primary-400">
                  Problem Solver
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                I craft modern web applications with clean code, intuitive
                design, and scalable architecture. Let's build something amazing
                together.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link
                  to="/projects"
                  className="btn-primary inline-flex items-center"
                >
                  View My Work
                  <HiArrowRight className="w-5 h-5 ml-2" />
                </Link>

                <a
                  href="/asserts/Test_Full_Stack_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center"
                >
                  <HiDownload className="w-5 h-5 mr-2" />
                  Download Resume
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="section-padding">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A selection of my recent work showcasing different technologies
                and approaches
              </p>
            </motion.div>

            {loading && <LoadingSpinner size="lg" />}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-secondary"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            )}

            {!loading && !error && projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link
                  to="/projects"
                  className="btn-primary inline-flex items-center"
                >
                  View All Projects
                  <HiArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gray-100 dark:bg-gray-800">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Let's Work Together
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                I'm always interested in new opportunities and exciting
                projects. Let's discuss how we can bring your ideas to life.
              </p>
              <Link
                to="/contact"
                className="btn-primary inline-flex items-center"
              >
                Get In Touch
                <HiArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
