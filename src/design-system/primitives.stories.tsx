import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  Heading,
  Text,
  Card,
  Surface,
  Container,
  Badge,
  Eyebrow,
  Spinner,
  FadeIn,
  FormField,
} from './index'

const meta: Meta = {
  title: 'Design System/Primitives',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Reusable primitives that form the portfolio design system.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const ButtonVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
}

export const ButtonSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Icon button">
        <span className="w-4 h-4 rounded-full bg-current" />
      </Button>
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading as="h1" size="xl">
        Heading XL
      </Heading>
      <Heading as="h2" size="lg">
        Heading LG
      </Heading>
      <Heading as="h3" size="md">
        Heading MD
      </Heading>
      <Text size="lg">Large body text</Text>
      <Text>Base body text</Text>
      <Text size="sm" muted>
        Small muted text
      </Text>
    </div>
  ),
}

export const EyebrowAndBadge: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <Eyebrow>Showcase</Eyebrow>
      <div className="flex gap-2">
        <Badge>Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </div>
  ),
}

export const SurfaceAndCard: Story = {
  render: () => (
    <Container className="w-96">
      <Surface className="p-8 mb-4">
        <Text>This is a surface panel.</Text>
      </Surface>
      <Card className="p-6">
        <Heading size="sm">Card title</Heading>
        <Text muted>Card content using the design system.</Text>
      </Card>
    </Container>
  ),
}

export const SpinnerSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  ),
}

export const FadeInAnimation: Story = {
  render: () => (
    <div className="space-y-4">
      <FadeIn direction="up" delay={0}>
        <Text>Fade in up</Text>
      </FadeIn>
      <FadeIn direction="left" delay={200}>
        <Text>Fade in left</Text>
      </FadeIn>
      <FadeIn direction="scale" delay={400}>
        <Text>Fade in scale</Text>
      </FadeIn>
    </div>
  ),
}

export const FormFieldStates: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <FormField
        label="Email"
        name="email"
        type="email"
        value="hello@example.com"
        onChange={() => {}}
        placeholder="you@example.com"
        required
        helpText="We will never share your email."
      />
      <FormField
        label="Message"
        name="message"
        textarea
        value=""
        onChange={() => {}}
        error="Message is required."
        required
      />
    </div>
  ),
}
