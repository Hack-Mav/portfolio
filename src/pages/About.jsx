import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { HiDownload, HiCode, HiBriefcase, HiAcademicCap } from 'react-icons/hi'

const skills = [
  { title: 'ReactJS', description: 'Front-End Development', icon: '⚛️' },
  { title: 'Golang', description: 'Back-End Development', icon: '🐹' },
  { title: 'MongoDB', description: 'Database Management', icon: '🍃' },
  { title: 'JavaScript', description: 'Programming Language', icon: '🟨' },
  { title: 'Node.js', description: 'Runtime Environment', icon: '🟢' },
  { title: 'Docker', description: 'Containerization', icon: '🐳' },
]

const experiences = [
  {
    title: 'Full-Stack Developer',
    company: 'Flyhigh EduTech Solutions',
    date: 'May 2023 – Dec 2024',
    location: 'Noida, India',
    duties: [
      'Developed end-to-end features using ReactJS and Golang',
      'Managed MySQL and MongoDB databases, optimizing queries',
      'Configured and deployed applications on Google Cloud Platform (GCP)',
    ],
  },
  {
    title: 'Software Development Intern',
    company: 'Gao Tek Inc.',
    date: 'Jan 2023 – Apr 2023',
    location: 'Bangalore, India',
    duties: [
      'Researched requirements and integrated APIs with existing codebases',
      'Collaborated with senior developers to debug and enhance libraries',
    ],
  },
]

const achievements = [
  {
    title: 'GATE 2022',
    description: 'Secured 7384th Rank among 126,979 candidates',
    icon: '🏆',
  },
  {
    title: 'HackerRank Badges',
    description: 'Earned 7 badges, including 4 4-star badges',
    icon: '⭐',
  },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | Portfolio</title>
        <meta
          name="description"
          content="Learn about my journey as a full-stack developer, skills, and professional experience"
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                About Me
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Full-Stack Developer | Problem Solver | Innovator
              </p>
              <a
                href="/asserts/Test_Full_Stack_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                <HiDownload className="w-5 h-5 mr-2" />
                Download Resume
              </a>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                My Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                To develop efficient and scalable applications that solve
                real-world problems while leveraging cutting-edge technologies.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I aim to bridge the gap between innovative ideas and technical
                implementation by creating solutions that are both robust and
                user-friendly.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="section-padding bg-gray-100 dark:bg-gray-800">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <HiCode className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Technical Skills
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{skill.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {skill.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {skill.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="section-padding">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <HiBriefcase className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Professional Experience
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="card"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {exp.title}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 md:mt-0">
                      <p>{exp.date}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.duties.map((duty, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary-600 dark:text-primary-400 mr-2 mt-1">
                          •
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {duty}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="section-padding bg-gray-100 dark:bg-gray-800">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <HiAcademicCap className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Achievements
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="card text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {achievement.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="section-padding">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Let's Connect
              </h2>
              <div className="card">
                <div className="space-y-4 text-left">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 dark:text-white w-20">
                      Phone:
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      +91-9589883958
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 dark:text-white w-20">
                      Email:
                    </span>
                    <a
                      href="mailto:parthiv05022000@gmail.com"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      parthiv05022000@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 dark:text-white w-20">
                      LinkedIn:
                    </span>
                    <a
                      href="https://www.linkedin.com/in/parthiv-rawat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      linkedin.com/in/parthiv-rawat
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 dark:text-white w-20">
                      GitHub:
                    </span>
                    <a
                      href="https://github.com/Hack-Mav"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      github.com/Hack-Mav
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
