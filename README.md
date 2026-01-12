# 🚀 Modern Portfolio - 2025 Edition

A modern, responsive developer portfolio built with React 18, TypeScript, Vite, and Tailwind CSS. Features dark/light mode, smooth animations, and a professional design system with comprehensive testing and documentation.

## ✨ Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Type Safety**: Full TypeScript support for better developer experience
- **State Management**: Redux Toolkit for predictable state management
- **Animation**: Framer Motion for smooth, performant animations
- **Testing**: Comprehensive test suite with Vitest and React Testing Library
- **Documentation**: Storybook for component documentation
- **Performance Optimized**: Code splitting, lazy loading, and PWA support
- **SEO & Security**: React Helmet Async and Helmet for meta tags and security headers
- **Analytics**: Web Vitals monitoring
- **CI/CD**: GitHub Actions for automated testing and deployment

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, React Router v7
- **State Management**: Redux Toolkit, React-Redux
- **Styling**: Tailwind CSS 3.4 with tailwind-merge
- **Build Tool**: Vite 7.3
- **Testing**: Vitest, React Testing Library, Playwright
- **Documentation**: Storybook, TypeDoc
- **Linting/Formatting**: ESLint, Prettier
- **Type Checking**: TypeScript 5.9
- **Animation**: Framer Motion
- **API Client**: Axios
- **Error Tracking**: Sentry
- **PWA**: Vite PWA Plugin

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm (v9+) or yarn (v1.22+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

4. **Run tests**
   ```bash
   # Run all tests
   npm test
   
   # Run tests in watch mode
   npm run test:watch
   
   # Run tests with coverage
   npm run test:coverage
   
   # Run UI tests
   npm run test:ui
   ```

5. **Run Storybook**
   ```bash
   npm run storybook
   ```
   Open [http://localhost:6006](http://localhost:6006) to view the component library.

6. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/                # Reusable UI components
│   ├── ErrorBoundary/         # Error boundary components
│   ├── atoms/                 # Atomic design components
│   └── ...
├── constants/                 # Application constants
│   └── routes.ts              # Route configurations
├── hooks/                    # Custom React hooks
├── lib/                      # Third-party library configurations
├── middleware/               # Application middleware
├── pages/                    # Page components
│   ├── Home.tsx              # Landing page
│   ├── About.tsx             # About page with skills and experience
│   ├── Projects.tsx          # Projects showcase
│   ├── Contact.tsx           # Contact information and form
│   └── ...
├── services/                 # API services
├── store/                    # Redux store configuration
│   ├── slices/               # Redux slices
│   └── store.ts              # Store configuration
├── stories/                  # Storybook stories
│   ├── components/           # Component stories
│   └── pages/                # Page stories
├── styles/                   # Global styles
│   └── globals.css           # Global CSS with Tailwind directives
├── test-utils.tsx            # Testing utilities
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
├── App.test.tsx              # Main App component tests
├── App.tsx                   # Root component
└── main.tsx                  # Application entry point
```

## 🎨 Customization

### Personal Information
Update the following files with your information:

1. **Environment Variables** (`.env`)
   ```env
   VITE_APP_TITLE="Your Name - Portfolio"
   VITE_APP_DESCRIPTION="Your professional portfolio"
   VITE_APP_GITHUB_USERNAME="your-username"
   VITE_APP_LINKEDIN_USERNAME="your-linkedin"
   VITE_APP_TWITTER_USERNAME="your-twitter"
   ```

2. **About Page** (`src/pages/About.tsx`)
   - Update skills, experience, and achievements
   - Replace personal information and bio

3. **Contact Page** (`src/pages/Contact.tsx`)
   - Update contact details and social media links
   - Configure the contact form to use your preferred backend service

4. **Resume**
   - Replace `/public/asserts/Test_Full_Stack_Resume.pdf` with your resume
   - Update any direct links to your resume in the codebase

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build Storybook
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Check TypeScript types
- `npm run docs` - Generate API documentation

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using React, TypeScript, Vite, and Tailwind CSS**