import { useState, useEffect, useRef, useId } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi'
import { Tooltip } from 'react-tooltip'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/constants/routes'

interface NavItem {
  name: string
  href: string
}

const navigation: NavItem[] = [
  { name: 'Home', href: ROUTES.HOME },
  { name: 'About', href: ROUTES.ABOUT },
  { name: 'Projects', href: ROUTES.PROJECTS },
  { name: 'Contact', href: ROUTES.CONTACT },
]

const tooltipContent: Record<string, string> = {
  Home: 'Navigate to homepage',
  About: 'Learn more about me',
  Projects: 'View my portfolio projects',
  Contact: 'Get in touch with me',
}

const Header: React.FC<{ id?: string }> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  // Update the dark mode class when isDark changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Mobile menu focus trap and Escape handling
  useEffect(() => {
    if (!isOpen) return

    const menu = menuRef.current
    if (!menu) return

    const focusableSelector =
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    const focusable = Array.from(
      menu.querySelectorAll<HTMLElement>(focusableSelector)
    )

    if (focusable.length > 0) {
      focusable[0]?.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
        menuButtonRef.current?.focus()
        return
      }

      if (e.key !== 'Tab' || focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const toggleDarkMode = (): void => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  return (
    <header
      id={id}
      role="banner"
      tabIndex={-1}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to={ROUTES.HOME}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Portfolio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center"
            aria-label="Main navigation"
          >
            <ul className="flex items-center space-x-8">
              {navigation.map((item, index) => (
                <li
                  key={item.name}
                  role="listitem"
                  aria-setsize={navigation.length}
                  aria-posinset={index + 1}
                >
                  <NavLink
                    to={item.href}
                    prefetch="intent"
                    data-tooltip-id="header-tooltip"
                    data-tooltip-content={tooltipContent[item.name]}
                    aria-describedby="header-tooltip"
                    className={({ isActive }) =>
                      cn(
                        'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors',
                        {
                          'text-primary-600 dark:text-primary-400': isActive,
                        }
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <button
              onClick={toggleDarkMode}
              data-tooltip-id="header-tooltip"
              data-tooltip-content={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
              aria-describedby="header-tooltip"
            >
              {isDark ? (
                <HiSun className="h-5 w-5" />
              ) : (
                <HiMoon className="h-5 w-5" />
              )}
            </button>
          </nav>

          {/* Mobile menu button and theme toggler */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              data-tooltip-id="header-tooltip"
              data-tooltip-content={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
              aria-describedby="header-tooltip"
            >
              {isDark ? (
                <HiSun className="h-5 w-5" />
              ) : (
                <HiMoon className="h-5 w-5" />
              )}
            </button>
            <button
              ref={menuButtonRef}
              onClick={() => setIsOpen(!isOpen)}
              data-tooltip-id="header-tooltip"
              data-tooltip-content={isOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              aria-expanded={isOpen}
              aria-controls={menuId}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-describedby="header-tooltip"
            >
              {isOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        id={menuId}
        ref={menuRef}
        aria-label="Mobile navigation"
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigation.map((item, index) => (
            <li
              key={item.name}
              role="listitem"
              aria-setsize={navigation.length}
              aria-posinset={index + 1}
            >
              <NavLink
                to={item.href}
                prefetch="intent"
                className={({ isActive }) =>
                  cn('block px-3 py-2 rounded-md text-base font-medium', {
                    'text-primary-600 dark:text-primary-400': isActive,
                    'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400':
                      !isActive,
                  })
                }
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
          {/* Theme toggler removed from mobile menu as it's now in the header */}
        </ul>
      </nav>

      <Tooltip
        id="header-tooltip"
        place="bottom"
        className="z-50"
        globalCloseEvents={{ escape: true }}
      />
    </header>
  )
}

export default Header
