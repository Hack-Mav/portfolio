import type { Meta, StoryObj } from '@storybook/react';
import LazyImage from './LazyImage';

const meta: Meta<typeof LazyImage> = {
  title: 'Atoms/LazyImage',
  component: LazyImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'LazyImage component that loads images when they enter the viewport with Intersection Observer.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'image-alt',
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
    src: {
      description: 'Image source URL',
      control: 'text',
    },
    alt: {
      description: 'Alternative text for accessibility',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder image URL',
      control: 'text',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    threshold: {
      description: 'Intersection Observer threshold',
      control: 'number',
    },
    rootMargin: {
      description: 'Intersection Observer root margin',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Test image',
  },
};

export const WithPlaceholder: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Test image with placeholder',
    placeholder: 'https://picsum.photos/400/300?blur=10',
  },
};

export const CustomThreshold: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Test image with custom threshold',
    threshold: 0.5,
  },
};

export const CustomRootMargin: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Test image with custom root margin',
    rootMargin: '100px',
  },
};

export const CustomClassName: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Test image with custom class',
    className: 'rounded-lg shadow-lg',
  },
};

export const LargeImage: Story = {
  args: {
    src: 'https://picsum.photos/800/600',
    alt: 'Large test image',
  },
};

export const SmallImage: Story = {
  args: {
    src: 'https://picsum.photos/200/150',
    alt: 'Small test image',
  },
};

export const WithoutAlt: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: '',
  },
};

export const EmptySrc: Story = {
  args: {
    src: '',
    alt: 'Empty src test',
  },
};

// Visual regression test stories
export const VisualRegression: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Visual regression test image',
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
};

// Accessibility test stories
export const Accessibility: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Accessibility test image',
  },
  parameters: {
    a11y: {
      disable: false,
    },
  },
};

// Loading states
export const LoadingState: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Loading state image',
  },
  parameters: {
    chromatic: {
      delay: 1000, // Show loading state for 1 second
    },
  },
};

// Error state
export const ErrorState: Story = {
  args: {
    src: 'https://invalid-url-that-will-fail.com/image.jpg',
    alt: 'Error state image',
  },
};
