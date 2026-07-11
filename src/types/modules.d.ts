declare module '@components/layout/Header' {
  import { FC } from 'react'
  const Header: FC
  export default Header
}

declare module '@components/ui/LoadingSpinner' {
  import { FC } from 'react'
  const LoadingSpinner: FC
  export default LoadingSpinner
}

declare module '@pages/Home' {
  import { FC } from 'react'
  const Home: FC
  export default Home
}

declare module '@pages/About' {
  import { FC } from 'react'
  const About: FC
  export default About
}

declare module '@pages/Projects' {
  import { FC } from 'react'
  const Projects: FC
  export default Projects
}

declare module '@pages/Contact' {
  import { FC } from 'react'
  const Contact: FC
  export default Contact
}

declare module '@pages/NotFound' {
  import { FC } from 'react'
  const NotFound: FC
  export default NotFound
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.webp' {
  const value: string
  export default value
}
