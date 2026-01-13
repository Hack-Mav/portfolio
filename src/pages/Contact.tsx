import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiPaperAirplane,
} from 'react-icons/hi';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface SubmitStatus {
  type: 'success' | 'error' | null;
  message: string;
}

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
  textarea?: boolean;
}

interface ContactItemProps {
  icon: ReactNode;
  title: string;
  content: string;
  href?: string;
}

interface SocialLinkProps {
  href: string;
  label: string;
  className?: string;
  children: ReactNode;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Basic validation
    if (!formData.email.includes('@')) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Form Submitted:', formData);
      setSubmitStatus({
        type: 'success',
        message: "Thank you for reaching out! I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | Portfolio</title>
        <meta
          name="description"
          content="Get in touch with me for collaboration opportunities, project inquiries, or just to say hello"
        />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        <section className="relative pt-28 pb-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_160%_at_50%_-20%,#e5edff_0%,#f8fbff_55%,#eef3ff_100%)] dark:bg-[radial-gradient(150%_160%_at_50%_-20%,#070f1f_0%,#0f172a_45%,#010712_100%)]" />
          <div className="absolute inset-x-0 top-10 -z-10 flex justify-center">
            <div className="h-64 w-[60vw] rounded-full bg-primary-500/10 blur-3xl dark:bg-primary-900/20" />
          </div>

          <div className="container-max">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-panel text-center p-10 md:p-14 mb-16"
            >
              <span className="eyebrow mb-4 mx-auto">Let's Collaborate</span>
              <h1 className="text-4xl md:text-5xl font-heading text-slate-900 dark:text-white mb-4">
                Get In Touch
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                I'd love to hear from you. Whether you have a project in mind, want to collaborate, or just want to say hello, feel free to reach out.
              </p>
            </motion.div>

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
                    className={`p-4 mb-6 rounded-xl border ${
                      submitStatus.type === 'success'
                        ? 'border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-200'
                        : 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-200'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                    <FormInput
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <FormInput
                    label="Subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Subject of your message"
                  />
                  <FormTextArea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message here..."
                    className=""
                  />
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
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
                className="space-y-8"
              >
                <div className="surface-panel p-8">
                  <h2 className="text-2xl font-heading text-slate-900 dark:text-white mb-6">
                    Contact Information
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-8">
                    Feel free to reach out to me through any of these channels. I'll get back to you as soon as possible.
                  </p>

                  <div className="space-y-6">
                    <ContactItem
                      icon={<HiMail className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
                      title="Email"
                      content="parthiv05022000@gmail.com"
                      href="mailto:parthiv05022000@gmail.com"
                    />
                    <ContactItem
                      icon={<HiPhone className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
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
                    Stay connected for project launches, write-ups, and open-source updates.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <SocialLink
                      href="https://github.com/Hack-Mav"
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
                    <SocialLink
                      href="https://auth.geeksforgeeks.org/user/parthiv05022000"
                      label="GeeksforGeeks"
                      className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C6.486 2 2 6.486 2 12c0 4.362 2.791 8.07 6.689 9.43.489.09.667-.211.667-.47 0-.232-.009-.849-.014-1.665-2.722.591-3.296-1.313-3.296-1.313-.446-1.139-1.09-1.443-1.09-1.443-.891-.61.068-.598.068-.598 1.569.11 2.396 1.611 2.396 1.611.876 1.5 2.3 1.067 2.862.816.089-.635.342-1.067.623-1.313-2.172-.247-4.456-1.086-4.456-4.832 0-1.067.381-1.94 1.008-2.624-.1-.248-.44-1.248.096-2.6 0 0 .83-.266 2.723.998a9.45 9.45 0 012.478-.333 9.45 9.45 0 012.478.333c1.894-1.264 2.723-.998 2.723-.998.538 1.352.197 2.352.097 2.6.628.684 1.007 1.557 1.007 2.624 0 3.756-2.288 4.582-4.467 4.828.35.3.662.897.662 1.81 0 1.31-.012 2.367-.012 2.692 0 .26.178.564.672.468C19.21 20.066 22 16.36 22 12c0-5.514-4.486-10-10-10z" />
                      </svg>
                    </SocialLink>
                    <SocialLink
                      href="https://leetcode.com/Parthiv_Rawat"
                      label="LeetCode"
                      className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.4 8.7l-5.7-5.7c-.5-.5-1.2-.8-1.9-.8-.7 0-1.4.3-1.9.8l-7 7c-1 1-1.5 2.3-1.5 3.7s.5 2.7 1.5 3.7l5.7 5.7c.5.5 1.2.8 1.9.8.7 0 1.4-.3 1.9-.8l7-7c1-1 1.5-2.3 1.5-3.7s-.5-2.7-1.5-3.7zm-2 5.6l-7 7c-.3.3-.7.3-1 0l-5.7-5.7c-.6-.6-.9-1.4-.9-2.2 0-.8.3-1.6.9-2.2l7-7c.3-.3.7-.3 1 0l5.7 5.7c.6.6.9 1.4.9 2.2 0 .8-.3 1.6-.9 2.2z" />
                      </svg>
                    </SocialLink>
                    <SocialLink
                      href="https://www.hackerrank.com/parthiv05022000"
                      label="HackerRank"
                      className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.18L5 7.5v9l7 4.32 7-4.32v-9l-7-3.32zM9.6 9.2h1.8v5.6H9.6V9.2zm5 0h1.8v5.6H14.6V9.2z" />
                      </svg>
                    </SocialLink>
                    <SocialLink
                      href="https://www.codechef.com/users/parthivrawat"
                      label="CodeChef"
                      className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.8 4.2c-.4-.7-1.2-1.2-2-1.2H8.2c-.8 0-1.5.5-1.9 1.2L4 8v3c0 1.7 1.3 3 3 3h1l-.8 3h2.1l.8-3h3.8l.8 3h2.1l-.8-3h1c1.7 0 3-1.3 3-3V8l-1.2-3.8zm-1.5 6.8c0 .6-.4 1-1 1H8.7c-.6 0-1-.4-1-1V8.5l.8-2.5h6.2l.8 2.5v2.5z" />
                      </svg>
                    </SocialLink>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  className = '',
  placeholder = '',
  textarea = false,
}) => {
  const inputClass = `block w-full px-4 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${className}`;

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        {textarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            rows={4}
            className={inputClass}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={inputClass}
          />
        )}
      </div>
    </div>
  );
};

const FormTextArea: React.FC<Omit<FormInputProps, 'type'>> = (props) => (
  <FormInput {...props} textarea />
);

const ContactItem: React.FC<ContactItemProps> = ({ icon, title, content, href }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 pt-1">{icon}</div>
    <div className="ml-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
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
);

const SocialLink: React.FC<SocialLinkProps> = ({ href, label, className = '', children }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className={`transition-colors ${className}`}
  >
    {children}
  </a>
);

export default Contact;
