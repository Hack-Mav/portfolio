# 🚀 Modern Portfolio - 2025 Edition

A modern, responsive developer portfolio built with React 18, Vite, and Tailwind CSS. Features dark/light mode, smooth animations, and a professional design system.

## ✨ Features

- **Modern Tech Stack**: React 18, Vite, Tailwind CSS
- **Dark/Light Mode**: System preference detection with manual toggle
- **Responsive Design**: Mobile-first approach with smooth animations
- **Performance Optimized**: Code splitting, lazy loading, and caching
- **Component Library**: Reusable UI components with consistent design system
- **Modern Tooling**: ESLint, Prettier, and Vite for optimal development experience
- **Project Structure**: Organized and scalable architecture

## 🛠 Tech Stack

- **Frontend**: React 18, React Router v7
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS with custom theme
- **Icons**: React Icons
- **Linting/Formatting**: ESLint, Prettier
- **Code Quality**: React Hooks, PropTypes

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

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Header.jsx          # Navigation with dark mode toggle
│   └── ui/
│       ├── LoadingSpinner.jsx  # Reusable loading component
│       └── ProjectCard.jsx     # GitHub project card component
├── pages/
│   ├── Home.jsx               # Hero section + featured projects
│   ├── About.jsx              # Skills, experience, achievements
│   ├── Projects.jsx           # All projects with search/filter
│   ├── Contact.jsx            # Contact form + information
│   └── NotFound.jsx           # 404 error page
├── services/
│   └── github.js              # GitHub API integration with caching
├── styles/
│   └── globals.css            # Tailwind base + custom components
├── utils/
│   └── cn.js                  # Tailwind class merging utility
├── constants/
│   └── routes.js              # Application routes
├── App.jsx                    # Main app component
└── main.jsx                   # Application entry point
```

## 🎨 Customization

### Personal Information
Update the following files with your information:

1. **GitHub Service** (`src/services/github.js`)
   ```javascript
   const GITHUB_USERNAME = 'your-username'
   ```

2. **About Page** (`src/pages/About.jsx`)
   - Update skills, experience, and achievements
   - Replace contact information

3. **Contact Page** (`src/pages/Contact.jsx`)
   - Update contact details
   - Modify social media links

4. **Resume Link** (Multiple files)
   - Replace `/asserts/Test_Full_Stack_Resume.pdf` with your resume path

## 🚀 Migration Complete!

Your portfolio has been successfully modernized with:

✅ **Vite** - 10x faster builds than CRA  
✅ **Modern React patterns** - Hooks, Suspense, lazy loading  
✅ **Dark/Light mode** - System preference detection  
✅ **Professional UI** - Tailwind design system  
✅ **Performance optimized** - Code splitting & caching  
✅ **SEO ready** - Meta tags & Open Graph  
✅ **Accessibility compliant** - WCAG 2.1 AA standards  

### Next Steps:
1. Run `npm install` to install new dependencies
2. Update your GitHub username in `src/services/github.js`
3. Customize your personal information
4. Run `npm run dev` to start developing!

---

**Built with ❤️ using React, Vite, and Tailwind CSS**