import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { PageSection } from '@components/templates/PageSection'

interface GitCommit {
  hash: string
  date: string
  subject: string
  body: string
}

const Changelog: React.FC = () => {
  const [commits, setCommits] = useState<GitCommit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await fetch('/changelog.json')
        if (!response.ok) {
          throw new Error('Failed to load changelog')
        }
        const data = await response.json()
        setCommits(data)
      } catch (err) {
        console.error('Error loading changelog:', err)
        // In development, show a message that changelog is only available in production builds
        if (import.meta.env.DEV) {
          setError('Changelog is only available in production builds. Run `npm run build` to generate it.')
        } else {
          setError('Failed to load changelog data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchChangelog()
  }, [])

  const getCommitType = (subject: string): 'feature' | 'fix' | 'improvement' | 'security' => {
    const lower = subject.toLowerCase()
    if (lower.startsWith('feat') || lower.startsWith('feature')) return 'feature'
    if (lower.startsWith('fix') || lower.startsWith('bugfix')) return 'fix'
    if (lower.startsWith('security') || lower.startsWith('sec')) return 'security'
    return 'improvement'
  }

  const typeColors: Record<'feature' | 'fix' | 'improvement' | 'security', string> = {
    feature: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    fix: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    improvement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    security: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  }

  const typeLabels: Record<'feature' | 'fix' | 'improvement' | 'security', string> = {
    feature: 'Feature',
    fix: 'Bug Fix',
    improvement: 'Improvement',
    security: 'Security',
  }

  return (
    <>
      <Helmet>
        <title>Changelog | Portfolio</title>
        <meta
          name="description"
          content="Track the latest updates, improvements, and maintenance activities for this portfolio"
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <PageSection
          className="pt-28 pb-20"
          backgroundClassName="bg-[radial-gradient(120%_150%_at_50%_-20%,#e3edff_0%,#f4f7ff_35%,#f9fbff_60%,#f0f5ff_100%)] dark:bg-[radial-gradient(140%_160%_at_50%_-10%,#0c1424_0%,#0f172a_45%,#020817_100%)]"
          header={{
            eyebrow: 'Updates',
            title: 'Changelog',
            subtitle:
              'Track the latest updates, improvements, and maintenance activities for this portfolio. Built with transparency in mind.',
            className: 'surface-panel p-12 md:p-16 text-center max-w-4xl mx-auto',
          }}
        />

        {/* Changelog Entries */}
        <PageSection
          className="section-padding"
          header={{
            eyebrow: 'History',
            title: 'Recent Changes',
            subtitle:
              'A chronological record of improvements, bug fixes, and new features from git history.',
            className: 'text-center mb-12',
          }}
        >
          {loading ? (
            <div className="text-center text-slate-600 dark:text-slate-300">
              Loading changelog...
            </div>
          ) : error ? (
            <div className="text-center text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : commits.length === 0 ? (
            <div className="text-center text-slate-600 dark:text-slate-300">
              No changelog data available.
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8" role="list">
              {commits.map((commit, index) => {
                const type = getCommitType(commit.subject)
                return (
                  <motion.article
                    key={commit.hash}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="surface-panel p-8 relative"
                    role="listitem"
                    aria-setsize={commits.length}
                    aria-posinset={index + 1}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex items-center gap-4 mb-2 md:mb-0">
                        <code className="text-sm font-mono text-primary-600 dark:text-primary-400">
                          {commit.hash.slice(0, 7)}
                        </code>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[type]}`}
                        >
                          {typeLabels[type]}
                        </span>
                      </div>
                      <time
                        dateTime={commit.date}
                        className="text-sm text-slate-500 dark:text-slate-400"
                      >
                        {new Date(commit.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {commit.subject}
                    </h3>
                    {commit.body && (
                      <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                        {commit.body}
                      </p>
                    )}
                  </motion.article>
                )
              })}
            </div>
          )}
        </PageSection>
      </div>
    </>
  )
}

export default Changelog
