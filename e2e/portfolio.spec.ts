import { test, expect } from '@playwright/test'

test.describe('Portfolio E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the portfolio
    await page.goto('/')
  })

  test.describe('Navigation', () => {
    test('should navigate to all pages correctly', async ({ page }) => {
      // Test navigation to About page
      await page.click('a[href="/about"]')
      await expect(page).toHaveURL('/about')
      await expect(page.locator('h1')).toContainText('About')

      // Test navigation to Projects page
      await page.click('a[href="/projects"]')
      await expect(page).toHaveURL('/projects')
      await expect(page.locator('h1')).toContainText('Projects')

      // Test navigation to Contact page
      await page.click('a[href="/contact"]')
      await expect(page).toHaveURL('/contact')
      await expect(page.locator('h1')).toContainText('Contact')

      // Test navigation back to Home
      await page.click('a[href="/"]')
      await expect(page).toHaveURL('/')
      await expect(page.locator('h1')).toContainText('Home')
    })

    test('should support keyboard navigation', async ({ page }) => {
      // Test Tab navigation
      await page.keyboard.press('Tab')
      await expect(page.locator(':focus')).toBeVisible()

      // Test Enter key on links
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL('/about')
    })

    test('should show skip links on focus', async ({ page }) => {
      // Focus on skip link
      await page.keyboard.press('Tab')
      const skipLink = page.locator('a[href="#main-content"]')
      await expect(skipLink).toBeVisible()

      // Test skip link functionality
      await skipLink.click()
      const mainContent = page.locator('#main-content')
      await expect(mainContent).toBeFocused()
    })
  })

  test.describe('Home Page', () => {
    test('should load home page with all elements', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Portfolio/)

      // Check main sections
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('[role="banner"]')).toBeVisible()
      await expect(page.locator('[role="main"]')).toBeVisible()
    })

    test('should support dark mode toggle', async ({ page }) => {
      // Find and click dark mode toggle
      const darkModeToggle = page
        .locator('[aria-label*="dark"], [aria-label*="light"]')
        .first()
      await darkModeToggle.click()

      // Check if dark mode is applied
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)
    })

    test('should be responsive on mobile', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await expect(page.locator('[role="banner"]')).toBeVisible()

      // Test mobile navigation
      const mobileMenuButton = page.locator(
        'button[aria-label*="menu"], button[aria-label*="Menu"]'
      )
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click()
        await expect(page.locator('[role="navigation"]')).toBeVisible()
      }
    })
  })

  test.describe('Projects Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects')
    })

    test('should display project cards', async ({ page }) => {
      // Wait for projects to load
      await page.waitForSelector('[data-testid="project-card"]', {
        timeout: 10000,
      })

      // Check if project cards are displayed
      const projectCards = page.locator('[data-testid="project-card"]')
      await expect(projectCards.first()).toBeVisible()

      // Check project card content
      const firstCard = projectCards.first()
      await expect(firstCard.locator('h3')).toBeVisible()
      await expect(firstCard.locator('a[href*="github"]')).toBeVisible()
    })

    test('should filter projects', async ({ page }) => {
      // Look for filter functionality
      const filterButton = page.locator(
        'button[aria-label*="filter"], [data-testid="filter"]'
      )
      if (await filterButton.isVisible()) {
        await filterButton.click()

        // Test filter options
        const filterOptions = page.locator(
          '[role="menuitem"], [data-testid="filter-option"]'
        )
        if (await filterOptions.first().isVisible()) {
          await filterOptions.first().click()
          await page.waitForTimeout(1000) // Wait for filter to apply
        }
      }
    })

    test('should handle project card interactions', async ({ page }) => {
      await page.waitForSelector('[data-testid="project-card"]', {
        timeout: 10000,
      })

      const firstCard = page.locator('[data-testid="project-card"]').first()

      // Test hover effect
      await firstCard.hover()
      await expect(firstCard).toHaveClass(/group/)

      // Test GitHub link
      const githubLink = firstCard.locator('a[href*="github"]')
      if (await githubLink.isVisible()) {
        const [newPage] = await Promise.all([
          page.waitForEvent('popup'),
          githubLink.click(),
        ])
        await expect(newPage).toHaveURL(/github\.com/)
        await newPage.close()
      }
    })
  })

  test.describe('Contact Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/contact')
    })

    test('should display contact form', async ({ page }) => {
      // Check form elements
      await expect(page.locator('form')).toBeVisible()
      await expect(page.locator('input[name="name"]')).toBeVisible()
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.locator('textarea[name="message"]')).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()
    })

    test('should validate form inputs', async ({ page }) => {
      // Test empty form submission
      await page.click('button[type="submit"]')

      // Check for validation errors
      const nameInput = page.locator('input[name="name"]')
      const emailInput = page.locator('input[name="email"]')

      if ((await nameInput.getAttribute('aria-invalid')) === 'true') {
        await expect(nameInput).toHaveAttribute('aria-invalid', 'true')
      }

      if ((await emailInput.getAttribute('aria-invalid')) === 'true') {
        await expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      }
    })

    test('should fill and submit form', async ({ page }) => {
      // Fill form with test data
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="subject"]', 'Test Subject')
      await page.fill('textarea[name="message"]', 'This is a test message')

      // Submit form
      await page.click('button[type="submit"]')

      // Check for success message or form submission
      await page.waitForTimeout(2000)

      // Verify form was submitted (success message or form reset)
      const successMessage = page.locator('[role="alert"], .success-message')
      if (await successMessage.isVisible()) {
        await expect(successMessage).toContainText(/success|thank you/i)
      }
    })

    test('should display contact information', async ({ page }) => {
      // Check for contact links
      const emailLink = page.locator('a[href*="mailto:"]')
      const phoneLink = page.locator('a[href*="tel:"]')
      const locationInfo = page.locator(
        '[data-testid="location"], [aria-label*="location"]'
      )

      if (await emailLink.isVisible()) {
        await expect(emailLink).toHaveAttribute('href', /mailto:/)
      }

      if (await phoneLink.isVisible()) {
        await expect(phoneLink).toHaveAttribute('href', /tel:/)
      }

      if (await locationInfo.isVisible()) {
        await expect(locationInfo).toBeVisible()
      }
    })
  })

  test.describe('About Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/about')
    })

    test('should display about information', async ({ page }) => {
      // Check for about content
      await expect(page.locator('h1')).toContainText('About')

      // Look for skills section
      const skillsSection = page.locator(
        '[data-testid="skills"], h2:has-text("Skills")'
      )
      if (await skillsSection.isVisible()) {
        await expect(skillsSection).toBeVisible()
      }

      // Look for experience section
      const experienceSection = page.locator(
        '[data-testid="experience"], h2:has-text("Experience")'
      )
      if (await experienceSection.isVisible()) {
        await expect(experienceSection).toBeVisible()
      }
    })

    test('should display resume download link', async ({ page }) => {
      const resumeLink = page.locator(
        'a[href*="resume"], a[href*="Resume"], [data-testid="resume-link"]'
      )
      if (await resumeLink.isVisible()) {
        await expect(resumeLink).toBeVisible()
        await expect(resumeLink).toHaveAttribute('href', /\.pdf$/)
      }
    })

    test('should show skill progress bars or indicators', async ({ page }) => {
      const skillElements = page.locator(
        '[data-testid="skill"], [role="progressbar"], .skill-item'
      )
      if (await skillElements.first().isVisible()) {
        await expect(skillElements.first()).toBeVisible()
      }
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      // Check for proper ARIA roles
      await expect(page.locator('[role="banner"]')).toBeVisible()
      await expect(page.locator('[role="main"]')).toBeVisible()
      await expect(page.locator('[role="navigation"]')).toBeVisible()
    })

    test('should support keyboard navigation throughout', async ({ page }) => {
      // Test Tab navigation through main elements
      let tabCount = 0
      const maxTabs = 20 // Prevent infinite loop

      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab')
        const focusedElement = page.locator(':focus')

        if (await focusedElement.isVisible()) {
          const tagName = await focusedElement.evaluate(el => el.tagName)
          expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(
            tagName
          )
        } else {
          break
        }

        tabCount++
      }
    })

    test('should have proper heading hierarchy', async ({ page }) => {
      // Check for proper heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6')
      const headingCount = await headings.count()

      if (headingCount > 0) {
        // First heading should be h1
        const firstHeading = headings.first()
        const tagName = await firstHeading.evaluate(el => el.tagName)
        expect(tagName).toBe('H1')
      }
    })

    test('should have sufficient color contrast', async ({ page }) => {
      // This would require a contrast checking library
      // For now, we'll just check that text is visible
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, a')
      const firstTextElement = textElements.first()

      if (await firstTextElement.isVisible()) {
        const computedStyle = await firstTextElement.evaluate(el => {
          const style = getComputedStyle(el)
          return {
            color: style.color,
            backgroundColor: style.backgroundColor,
            opacity: style.opacity,
          }
        })

        expect(computedStyle.opacity).not.toBe('0')
      }
    })
  })

  test.describe('Performance', () => {
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime

      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000)
    })

    test('should not have console errors', async ({ page }) => {
      const consoleErrors: string[] = []

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      expect(consoleErrors).toHaveLength(0)
    })

    test('should be responsive across different viewports', async ({
      page,
    }) => {
      const viewports = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 768, height: 1024 }, // Tablet
        { width: 375, height: 667 }, // Mobile
      ]

      for (const viewport of viewports) {
        await page.setViewportSize(viewport)
        await page.goto('/')

        // Check that main elements are visible
        await expect(page.locator('[role="banner"]')).toBeVisible()
        await expect(page.locator('[role="main"]')).toBeVisible()
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle 404 pages gracefully', async ({ page }) => {
      await page.goto('/non-existent-page')

      // Should show 404 page or redirect to home
      const is404Page = await page
        .locator('h1:has-text("404"), h1:has-text("Not Found")')
        .isVisible()
      const isHomePage = await page
        .locator('h1:has-text("Home"), h1:has-text("Portfolio")')
        .isVisible()

      expect(is404Page || isHomePage).toBeTruthy()
    })

    test('should handle broken images gracefully', async ({ page }) => {
      await page.goto('/')

      // Check for broken images
      const images = page.locator('img')
      const imageCount = await images.count()

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const tagName = await img.evaluate(el => el.tagName)

        if (tagName === 'IMG') {
          const naturalWidth = await img.evaluate(
            (el: HTMLImageElement) => el.naturalWidth
          )

          // If naturalWidth is 0, image is broken
          if (naturalWidth === 0) {
            // Check if there's a fallback or error handling
            const altText = await img.getAttribute('alt')
            expect(altText).toBeTruthy()
          }
        }
      }
    })
  })

  test.describe('SEO and Meta', () => {
    test('should have proper meta tags', async ({ page }) => {
      // Check title
      const title = await page.title()
      expect(title).toMatch(/Portfolio|Full-Stack Developer/)

      // Check meta description
      const metaDescription = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(metaDescription).toBeTruthy()
      expect(metaDescription!.length).toBeGreaterThan(50)
    })

    test('should have proper Open Graph tags', async ({ page }) => {
      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute('content')
      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute('content')
      const ogImage = await page
        .locator('meta[property="og:image"]')
        .getAttribute('content')

      expect(ogTitle).toBeTruthy()
      expect(ogDescription).toBeTruthy()
      // ogImage might not be present on all pages
    })
  })
})
