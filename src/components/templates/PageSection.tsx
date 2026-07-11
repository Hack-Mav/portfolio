import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Surface, Heading, Text, Eyebrow, FadeIn } from '@/design-system'

export interface PageSectionHeaderProps {
  /** Optional eyebrow text shown above the title. */
  eyebrow?: string
  /** Section title. Can be a string or custom element. */
  title: ReactNode
  /** Optional subtitle or description. */
  subtitle?: ReactNode
  /** Additional classes for the header container. */
  className?: string
}

export interface PageSectionProps {
  /** Optional id for the section element. */
  id?: string
  /** Additional classes for the section element. */
  className?: string
  /** Classes for the absolute background element. */
  backgroundClassName?: string
  /** Decorative elements (floating blobs, etc.) rendered before the container. */
  decorations?: ReactNode
  /** Optional header to render inside the container. */
  header?: PageSectionHeaderProps
  /** Section content. */
  children?: ReactNode
}

/**
 * Reusable page section wrapper.
 *
 * Provides a consistent outer `<section>`, optional background,
 * decorative elements, and an animated header block.
 */
export const PageSection: React.FC<PageSectionProps> = ({
  id,
  className,
  backgroundClassName,
  decorations,
  header,
  children,
}) => {
  return (
    <section id={id} className={cn('relative overflow-hidden', className)}>
      {backgroundClassName && (
        <div className={cn('absolute inset-0 -z-10', backgroundClassName)} />
      )}
      {decorations}
      <div className="container-max">
        {header && (
          <FadeIn className="mb-12" initial>
            <Surface className={header.className ?? 'p-10 md:p-14 text-center'}>
              {header.eyebrow && (
                <Eyebrow className="mb-4 mx-auto">{header.eyebrow}</Eyebrow>
              )}
              {typeof header.title === 'string' ? (
                <Heading as="h2" size="lg" className="mb-4">
                  {header.title}
                </Heading>
              ) : (
                header.title
              )}
              {header.subtitle && (
                <Text size="lg" muted className="max-w-2xl mx-auto">
                  {header.subtitle}
                </Text>
              )}
            </Surface>
          </FadeIn>
        )}
        {children}
      </div>
    </section>
  )
}

export default PageSection
