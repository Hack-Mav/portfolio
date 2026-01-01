import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiPaperAirplane,
} from 'react-icons/hi'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Basic validation
    if (!formData.email.includes('@')) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Form Submitted:', formData)
      setSubmitStatus({
        type: 'success',
        message: "Thank you for reaching out! I'll get back to you soon.",
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again.',
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

      <div className="min-h-screen section-padding">
        <div className="container-max">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              I'd love to hear from you. Whether you have a project in mind,
              want to collaborate, or just want to say hello, feel free to reach
              out.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <FormInput
                    label="Subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />

                  <FormTextArea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                  />

                  {submitStatus && (
                    <div
                      className={`p-4 rounded-lg ${
                        submitStatus.type === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <HiPaperAirplane className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div className="card">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <ContactItem
                    icon={<HiPhone className="w-6 h-6" />}
                    title="Phone"
                    content="+91 9589883958"
                    href="tel:+919589883958"
                  />

                  <ContactItem
                    icon={<HiMail className="w-6 h-6" />}
                    title="Email"
                    content="parthiv05022000@gmail.com"
                    href="mailto:parthiv05022000@gmail.com"
                  />

                  <ContactItem
                    icon={<HiLocationMarker className="w-6 h-6" />}
                    title="Location"
                    content="India"
                  />
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Let's Connect
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Follow me on social media or check out my work on these
                  platforms:
                </p>

                <div className="flex space-x-4">
                  <SocialLink
                    href="https://www.linkedin.com/in/parthiv-rawat"
                    label="LinkedIn"
                    className="bg-blue-600 hover:bg-blue-700"
                  />
                  <SocialLink
                    href="https://github.com/Hack-Mav"
                    label="GitHub"
                    className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
                  />
                </div>
              </div>

              <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-2">
                  Quick Response
                </h3>
                <p className="text-primary-700 dark:text-primary-300 text-sm">
                  I typically respond to messages within 24 hours. For urgent
                  matters, feel free to call or send a direct message on
                  LinkedIn.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

const FormInput = ({ label, className = '', ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <input
      className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${className}`}
      {...props}
    />
  </div>
)

const FormTextArea = ({ label, className = '', ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <textarea
      className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${className}`}
      {...props}
    />
  </div>
)

const ContactItem = ({ icon, title, content, href }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
      {icon}
    </div>
    <div>
      <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      {href ? (
        <a
          href={href}
          className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          {content}
        </a>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">{content}</p>
      )}
    </div>
  </div>
)

const SocialLink = ({ href, label, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${className}`}
  >
    {label}
  </a>
)
