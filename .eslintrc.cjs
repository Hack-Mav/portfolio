module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: [
    'dist', 
    '.eslintrc.cjs', 
    'node_modules',
    '**/node_modules/**/*',
    '**/dist/**/*',
    '**/build/**/*',
    '**/coverage/**/*'
  ],
  parserOptions: { 
    ecmaVersion: 'latest', 
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: { 
    react: { 
      version: 'detect' 
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': 'warn',
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true 
    }],
    'react/no-unescaped-entities': 'off',
    'no-prototype-builtins': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-useless-escape': 'off',
    'no-fallthrough': 'off',
    'no-cond-assign': 'off',
    'getter-return': 'off',
    'no-misleading-character-class': 'off',
    'valid-typeof': 'off',
    'no-control-regex': 'off'
  },
  overrides: [
    {
      files: ['vite.config.js'],
      env: { node: true },
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off'
      }
    },
    {
      files: ['**/*.jsx', '**/*.js'],
      rules: {
        'no-undef': 'error'
      }
    }
  ]
}