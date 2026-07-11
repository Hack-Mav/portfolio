import { useState, ChangeEvent, FormEvent, FocusEvent, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiPaperAirplane,
  HiCheckCircle,
  HiExclamationCircle,
} from 'react-icons/hi'
import { Tooltip } from 'react-tooltip'
import { PageSection } from '@components/templates/PageSection'
import LazyImage from '@components/atoms/LazyImage'
import contactImage from '@assets/contact.jpg'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface SubmitStatus {
  type: 'success' | 'error' | null
  message: string
}

interface FormInputProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  required?: boolean
  className?: string
  placeholder?: string
  textarea?: boolean
  tooltip?: string
  error?: string
}

interface ContactItemProps {
  icon: ReactNode
  title: string
  content: string
  href?: string
}

interface SocialLinkProps {
  href: string
  label: string
  className?: string
  children: ReactNode
}

interface FormspreeError {
  field?: string
  message?: string
}

const FORMSPREE_FORM_ID =
  import.meta.env.VITE_FORMSPREE_FORM_ID || 'your-form-id'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FIELD_ORDER: (keyof FormData)[] = ['name', 'email', 'subject', 'message']

const validateField = (name: keyof FormData, value: string): string => {
  const trimmed = value.trim()
  switch (name) {
    case 'name':
      if (!trimmed) return 'Name is required.'
      if (trimmed.length < 2) return 'Name must be at least 2 characters.'
      return ''
    case 'email':
      if (!trimmed) return 'Email is required.'
      if (!EMAIL_REGEX.test(trimmed)) {
        return 'Please enter a valid email address.'
      }
      return ''
    case 'subject':
      if (!trimmed) return 'Subject is required.'
      if (trimmed.length < 3) return 'Subject must be at least 3 characters.'
      if (trimmed.length > 100)
        return 'Subject must be less than 100 characters.'
      return ''
    case 'message':
      if (!trimmed) return 'Message is required.'
      if (trimmed.length < 10) return 'Message must be at least 10 characters.'
      if (trimmed.length > 1000)
        return 'Message must be less than 1000 characters.'
      return ''
    default:
      return ''
  }
}

