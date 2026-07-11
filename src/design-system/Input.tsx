import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
  type InputHTMLAttributes,
} from 'react'
import { cn } from '@/utils/cn'

/* -------------------------------------------------------------------------- */
/* Input                                                                      */
/* -------------------------------------------------------------------------- */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'block w-full px-4 py-2 rounded-md border shadow-sm',
        'bg-white dark:bg-gray-800 text-slate-900 dark:text-white',
        'border-gray-300 dark:border-gray-600',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        'transition-colors duration-200',
        error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

/* -------------------------------------------------------------------------- */
/* TextArea                                                                   */
/* -------------------------------------------------------------------------- */

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'block w-full px-4 py-2 rounded-md border shadow-sm',
        'bg-white dark:bg-gray-800 text-slate-900 dark:text-white',
        'border-gray-300 dark:border-gray-600',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        'transition-colors duration-200',
        error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
        className
      )}
      {...props}
    />
  )
)
TextArea.displayName = 'TextArea'

/* -------------------------------------------------------------------------- */
/* FormField                                                                  */
/* -------------------------------------------------------------------------- */

export interface FormFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
  'value' | 'onChange' | 'onBlur' | 'type'
> {
  label: string
  name: string
  type?: string
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  helpText?: string
  tooltip?: string
  textarea?: boolean
  rows?: number
  required?: boolean
  className?: string
}

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(
  (
    {
      label,
      name,
      type = 'text',
      value,
      onChange,
      onBlur,
      error,
      helpText,
      tooltip,
      textarea = false,
      rows = 4,
      required = false,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const id = props.id ?? `${name}-${generatedId}`
    const errorId = `${id}-error`
    const helpId = `${id}-help`
    const tooltipId = tooltip ? 'contact-tooltip' : undefined

    const describedBy =
      [error ? errorId : null, helpText ? helpId : null, tooltipId]
        .filter(Boolean)
        .join(' ') || undefined

    const fieldProps = {
      id,
      name,
      value,
      onChange,
      onBlur,
      required,
      'aria-required': required,
      'aria-invalid': error ? ('true' as const) : ('false' as const),
      'aria-describedby': describedBy,
      placeholder: props.placeholder,
      className: 'mt-1',
      'data-tooltip-id': tooltipId,
      'data-tooltip-content': tooltip,
      ...props,
    }

    return (
      <div className={cn('space-y-1', className)}>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {textarea ? (
          <TextArea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            error={!!error}
            {...fieldProps}
          />
        ) : (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            error={!!error}
            {...fieldProps}
          />
        )}

        {error && (
          <p
            id={errorId}
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {helpText && (
          <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)
FormField.displayName = 'FormField'
