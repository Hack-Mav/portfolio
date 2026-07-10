import axios from 'axios'

const GITHUB_USERNAME = 'parthivrawat' // Replace with your GitHub username
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

class GitHubService {
  constructor() {
    this.cache = new Map()
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      timeout: 10000,
    })
  }

  async getRepositories() {
    const cacheKey = 'repositories'
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    try {
      const response = await this.api.get(`/users/${GITHUB_USERNAME}/repos`, {
        params: {
          sort: 'updated',
          per_page: 50,
          type: 'owner',
        },
      })

      const repositories = response.data.filter(repo => !repo.fork)

      this.cache.set(cacheKey, {
        data: repositories,
        timestamp: Date.now(),
      })

      return repositories
    } catch (error) {
      console.error('Failed to fetch repositories:', error)

      // Return cached data if available, even if expired
      if (cached) {
        return cached.data
      }

      throw new Error('Failed to load repositories')
    }
  }

  async getRepository(name) {
    const cacheKey = `repository-${name}`
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    try {
      const response = await this.api.get(`/repos/${GITHUB_USERNAME}/${name}`)

      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      })

      return response.data
    } catch (error) {
      console.error(`Failed to fetch repository ${name}:`, error)

      if (cached) {
        return cached.data
      }

      throw new Error(`Failed to load repository: ${name}`)
    }
  }

  clearCache() {
    this.cache.clear()
  }
}

export const githubService = new GitHubService()