const validateForm = (data: FormData): Record<keyof FormData, string> => ({
  name: validateField('name', data.name),
  email: validateField('email', data.email),
  subject: validateField('subject', data.subject),
  message: validateField('message', data.message),
})

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<keyof FormData, string>>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name as keyof FormData]: '' }))
  }

  const handleBlur = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setErrors(prev => ({
      ...prev,
      [name as keyof FormData]: validateField(name as keyof FormData, value),
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    const validationErrors = validateForm(formData)
    setErrors(validationErrors)

    if (Object.values(validationErrors).some(Boolean)) {
      setIsSubmitting(false)
      const firstInvalidField = FIELD_ORDER.find(
        field => validationErrors[field]
      )
      if (firstInvalidField) {
        document.getElementById(firstInvalidField)?.focus()
      }
      return
    }

    if (FORMSPREE_FORM_ID === 'your-form-id') {
      setSubmitStatus({
        type: 'error',
        message:
          'Form is not properly configured. Please contact the administrator.',
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(
        `https://formspree.io/f/${FORMSPREE_FORM_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }),
        }
      )

      const data = (await response.json()) as {
        errors?: FormspreeError[]
        error?: string
      }

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: "Thank you for reaching out! I'll get back to you soon.",
        })
        setFormData({ name: '', email: '', subject: '', message: '' })
        setErrors({ name: '', email: '', subject: '', message: '' })
      } else {
        const serverErrors = data?.errors
        if (Array.isArray(serverErrors) && serverErrors.length > 0) {
          const fieldErrors = { name: '', email: '', subject: '', message: '' }
          serverErrors.forEach(err => {
            if (err.field && err.field in fieldErrors) {
              fieldErrors[err.field as keyof FormData] =
                err.message || 'Invalid value'
            }
          })
          setErrors(fieldErrors)
          setSubmitStatus({
            type: 'error',
            message: 'Please correct the highlighted errors and try again.',
          })
        } else {
          throw new Error(data.error || 'Submission failed')
        }
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact | Portfolio</title>
        <meta
          name="description"
          content="Get in touch with me for collaboration opportunities, project inquiries, or just to say hello"
        />
      </Helmet>

      <div className="min-h-screen">
        <PageSection
          className="pt-28 pb-20"
          backgroundClassName="bg-[radial-gradient(120%_160%_at_50%_-20%,#e5edff_0%,#f8fbff_55%,#eef3ff_100%)] dark:bg-[radial-gradient(150%_160%_at_50%_-20%,#070f1f_0%,#0f172a_45%,#010712_100%)]"
          header={{
            eyebrow: "Let's Collaborate",
            title: 'Get In Touch',
            subtitle:
              "I'd love to hear from you. Whether you have a project in mind, want to collaborate, or just want to say hello, feel free to reach out.",
            className: 'surface-panel p-10 md:p-14 text-center mb-16',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="surface-panel p-8 md:p-10"
            >
              <h2 className="text-2xl font-heading text-slate-900 dark:text-white mb-6">
                Send a Message
              </h2>

              {submitStatus && (
                <div
                  role={submitStatus.type === 'success' ? 'status' : 'alert'}
                  aria-live={
                    submitStatus.type === 'success' ? 'polite' : 'assertive'
                  }
                  aria-atomic="true"
                  className={`p-4 mb-6 rounded-xl border ${
                    submitStatus.type === 'success'
                      ? 'border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-200'
                      : 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {submitStatus.type === 'success' ? (
                      <>
                        <HiCheckCircle className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium">Success:</span>
                      </>
                    ) : (
                      <>
                        <HiExclamationCircle
                          className="w-5 h-5"
                          aria-hidden="true"
                        />
                        <span className="font-medium">Error:</span>
                      </>
                    )}
                    {submitStatus.message}
                  </span>
                </div>
              )}

              <form noValidate onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    required
                    placeholder="Your name"
                    tooltip="Enter your full name"
                  />
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    required
                    placeholder="your.email@example.com"
                    tooltip="Enter your email address for response"
                  />
                </div>
                <FormInput
                  label="Subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.subject}
                  required
                  placeholder="Subject of your message"
                  tooltip="Brief description of your message topic"
                />
                <FormTextArea
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.message}
                  required
                  placeholder="Your message here..."
                  tooltip="Detailed message or inquiry"
                />
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-tooltip-id="contact-tooltip"
                    data-tooltip-content="Send your message to me"
                    aria-describedby="contact-tooltip"
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <span>Send Message</span>
                        <HiPaperAirplane className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8 relative"
            >
              <div className="surface-panel p-8">
                <LazyImage
                  src={contactImage}
                  alt="Contact"
                  srcSet={`${contactImage} 400w, ${contactImage} 800w`}
                  sizes="(max-width: 768px) 100vw, 400px"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={400}
                  className="rounded-xl mb-6 overflow-hidden"
                  imgClassName="w-full h-auto object-contain"
                />
                <h2 className="text-2xl font-heading text-slate-900 dark:text-white mb-6">
                  Contact Information
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-8">
                  Feel free to reach out to me through any of these channels.
                  I'll get back to you as soon as possible.
                </p>

                <div className="space-y-6">
                  <ContactItem
                    icon={
                      <HiMail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    }
                    title="Email"
                    content="parthiv05022000@gmail.com"
                    href="mailto:parthiv05022000@gmail.com"
                  />
                  <ContactItem
                    icon={
                      <HiPhone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    }
                    title="Phone"
                    content="+91 95898 83958"
                    href="tel:+919589883958"
                  />
                  <ContactItem
                    icon={
                      <HiLocationMarker className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    }
                    title="Location"
                    content="Noida, India"
                  />
                </div>
              </div>

              <div className="surface-panel p-8">
                <h3 className="text-lg font-heading text-slate-900 dark:text-white mb-4">
                  Follow Me
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
                  Stay connected for project launches, write-ups, and
                  open-source updates.
                </p>
                <div className="flex flex-wrap gap-4">
                  <SocialLink
                    href="https://github.com/parthivrawat"
                    label="GitHub"
                    className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.027 2.747-1.027.546 1.377.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </SocialLink>
                  <SocialLink
                    href="https://linkedin.com/in/parthiv-rawat"
                    label="LinkedIn"
                    className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </SocialLink>
                </div>
              </div>
            </motion.div>
          </div>
        </PageSection>
      </div>

      <Tooltip
        id="contact-tooltip"
        place="top"
        className="z-50"
        globalCloseEvents={{ escape: true }}
      />
    </>
  )
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  required = false,
  className = '',
  placeholder = '',
  textarea = false,
  tooltip = '',
  error = '',
}) => {
  const errorId = `${name}-error`
  const tooltipId = tooltip ? 'contact-tooltip' : undefined
  const describedBy =
    [error ? errorId : null, tooltipId].filter(Boolean).join(' ') || undefined
  const inputClass = `block w-full px-4 py-2 mt-1 text-gray-900 bg-white border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${
    error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300'
  }`

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="mt-1">
        {textarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            aria-required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            placeholder={placeholder}
            rows={4}
            data-tooltip-id={tooltipId}
            data-tooltip-content={tooltip}
            className={inputClass}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            aria-required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            placeholder={placeholder}
            data-tooltip-id={tooltipId}
            data-tooltip-content={tooltip}
            className={inputClass}
          />
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

const FormTextArea: React.FC<Omit<FormInputProps, 'type'>> = props => (
  <FormInput {...props} textarea />
)

const ContactItem: React.FC<ContactItemProps> = ({
  icon,
  title,
  content,
  href,
}) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 pt-1">{icon}</div>
    <div className="ml-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      {href ? (
        <a
          href={href}
          className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
        >
          {content}
        </a>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">{content}</p>
      )}
    </div>
  </div>
)

const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  label,
  className = '',
  children,
}) => (
  <a
    href={href}
    aria-label={label}
    aria-describedby="contact-tooltip"
    target="_blank"
    rel="noopener noreferrer"
    data-tooltip-id="contact-tooltip"
    data-tooltip-content={`Visit my ${label} profile`}
    className={`transition-colors ${className}`}
  >
    {children}
  </a>
)

export default Contact
