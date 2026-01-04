// src/App.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@components/layout/Header';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import { ROUTES } from '@/constants/routes';

// Lazy load pages for better performance
const Home = lazy(() => import('@pages/Home'));
const About = lazy(() => import('@pages/About'));
const Projects = lazy(() => import('@pages/Projects'));
const Contact = lazy(() => import('@pages/Contact'));
const NotFound = lazy(() => import('@pages/NotFound'));

function App() {
  return (
    <>
      <Helmet>
        <title>Portfolio | Full-Stack Developer</title>
        <meta
          name="description"
          content="Modern portfolio showcasing full-stack development skills and innovative projects"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.ABOUT} element={<About />} />
              <Route path={ROUTES.PROJECTS} element={<Projects />} />
              <Route path={ROUTES.CONTACT} element={<Contact />} />
              <Route path={ROUTES.UNDEFINED} element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </>
  );
}

export default App;