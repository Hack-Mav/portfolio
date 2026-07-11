import { memo } from 'react'
import { HiExternalLink, HiCode, HiStar, HiEye } from 'react-icons/hi'
import { formatRelativeTime } from '@/utils/formatRelativeTime'
import { Tooltip } from 'react-tooltip'
import { cn } from '@/utils/cn'
import { FadeIn, Badge } from '@/design-system'

/**
 * Represents a GitHub repository with its relevant properties
 */
export interface GitHubRepository {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string | null
  updated_at: string
  homepage?: string | null
}

/**
 * Props for the ProjectCard component
 */
interface ProjectCardProps {
  project: GitHubRepository
  index?: number
}

// Language colors for the language indicator
const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  HTML: 'bg-orange-500',
  CSS: 'bg-blue-600',
  Python: 'bg-blue-700',
  Java: 'bg-red-600',
  'C++': 'bg-pink-600',
  'C#': 'bg-purple-600',
  Ruby: 'bg-red-500',
  PHP: 'bg-purple-400',
  Go: 'bg-cyan-500',
  Rust: 'bg-orange-600',
  Swift: 'bg-orange-400',
  Kotlin: 'bg-purple-500',
  Dart: 'bg-blue-400',
}

/**
 * A card component that displays information about a GitHub repository
 */
const ProjectCard = ({ project, index = 0 }: ProjectCardProps): JSX.Element => {
  const lastUpdated = formatRelativeTime(project.updated_at)
  const tooltipId = `project-tooltip-${project.name.replace(/[^a-zA-Z0-9]/g, '-')}-${index}`

  const {
    name,
    description,
    html_url,
    homepage,
    stargazers_count = 0,
    forks_count = 0,
    watchers_count = 0,
    language,
  } = project

  const displayName =
    name
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Unnamed Project'
  const displayDescription = description || 'No description available'

  return (
    <FadeIn direction="up" delay={index * 60} duration={500} className="h-full">
      <article className="group relative h-full transform bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/60 dark:border-slate-800/70 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
              {displayName}
            </h3>
            <div className="flex space-x-2">
              {homepage && (
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-tooltip-id={tooltipId}
                  data-tooltip-content="View live demo"
                  className="p-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-110 active:scale-95"
                  aria-label="View live demo"
                >
                  <HiExternalLink className="h-4 w-4" />
                </a>
              )}
              <a
                href={html_url}
                target="_blank"
                rel="noopener noreferrer"
                data-tooltip-id={tooltipId}
                data-tooltip-content="View source code on GitHub"
                className="p-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="View source code"
              >
                <HiCode className="h-4 w-4" />
              </a>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300">
            {displayDescription}
          </p>

          <div className="pt-2 mt-4 border-t border-gray-100 dark:border-slate-800">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              {language && (
                <Badge className="cursor-default hover:scale-105 transition-transform duration-200">
                  <span
                    className={cn(
                      'w-2.5 h-2.5 rounded-full mr-1.5',
                      languageColors[language] || 'bg-gray-400'
                    )}
                  />
                  {language}
                </Badge>
              )}
              <Badge className="cursor-default hover:scale-105 transition-transform duration-200">
                <HiStar className="h-3.5 w-3.5 mr-1 text-amber-400" />
                <span>{stargazers_count.toLocaleString()}</span>
              </Badge>
              <Badge className="cursor-default hover:scale-105 transition-transform duration-200">
                <HiEye className="h-3.5 w-3.5 mr-1 text-purple-400" />
                <span>{watchers_count.toLocaleString()}</span>
              </Badge>
              <Badge className="cursor-default hover:scale-105 transition-transform duration-200">
                <HiCode className="h-3.5 w-3.5 mr-1 text-blue-400 transform rotate-90" />
                <span>{forks_count.toLocaleString()}</span>
              </Badge>
            </div>

            <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
              Updated {lastUpdated}
            </div>
          </div>
        </div>

        <Tooltip
          id={tooltipId}
          place="top"
          className="z-50"
          globalCloseEvents={{ escape: true }}
        />
      </article>
    </FadeIn>
  )
}

// Custom comparison function for React.memo
const arePropsEqual = (
  prevProps: ProjectCardProps,
  nextProps: ProjectCardProps
) => {
  // Only re-render if the project data or index has changed
  return (
    prevProps.index === nextProps.index &&
    prevProps.project.name === nextProps.project.name &&
    prevProps.project.description === nextProps.project.description &&
    prevProps.project.html_url === nextProps.project.html_url &&
    prevProps.project.homepage === nextProps.project.homepage &&
    prevProps.project.stargazers_count === nextProps.project.stargazers_count &&
    prevProps.project.forks_count === nextProps.project.forks_count &&
    prevProps.project.watchers_count === nextProps.project.watchers_count &&
    prevProps.project.language === nextProps.project.language &&
    prevProps.project.updated_at === nextProps.project.updated_at
  )
}

export default memo(ProjectCard, arePropsEqual)
