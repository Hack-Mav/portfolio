import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const routes = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
  { name: 'Not Found', path: '/does-not-exist' },
]

for (const route of routes) {
  test.describe(`accessibility: ${route.name}`, () => {
    test('should have no automatically detectable a11y violations', async ({
      page,
    }) => {
      await page.goto(route.path)
      await page.waitForLoadState('networkidle')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should have no a11y violations in dark mode', async ({ page }) => {
      await page.goto(route.path)
      await page.evaluate(() => {
        document.documentElement.classList.add('dark')
      })
      await page.waitForLoadState('networkidle')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  })
}
