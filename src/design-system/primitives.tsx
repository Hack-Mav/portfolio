import { forwardRef, useEffect, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { useInView } from '@/hooks/useInView'

/* -------------------------------------------------------------------------- */
/* Container                                                                  */
/* -------------------------------------------------------------------------- */

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('max-w-7xl mx-auto', className)} {...props}>
      {children}
    </div>
  )
)
Container.displayName = 'Container'

/* -------------------------------------------------------------------------- */
/* Surface / Card                                                             */
/* -------------------------------------------------------------------------- */

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  as?: 'div' | 'article' | 'section'
}

export const Surface = forwardRef<HTMLElement, SurfaceProps>(
  ({ children, className, as: Component = 'div', ...props }, ref) => (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn('surface-panel', className)}
      {...props}
    >
      {children}
    </Component>
  )
)
Surface.displayName = 'Surface'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'card',
        'bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-slate-800/70 shadow-lg',
        'transition-all duration-300',
        hover && 'hover:-translate-y-1 hover:shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  variant?: 'default' | 'primary' | 'muted'
  children: ReactNode
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as: Component = 'h2',
      size = 'md',
      variant = 'default',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xl: 'text-4xl md:text-5xl lg:text-6xl font-bold',
      lg: 'text-3xl md:text-4xl font-bold',
      md: 'text-2xl md:text-3xl font-bold',
      sm: 'text-xl font-semibold',
      xs: 'text-lg font-semibold',
    }

    const variantClasses = {
      default: 'text-slate-900 dark:text-white',
      primary: 'text-primary-600 dark:text-primary-300',
      muted: 'text-slate-600 dark:text-slate-300',
    }

    return (
      <Component
        ref={ref}
        className={cn(
          'font-heading tracking-tight',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Heading.displayName = 'Heading'

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div'
  size?: 'sm' | 'base' | 'lg' | 'xl'
  muted?: boolean
  children: ReactNode
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      as: Component = 'p',
      size = 'base',
      muted = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    }

    return (
      <Component
        ref={ref}
        className={cn(
          sizeClasses[size],
          muted
            ? 'text-slate-500 dark:text-slate-400'
            : 'text-slate-600 dark:text-slate-300',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Text.displayName = 'Text'

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export const Eyebrow = forwardRef<HTMLSpanElement, EyebrowProps>(
  ({ children, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-primary-100/70 dark:bg-primary-900/40 px-4 py-1 text-sm font-medium text-primary-700 dark:text-primary-200 uppercase tracking-[0.2em]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
)
Eyebrow.displayName = 'Eyebrow'

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary:
        'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
      ghost:
        'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:text-primary-300 dark:hover:bg-primary-900/20',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2 rounded-full',
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

/* -------------------------------------------------------------------------- */
/* Badge                                                                      */
/* -------------------------------------------------------------------------- */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'default' | 'primary' | 'outline'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default:
        'bg-gray-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300',
      primary: 'bg-primary-500/10 text-primary-600 dark:text-primary-200',
      outline:
        'border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'

/* -------------------------------------------------------------------------- */
/* Spinner / Loading                                                          */
/* -------------------------------------------------------------------------- */

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center p-8', className)}
        {...props}
      >
        <div
          aria-hidden="true"
          className={cn(
            sizeClasses[size],
            'border-2 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin'
          )}
        />
      </div>
    )
  }
)
Spinner.displayName = 'Spinner'

/* -------------------------------------------------------------------------- */
/* FadeIn (CSS-only scroll/mount animation)                                   */
/* -------------------------------------------------------------------------- */

export interface FadeInProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none'
  once?: boolean
  threshold?: number
  rootMargin?: string
  initial?: boolean
}

export const FadeIn = forwardRef<HTMLElement, FadeInProps>(
  (
    {
      children,
      as: Component = 'div',
      className,
      delay = 0,
      duration = 500,
      direction = 'up',
      once = true,
      threshold = 0.1,
      rootMargin = '0px',
      initial = false,
      ...props
    },
    forwardedRef
  ) => {
    const { ref, isInView } = useInView<HTMLElement>({
      threshold,
      rootMargin,
      once,
      initial,
    })

    useEffect(() => {
      if (!forwardedRef) return
      const current = ref.current
      if (typeof forwardedRef === 'function') {
        forwardedRef(current)
      } else {
        forwardedRef.current = current
      }
      return () => {
        if (typeof forwardedRef === 'function') {
          forwardedRef(null)
        } else {
          forwardedRef.current = null
        }
      }
    }, [forwardedRef, ref])

    const directionClasses = {
      up: 'translate-y-4',
      down: '-translate-y-4',
      left: 'translate-x-4',
      right: '-translate-x-4',
      scale: 'scale-95',
      none: '',
    }

    const visible = initial || isInView

    return (
      <Component
        ref={ref as any}
        className={cn(
          'transform transition-[opacity,transform] ease-out',
          visible
            ? 'opacity-100 translate-y-0 translate-x-0 scale-100'
            : `opacity-0 ${directionClasses[direction]}`,
          className
        )}
        style={{
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
        }}
        {...(props as any)}
      >
        {children}
      </Component>
    )
  }
)
FadeIn.displayName = 'FadeIn'

/* -------------------------------------------------------------------------- */
/* Page transition wrapper                                                    */
/* -------------------------------------------------------------------------- */

export interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div
      className={cn(
        'min-h-[calc(100vh-4rem)] w-full opacity-0 animate-fade-in',
        className
      )}
      style={{ animationFillMode: 'forwards' }}
    >
      {children}
    </div>
  )
}
