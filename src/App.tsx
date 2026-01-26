// src/App.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '@components/organisms/Header';
import LoadingSpinner from '@components/atoms/LoadingSpinner';
import { SkipLink, FocusIndicator, Announcer } from '@components/atoms/Accessibility';
import { ROUTES } from '@/constants/routes';

// Lazy load pages for better performance
const Home = lazy(() => import('@pages/Home'));
const About = lazy(() => import('@pages/About'));
const Projects = lazy(() => import('@pages/Projects'));
const Contact = lazy(() => import('@pages/Contact'));
const NotFound = lazy(() => import('@pages/NotFound'));

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
    className="min-h-[calc(100vh-4rem)] w-full"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  return (
    <>
      <Helmet>
        <title>Portfolio | Full-Stack Developer</title>
        <meta
          name="description"
          content="Modern portfolio showcasing full-stack development skills and innovative projects"
        />
      </Helmet>

      <FocusIndicator>
        {/* Skip links for keyboard navigation */}
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <SkipLink href="#main-navigation">Skip to navigation</SkipLink>
        
        {/* Screen reader announcer */}
        <Announcer message={`Navigated to ${location.pathname}`} />

        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header id="main-navigation" />

          <main 
            id="main-content"
            className="px-4 sm:px-6 lg:px-8 py-4"
            role="main"
            tabIndex={-1}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname.split('/')[1] || 'home'}>
                  <Route path={ROUTES.HOME} element={<PageTransition><Home /></PageTransition>} />
                  <Route path={ROUTES.ABOUT} element={<PageTransition><About /></PageTransition>} />
                  <Route path={ROUTES.PROJECTS} element={<PageTransition><Projects /></PageTransition>} />
                  <Route path={ROUTES.CONTACT} element={<PageTransition><Contact /></PageTransition>} />
                  <Route path={ROUTES.UNDEFINED} element={<PageTransition><NotFound /></PageTransition>} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>
        </div>
      </FocusIndicator>
    </>
  );
}

export default App;