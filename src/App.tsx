// src/App.tsx
import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Header, LoadingSpinner, PageTransition } from '@components'
import {
  SkipLink,
  FocusIndicator,
  Announcer,
} from '@components/atoms/Accessibility'
import { ROUTES } from '@/constants/routes'

// Lazy load pages for better performance
const Home = lazy(() => import('@pages/Home'))
const About = lazy(() => import('@pages/About'))
const Projects = lazy(() => import('@pages/Projects'))
const Changelog = lazy(() => import('@pages/Changelog'))
const Contact = lazy(() => import('@pages/Contact'))
const NotFound = lazy(() => import('@pages/NotFound'))

function App() {
  const location = useLocation()
  return (
    <>
      <Helmet htmlAttributes={{ lang: 'en' }}>
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
            className="px-4 sm:px-6 lg:px-8 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            role="main"
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Routes location={location}>
                <Route
                  path={ROUTES.HOME}
                  element={
                    <PageTransition>
                      <Home />
                    </PageTransition>
                  }
                />
                <Route
                  path={ROUTES.ABOUT}
                  element={
                    <PageTransition>
                      <About />
                    </PageTransition>
                  }
                />
                <Route
                  path={ROUTES.PROJECTS}
                  element={
                    <PageTransition>
                      <Projects />
                    </PageTransition>
                  }
                />
                <Route
                  path={ROUTES.CHANGELOG}
                  element={
                    <PageTransition>
                      <Changelog />
                    </PageTransition>
                  }
                />
                <Route
                  path={ROUTES.CONTACT}
                  element={<Contact />}
                />
                <Route
                  path={ROUTES.UNDEFINED}
                  element={
                    <PageTransition>
                      <NotFound />
                    </PageTransition>
                  }
                />
              </Routes>
            </Suspense>
          </main>
        </div>
      </FocusIndicator>
    </>
  )
}

export default App
