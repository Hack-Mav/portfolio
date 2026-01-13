import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiDownload, HiCode, HiBriefcase, HiAcademicCap } from 'react-icons/hi';
import React from 'react';

interface Skill {
  title: string;
  description: string;
  icon: string;
}

interface Experience {
  title: string;
  company: string;
  date: string;
  location: string;
  duties: string[];
}

interface Achievement {
  title: string;
  description: string;
  icon: string;
}

const skills: Skill[] = [
  { title: 'Golang', description: 'Concurrency-first backend services', icon: '🐹' },
  { title: 'ReactJS', description: 'Micro frontends & module federation', icon: '⚛️' },
  { title: 'GraphQL & REST', description: 'High-performance API design', icon: '🔗' },
  { title: 'MySQL & MongoDB', description: 'Query tuning & data integrity', icon: '🗄️' },
  { title: 'Google Cloud Platform', description: 'App Engine, observability, scaling', icon: '☁️' },
  { title: 'AI Tooling', description: 'LLM-powered developer velocity', icon: '🤖' },
];

const experiences: Experience[] = [
  {
    title: 'Full-Stack Developer',
    company: 'MethodWorks Pvt. Ltd.',
    date: 'May 2023 – Dec 2025',
    location: 'Noida, India',
    duties: [
      'Delivered Go + React enterprise modules with decentralized identity workflows',
      'Implemented secure REST APIs, cryptography practices, and module-federated frontends',
      'Maintained GCP App Engine deployments with reliability, monitoring, and RBAC admin consoles',
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
];

const achievements: Achievement[] = [
  {
    title: 'Quantum Computing Scholar',
    description: 'Completed The Coding School fellowship exploring quantum circuits and algorithms.',
    icon: '🧠',
  },
  {
    title: 'Open Source Mentor',
    description: 'Guided developers on Golang, CI/CD, and scalable cloud patterns through community cohorts.',
    icon: '🤝',
  },
];

const About: React.FC = () => {
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
        <section className="relative overflow-hidden pt-28 pb-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_150%_at_50%_-20%,#e3edff_0%,#f4f7ff_35%,#f9fbff_60%,#f0f5ff_100%)] dark:bg-[radial-gradient(140%_160%_at_50%_-10%,#0c1424_0%,#0f172a_45%,#020817_100%)]" />
          <div className="absolute right-[-15%] top-[-10%] h-72 w-72 rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-500/10" />
          <div className="absolute left-[-15%] bottom-[-20%] h-80 w-80 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-900/40" />

          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-panel p-12 md:p-16 text-center max-w-4xl mx-auto"
            >
              <span className="eyebrow mb-4 mx-auto">Behind the Code</span>
              <h1 className="text-4xl md:text-5xl font-heading text-slate-900 dark:text-white mb-6">
                About Me
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10">
                Full-Stack Developer | Problem Solver | Innovator. I turn complex problems into seamless digital experiences.
              </p>
              <a
                href="/asserts/Full_Stack_Resume.pdf"
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
              className="surface-panel max-w-4xl mx-auto text-center p-12"
            >
              <span className="eyebrow mb-4 mx-auto">Mission</span>
              <h2 className="text-3xl md:text-4xl font-heading text-slate-900 dark:text-white mb-6">
                My Mission
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-0">
                To create elegant and efficient solutions that solve real-world problems through clean code, inclusive design, and collaborative teamwork.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="section-padding bg-white/70 dark:bg-slate-950/50">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="eyebrow mb-4 mx-auto">Toolkit</span>
              <h2 className="text-3xl md:text-4xl font-heading text-slate-900 dark:text-white mb-4">
                My Skills
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Technologies and toolchains I bring into each engagement to ship reliable, high-performing products.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="surface-panel p-6 text-left"
                >
                  <div className="text-4xl mb-4">{skill.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {skill.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
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
              <span className="eyebrow mb-4 mx-auto">Experience</span>
              <h2 className="text-3xl md:text-4xl font-heading text-slate-900 dark:text-white mb-4">
                Work Experience
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Highlights from an ambitious journey spanning growth-stage SaaS, education technology, and developer tooling.
              </p>
            </motion.div>

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={`${exp.company}-${index}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="surface-panel flex flex-col md:flex-row gap-8 p-8"
                >
                  <div className="md:w-1/3">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-300">
                      {exp.company}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {exp.date} | {exp.location}
                    </p>
                  </div>
                  <div className="md:w-2/3">
                    <ul className="space-y-2">
                      {exp.duties.map((duty, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary-500 mr-2 mt-1">•</span>
                          <span className="text-slate-700 dark:text-slate-300">
                            {duty}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="section-padding bg-white/70 dark:bg-slate-950/50">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="eyebrow mb-4 mx-auto">Milestones</span>
              <h2 className="text-3xl md:text-4xl font-heading text-slate-900 dark:text-white mb-4">
                Achievements
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Recognitions that reflect dedication to continuous learning and impact.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="surface-panel p-8 text-left"
                >
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">{achievement.icon}</span>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {achievement.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {achievement.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
