import React, { useEffect, useRef, useState } from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SkipLink component for keyboard navigation
 * Allows users to skip to main content or navigation
 */
export const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <a
      href={href}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none 
        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </a>
  );
};

interface FocusTrapProps {
  children: React.ReactNode;
  isActive?: boolean;
  onEscape?: () => void;
}

/**
 * FocusTrap component for modals and dropdowns
 * Traps focus within a container and handles escape key
 */
export const FocusTrap: React.FC<FocusTrapProps> = ({ 
  children, 
  isActive = true,
  onEscape 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the container
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }

      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Add event listener
    container.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the previous element
      previousFocusRef.current?.focus();
    };
  }, [isActive, onEscape]);

  return <div ref={containerRef}>{children}</div>;
};

interface AriaLiveProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  className?: string;
}

/**
 * AriaLive component for screen reader announcements
 * Provides live regions for dynamic content updates
 */
export const AriaLive: React.FC<AriaLiveProps> = ({ 
  children, 
  politeness = 'polite',
  atomic = true,
  className = '' 
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  );
};

interface KeyboardNavigationProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  onSelect?: (index: number) => void;
  className?: string;
}

/**
 * KeyboardNavigation component for custom keyboard navigation
 * Provides arrow key navigation for custom components
 */
export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  orientation = 'vertical',
  loop = true,
  onSelect,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = Array.from(
      container.querySelectorAll('[role="menuitem"], [role="option"], button')
    ) as HTMLElement[];

    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      let newIndex = selectedIndex;

      switch (key) {
        case orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight':
          e.preventDefault();
          newIndex = selectedIndex + 1;
          if (newIndex >= focusableElements.length) {
            newIndex = loop ? 0 : focusableElements.length - 1;
          }
          break;

        case orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft':
          e.preventDefault();
          newIndex = selectedIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? focusableElements.length - 1 : 0;
          }
          break;

        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;

        case 'End':
          e.preventDefault();
          newIndex = focusableElements.length - 1;
          break;

        case 'Enter':
        case ' ':
          if (selectedIndex >= 0) {
            e.preventDefault();
            onSelect?.(selectedIndex);
          }
          return;

        default:
          return;
      }

      // Update selected index and focus
      if (newIndex !== selectedIndex && focusableElements?.[newIndex]) {
        setSelectedIndex(newIndex);
        focusableElements[newIndex]!.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, orientation, loop, onSelect]);

  return (
    <div 
      ref={containerRef}
      role={orientation === 'vertical' ? 'menu' : 'menubar'}
      className={className}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            role: 'menuitem',
            tabIndex: selectedIndex === index ? 0 : -1,
            'aria-selected': selectedIndex === index,
          });
        }
        return child;
      })}
    </div>
  );
};

interface AnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  timeout?: number;
}

/**
 * Announcer component for screen reader announcements
 * Automatically announces messages to screen readers
 */
export const Announcer: React.FC<AnnouncerProps> = ({ 
  message, 
  politeness = 'polite',
  timeout = 1000 
}) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [message, timeout]);

  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

interface FocusIndicatorProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FocusIndicator component for better keyboard navigation visibility
 * Adds visual indicators when navigating with keyboard
 */
export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ 
  children, 
  className = '' 
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div className={className}>
      {children}
      <style jsx>{`
        .keyboard-navigation *:focus {
          outline: 2px solid #3b82f6 !important;
          outline-offset: 2px !important;
        }
      `}</style>
    </div>
  );
};

export default {
  SkipLink,
  FocusTrap,
  AriaLive,
  KeyboardNavigation,
  Announcer,
  FocusIndicator,
};
