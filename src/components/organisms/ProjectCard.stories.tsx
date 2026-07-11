import type { Meta, StoryObj } from '@storybook/react'
import ProjectCard from './ProjectCard'

const meta: Meta<typeof ProjectCard> = {
  title: 'Organisms/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ProjectCard component displays GitHub repository information with interactive elements and animations.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    project: {
      description: 'GitHub repository data',
      control: 'object',
    },
    index: {
      description: 'Index for animation delay',
      control: 'number',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock project data
const mockProject = {
  name: 'awesome-project',
  description: 'An awesome project that does amazing things',
  html_url: 'https://github.com/user/awesome-project',
  stargazers_count: 42,
  forks_count: 10,
  watchers_count: 15,
  language: 'TypeScript',
  updated_at: '2024-01-15T10:30:00Z',
  homepage: 'https://awesome-project.vercel.app',
}

export const Default: Story = {
  args: {
    project: mockProject,
    index: 0,
  },
}

export const WithoutHomepage: Story = {
  args: {
    project: {
      ...mockProject,
      homepage: null,
    },
    index: 0,
  },
}

export const WithoutDescription: Story = {
  args: {
    project: {
      ...mockProject,
      description: null,
    },
    index: 0,
  },
}

export const WithoutLanguage: Story = {
  args: {
    project: {
      ...mockProject,
      language: null,
    },
    index: 0,
  },
}

export const HighStats: Story = {
  args: {
    project: {
      ...mockProject,
      stargazers_count: 1234567,
      forks_count: 987654,
      watchers_count: 555555,
    },
    index: 0,
  },
}

export const JavaScriptProject: Story = {
  args: {
    project: {
      ...mockProject,
      language: 'JavaScript',
    },
    index: 0,
  },
}

export const PythonProject: Story = {
  args: {
    project: {
      ...mockProject,
      language: 'Python',
    },
    index: 0,
  },
}

export const ComplexName: Story = {
  args: {
    project: {
      ...mockProject,
      name: 'my-super-complex-project-name-with-many-dashes',
    },
    index: 0,
  },
}

// Visual regression test stories
export const VisualRegression: Story = {
  args: {
    project: mockProject,
    index: 0,
  },
  parameters: {
    chromatic: {
      viewports: [320, 768, 1024, 1920],
      modes: {
        light: {
          theme: 'light',
        },
        dark: {
          theme: 'dark',
        },
      },
    },
  },
}

// Accessibility test stories
export const Accessibility: Story = {
  args: {
    project: mockProject,
    index: 0,
  },
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
