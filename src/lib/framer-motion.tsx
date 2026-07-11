import { forwardRef, useMemo, type ReactNode, type Ref } from 'react'
import { cn } from '@/utils/cn'
import { FadeIn, type FadeInProps } from '@/design-system'

export type Variants = Record<string, any>

interface MotionProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode
  variants?: Variants | ((custom: any) => Variants)
  initial?: string | Record<string, any>
  animate?: string | Record<string, any>
  whileInView?: string | Record<string, any>
  whileHover?: Record<string, any>
  whileTap?: Record<string, any>
  transition?: Record<string, any> | number
  viewport?: { once?: boolean; amount?: number | string }
  custom?: any
  exit?: string | Record<string, any>
  className?: string
  style?: React.CSSProperties
  as?: keyof JSX.IntrinsicElements
}

function resolveVariants(
  variants: Variants | ((custom: any) => Variants) | undefined,
  custom: any
): Variants | undefined {
  if (typeof variants === 'function') {
    return variants(custom)
  }
  return variants
}

function resolveState(
  state: string | Record<string, any> | undefined,
  variants: Variants | undefined
): Record<string, any> | undefined {
  if (state === undefined) return undefined
  if (typeof state === 'string') {
    return variants?.[state]
  }
  return state
}

function directionFromState(
  state: Record<string, any> | undefined
): FadeInProps['direction'] {
  if (!state) return 'up'
  if (state.y !== undefined) {
    return state.y > 0 ? 'up' : state.y < 0 ? 'down' : 'up'
  }
  if (state.x !== undefined) {
    return state.x > 0 ? 'left' : state.x < 0 ? 'right' : 'up'
  }
  if (state.scale !== undefined) {
    return 'scale'
  }
  return 'up'
}

function getTransition(
  transition: Record<string, any> | number | undefined,
  variants: Variants | undefined,
  animate: Record<string, any> | undefined
): Record<string, any> {
  if (transition !== undefined) {
    if (typeof transition === 'number') {
      return { duration: transition }
    }
    return transition
  }
  if (animate && typeof animate === 'object' && animate.transition) {
    return animate.transition
  }
  if (variants?.visible && variants.visible.transition) {
    return variants.visible.transition
  }
  return {}
}

function scaleClass(
  value: number,
  prefix: 'hover' | 'active'
): string | undefined {
  if (value === 1 || value === undefined) return undefined
  // Map common tailwind scale utilities; otherwise use arbitrary value.
  if (value === 1.1) return `${prefix}:scale-110`
  if (value === 1.05) return `${prefix}:scale-105`
  if (value === 0.95) return `${prefix}:scale-95`
  if (value === 0.9) return `${prefix}:scale-90`
  if (value === 0.75) return `${prefix}:scale-75`
  return `${prefix}:scale-[${value}]`
}

function hoverTapClasses(
  whileHover?: Record<string, any>,
  whileTap?: Record<string, any>
): string {
  const classes: string[] = []
  if (whileHover?.scale) {
    const cls = scaleClass(Number(whileHover.scale), 'hover')
    if (cls) classes.push(cls)
  }
  if (whileTap?.scale) {
    const cls = scaleClass(Number(whileTap.scale), 'active')
    if (cls) classes.push(cls)
  }
  return classes.join(' ')
}

function createMotion(tag: keyof JSX.IntrinsicElements) {
  const MotionComponent = forwardRef<HTMLElement, MotionProps>(
    (
      {
        children,
        variants,
        initial,
        animate,
        whileInView,
        whileHover,
        whileTap,
        transition,
        viewport,
        custom,
        exit,
        className,
        style,
        as,
        ...props
      },
      ref
    ) => {
      const resolvedVariants = useMemo(
        () => resolveVariants(variants, custom),
        [variants, custom]
      )

      // Determine the start and end states.
      const start = resolveState(initial, resolvedVariants)
      const end = resolveState(animate ?? whileInView, resolvedVariants)

      // Should this element animate in?
      const shouldAnimate = start !== undefined || end !== undefined
      const initialVisible =
        start === undefined ||
        (typeof start === 'object' && start.opacity === 1)

      const direction = useMemo(() => directionFromState(start), [start])

      const transitionObj = useMemo(
        () => getTransition(transition, resolvedVariants, end),
        [transition, resolvedVariants, end]
      )

      const delayMs = useMemo(() => {
        const delay = transitionObj.delay ?? transitionObj.delayChildren ?? 0
        return typeof delay === 'number' ? delay * 1000 : 0
      }, [transitionObj])

      const durationMs = useMemo(() => {
        const duration = transitionObj.duration
        return typeof duration === 'number' ? duration * 1000 : 500
      }, [transitionObj])

      const hoverTap = hoverTapClasses(whileHover, whileTap)

      const shouldFadeIn = shouldAnimate || whileInView !== undefined

      if (shouldFadeIn) {
        return (
          <FadeIn
            ref={ref as Ref<HTMLElement>}
            as={as ?? tag}
            className={cn(hoverTap, className)}
            style={style}
            direction={direction}
            delay={delayMs}
            duration={durationMs}
            initial={!initialVisible}
            once={viewport?.once ?? true}
            threshold={
              typeof viewport?.amount === 'number' ? viewport.amount : 0.1
            }
            {...(props as any)}
          >
            {children}
          </FadeIn>
        )
      }

      const Component = (as ?? tag) as any
      return (
        <Component
          ref={ref}
          className={cn(hoverTap, className)}
          style={style}
          {...(props as any)}
        >
          {children}
        </Component>
      )
    }
  )

  MotionComponent.displayName = `motion(${tag})`
  return MotionComponent
}

// Build a motion object that supports any intrinsic element.
export const motion = new Proxy<Record<string, React.ComponentType<any>>>(
  {},
  {
    get: (_target, tag: string) => {
      if (typeof tag !== 'string') return undefined
      return createMotion(tag as keyof JSX.IntrinsicElements)
    },
  }
) as any

export function AnimatePresence({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useInView() {
  return true
}
