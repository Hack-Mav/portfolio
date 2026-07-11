interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_PREFIX = 'portfolio_cache_'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

class CacheManager {
  private isLocalStorageAvailable: boolean

  constructor() {
    // Check if localStorage is available
    this.isLocalStorageAvailable = this.checkLocalStorage()
  }

  private checkLocalStorage(): boolean {
    try {
      const testKey = 'test'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      return true
    } catch {
      console.warn('localStorage is not available, using in-memory cache only')
      return false
    }
  }

  private getKey(key: string): string {
    return `${CACHE_PREFIX}${key}`
  }

  set<T>(key: string, data: T): void {
    const cacheKey = this.getKey(key)
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }

    try {
      if (this.isLocalStorageAvailable) {
        localStorage.setItem(cacheKey, JSON.stringify(entry))
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  get<T>(key: string): T | null {
    const cacheKey = this.getKey(key)

    try {
      if (this.isLocalStorageAvailable) {
        const cached = localStorage.getItem(cacheKey)
        if (!cached) return null

        const { data, timestamp } = JSON.parse(cached) as CacheEntry<T>

        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data
        }

        // Remove expired cache
        this.remove(key)
      }
    } catch (error) {
      console.warn('Error reading from cache:', error)
      this.remove(key)
    }

    return null
  }

  remove(key: string): void {
    const cacheKey = this.getKey(key)

    try {
      if (this.isLocalStorageAvailable) {
        localStorage.removeItem(cacheKey)
      }
    } catch (error) {
      console.warn('Failed to remove from cache:', error)
    }
  }

  clear(): void {
    try {
      if (this.isLocalStorageAvailable) {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(key)
          }
        })
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }

  // Get cache stats (for debugging)
  getStats(): { total: number; expired: number; valid: number } {
    const stats = { total: 0, expired: 0, valid: 0 }

    try {
      if (this.isLocalStorageAvailable) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith(CACHE_PREFIX)) {
            stats.total++

            try {
              const cached = localStorage.getItem(key)
              if (cached) {
                const { timestamp } = JSON.parse(cached) as CacheEntry<unknown>
                if (Date.now() - timestamp < CACHE_DURATION) {
                  stats.valid++
                } else {
                  stats.expired++
                }
              }
            } catch {
              // Ignore invalid cache entries
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error getting cache stats:', error)
    }

    return stats
  }
}

export const cacheManager = new CacheManager()

// Helper function to generate cache keys for API requests
export const getCacheKey = (
  endpoint: string,
  params?: Record<string, unknown>
): string => {
  const paramsString = params ? `_${JSON.stringify(params)}` : ''
  return `${endpoint}${paramsString}`
}
