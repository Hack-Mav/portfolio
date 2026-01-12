import { useMemo, ReactElement } from 'react';
import { motion, Variants } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiArrowRight, HiDownload } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import ProjectCard from '@components/organisms/ProjectCard';
import LoadingSpinner from '@components/atoms/LoadingSpinner';
import { useGitHubRepositories } from '@/hooks/useGitHub';
import type { Repository } from '@/types/github';

// Extend the Variants type to include our specific structure
type MotionVariants = Variants & {
  hidden: {
    opacity: number;
    y?: number;
    [key: string]: unknown; // Add index signature
  };
  visible: {
    opacity: number;
    y?: number;
    transition?: {
      staggerChildren?: number;
      [key: string]: unknown; // Add index signature
    };
    [key: string]: unknown; // Add index signature
  };
};

// Props for the Home component
interface HomeProps {
  // Add any props if needed in the future
}

// Type for the featured projects section
interface FeaturedProjectsSectionProps {
  projects: Repository[];
}

// Type for the hero section
interface HeroSectionProps {
  onViewWork: () => void;
}

// Animation variants for the container
const containerVariants: MotionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for individual items
const itemVariants: MotionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const highlightStats = [
  { label: 'Years Experience', value: '3+', description: 'Building resilient web platforms end-to-end.' },
  { label: 'Projects Delivered', value: '20+', description: 'From internal tools to consumer-facing products.' },
  { label: 'Core Stack', value: 'TS · React · Go', description: 'Tightly crafted with cloud-native delivery.' },
];

const Home: React.FC<HomeProps> = (): ReactElement => {
  const { 
    repositories, 
    loading, 
    error, 
    refetch, 
    isInitialLoading,
    isRefreshing 
  } = useGitHubRepositories();

  // Get top 6 projects by stars
  const featuredProjects: Repository[] = useMemo(() => {
    if (!repositories) return [];
    return [...repositories]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 6);
  }, [repositories]);

  const handleRetry = (): void => {
    refetch();
  };
  
  // Handle loading state
  if (isInitialLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error.status ? `Error (${error.status}): ` : 'Error: '}
            {error.message || 'Failed to load repositories'}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  const handleViewWork = (): void => {
    // Handle view work action if needed
    console.log('View work clicked');
  };


  return (
    <>
      <Helmet>
        <title>Home | Portfolio</title>
        <meta
          name="description"
          content="Full-stack developer passionate about creating innovative web solutions"
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-28 lg:pt-32 pb-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_150%_at_50%_-20%,#e3edff_0%,#f4f7ff_35%,#f9fbff_60%,#f0f5ff_100%)] dark:bg-[radial-gradient(140%_160%_at_50%_-10%,#0b1220_0%,#0f172a_40%,#020817_100%)]" />
          <div className="absolute right-[-20%] top-[-10%] h-64 w-64 rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-500/10" />
          <div className="absolute left-[-10%] bottom-[-20%] h-72 w-72 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-900/40" />

          <div className="container-max">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-12 lg:grid-cols-[1.6fr_1fr] items-center"
            >
              <div>
                <motion.span variants={itemVariants} className="eyebrow mb-6">
                  Full-Stack Craftsmanship
                </motion.span>
                <motion.h1
                  variants={itemVariants}
                  className="font-heading text-4xl md:text-6xl leading-tight text-slate-900 dark:text-white mb-6"
                >
                  I build immersive digital products that scale with your ambition.
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10"
                >
                  From polished interfaces to resilient backends, I partner with teams to ship thoughtful solutions that delight users and move metrics.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <Link to="/projects" className="btn-primary inline-flex items-center">
                    View My Work
                    <HiArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <a
                    href="/asserts/Test_Full_Stack_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center"
                  >
                    <HiDownload className="w-5 h-5 mr-2" />
                    Download Resume
                  </a>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mt-10 grid gap-4 sm:grid-cols-3"
                >
                  {highlightStats.map((stat) => (
                    <div key={stat.label} className="surface-panel p-5">
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-semibold text-primary-700 dark:text-primary-300">
                        {stat.value}
                      </p>
                      <p className="text-sm mt-3 text-slate-600 dark:text-slate-300">
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                className="surface-panel p-8 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#60a5fa1a,transparent_65%)] dark:bg-[radial-gradient(circle_at_top,#2563eb33,transparent_65%)]" />
                <div className="relative space-y-6">
                  <h2 className="font-heading text-2xl text-slate-900 dark:text-white">
                    Current Focus
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300">
                    Architecting modular design systems, automating CI/CD workflows, and experimenting with AI-assisted developer tooling to accelerate delivery.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Design Systems', 'Cloud Native', 'Performance'].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-200 px-3 py-1 text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="section-padding bg-white/70 dark:bg-slate-950/50">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="surface-panel p-10 text-center mb-12"
            >
              <span className="eyebrow mb-4 mx-auto">Selected Works</span>
              <h2 className="text-3xl md:text-4xl font-heading text-slate-900 dark:text-white mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Crafting efficient architectures, mindful user journeys, and maintainable codebases. Explore a snapshot of the things I build.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project: Repository, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProjectCard 
                    project={project}
                    index={index}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link
                to="/projects"
                className="inline-flex items-center text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 text-lg font-medium transition-colors"
              >
                View All Projects
                <HiArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
