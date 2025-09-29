/* eslint-disable unicorn/filename-case */
import type { UseFetchOptions } from 'nuxt/app'

import { useDebounceFn, useFetch, useStorage } from '@vueuse/core'

/**
 * Options for configuring the useFetchData composable
 * @template T - The expected data type
 */
type FetchDataOptions<T> = {
  // VueUse specific options
  /** Debounce time in milliseconds for the fetch request */
  debounce?: number
  /** Enable caching of fetched data */
  enableCache?: boolean
  /** Custom cache key for storing data */
  cacheKey?: string
  /** Cache time-to-live in milliseconds */
  cacheTTL?: number
  /** Whether to execute the fetch immediately */
  immediate?: boolean
  /** Number of retry attempts on failure */
  retry?: number
  /** Delay between retry attempts in milliseconds */
  retryDelay?: number

  // Custom options
  /** Whether to prepend the base API URL */
  useBaseUrl?: boolean
  /** Transform function to modify the response data */
  transform?: (data: any) => T

  // URL composition
  /** URL path parameters (e.g., { id: 123 } for /users/:id) */
  params?: Record<string, string | number>
  /** URL query parameters (e.g., { page: 1, limit: 10 }) */
  query?: Record<string, any>
} & Omit<UseFetchOptions<T>, 'default'>

/**
 * Return type for the useFetchData composable
 * @template T - The expected data type
 */
type FetchDataReturn<T> = {
  /** Reactive data returned from the API */
  data: Ref<T | null>
  /** Loading state indicator */
  loading: Ref<boolean>
  /** Error object if the request failed */
  error: Ref<Error | null>
  /** HTTP status code of the response */
  statusCode: Ref<number | null>
  /** Function to refresh the data (clears cache if enabled) */
  refresh: () => Promise<void>
  /** Function to abort the ongoing request */
  abort: () => void
  /** Function to execute the fetch with optional URL and options */
  execute: (url?: string, options?: FetchDataOptions<T>) => Promise<void>
  /** Function to update URL path parameters */
  updateParams: (newParams: Record<string, string | number>) => void
  /** Function to update URL query parameters */
  updateQuery: (newQuery: Record<string, any>) => void
}

/**
 * Generates a unique cache key based on URL, params, and query
 * @param url - The request URL
 * @param params - URL path parameters
 * @param query - URL query parameters
 * @returns A unique cache key string
 */
function generateCacheKey(
  url: string,
  params?: Record<string, string | number>,
  query?: Record<string, any>,
): string {
  let key = `fetch-cache-${url}`

  if (params && Object.keys(params).length > 0) {
    key += `-params-${JSON.stringify(params)}`
  }

  if (query && Object.keys(query).length > 0) {
    key += `-query-${JSON.stringify(query)}`
  }

  return key
}

/**
 * Composable for fetching data with enhanced features using VueUse
 *
 * Features:
 * - Automatic base URL handling
 * - Path parameter replacement
 * - Query string generation
 * - Caching with TTL
 * - Retry mechanism
 * - Debouncing
 * - Request abortion
 * - Data transformation
 *
 * @template T - The expected data type
 * @param url - The URL to fetch (can include params like :id)
 * @param options - Configuration options for the fetch request
 * @returns An object containing reactive state and control methods
 *
 * @example
 * // Basic usage
 * const { data, loading, error } = useFetchData<User[]>('/api/users')
 *
 * @example
 * // With params and query
 * const { data: posts } = useFetchData<Post[]>('/api/users/:userId/posts', {
 *   params: { userId: 123 },
 *   query: { page: 1, limit: 10 },
 *   enableCache: true,
 *   cacheTTL: 300000 // 5 minutes
 * })
 *
 * @example
 * // With transformation
 * const { data: products } = useFetchData<Product[]>('/api/products', {
 *   transform: (data) => data.products.map(transformProduct)
 * })
 */
export function useFetchData<T = any>(
  url: MaybeRefOrGetter<string>,
  options: FetchDataOptions<T> = {},
): FetchDataReturn<T> {
  // Get runtime configuration for base API URL
  const config = useRuntimeConfig()
  const BASE_URL_API = config.public.baseUrlApi || ''

  // Destructure options with default values
  const {
    // VueUse specific options
    debounce = 0,
    enableCache = false,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes default
    immediate = true,
    retry = 0,
    retryDelay = 1000,

    // Custom options
    useBaseUrl = true,
    transform,

    // URL composition
    params: initialParams = {},
    query: initialQuery = {},

    // Nuxt fetch options
    ...fetchOptions
  } = options

  /**
   * Builds a complete URL with base API URL, path parameters, and query string
   * @param path - The URL path
   * @param useBaseUrl - Whether to prepend the base API URL
   * @param params - URL path parameters to replace
   * @param query - URL query parameters to append
   * @returns The complete formatted URL
   */
  function buildUrl(
    path: string,
    useBaseUrl: boolean = true,
    params?: Record<string, string | number>,
    query?: Record<string, any>,
  ): string {
    let url = path

    // Replace params in URL (e.g., /users/:id -> /users/123)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url = url.replace(`:${key}`, encodeURIComponent(value))
      }
    }

    // Add base URL if needed
    if (useBaseUrl && !url.startsWith('http')) {
      const baseUrl = BASE_URL_API.replace(/\/+$/, '') // Remove trailing slashes
      const cleanPath = url.startsWith('/') ? url : `/${url}` // Ensure path has leading slash
      url = `${baseUrl}${cleanPath}`
    }

    // Add query string
    if (query) {
      const searchParams = new URLSearchParams()
      for (const [key, value] of Object.entries(query)) {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)))
          } else {
            searchParams.append(key, String(value))
          }
        }
      }
      const queryString = searchParams.toString()
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString
      }
    }

    return url
  }

  // Reactive params and query for dynamic updates
  const params = ref<Record<string, string | number>>(initialParams)
  const query = ref<Record<string, any>>(initialQuery)

  // Generate cache key if not provided
  const finalCacheKey = computed(
    () => cacheKey || generateCacheKey(toValue(url), params.value, query.value),
  )

  // Cache storage using VueUse's useStorage
  const cacheStorage = useStorage(finalCacheKey.value, {
    data: null as T | null,
    timestamp: 0,
    expires: 0,
  })

  // Reactive state management
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const statusCode = ref<number | null>(null)
  const retryCount = ref(0)
  const abortController = ref<AbortController | null>(null)

  // Build final URL with base API URL, params, and query
  const finalUrl = computed(() =>
    buildUrl(toValue(url), useBaseUrl, params.value, query.value),
  )

  // Check if cache is valid based on TTL
  const isCacheValid = computed(() => {
    if (!enableCache || !cacheStorage.value.timestamp) return false
    return Date.now() < cacheStorage.value.expires
  })

  /**
   * Retrieves data from cache if available and valid
   * @returns Cached data or null if not available/expired
   */
  const getFromCache = (): T | null => {
    if (isCacheValid.value && cacheStorage.value.data) {
      return cacheStorage.value.data
    }
    return null
  }

  /**
   * Saves data to cache with expiration timestamp
   * @param responseData - The data to cache
   */
  const saveToCache = (responseData: T) => {
    if (enableCache) {
      cacheStorage.value = {
        data: responseData,
        timestamp: Date.now(),
        expires: Date.now() + cacheTTL,
      }
    }
  }

  /** Clears the cache storage */
  const clearCache = () => {
    cacheStorage.value = {
      data: null,
      timestamp: 0,
      expires: 0,
    }
  }

  /**
   * Transforms the response data using the provided transform function
   * @param rawData - The raw data from the API
   * @returns Transformed data
   */
  const transformData = (rawData: any): T => {
    if (transform) {
      return transform(rawData)
    }
    return rawData
  }

  /**
   * Main fetch function that handles the actual API request
   * @param fetchUrl - Optional URL override
   * @param customOptions - Optional options override
   */
  const fetchData = async (
    fetchUrl?: string,
    customOptions?: FetchDataOptions<T>,
  ): Promise<void> => {
    const targetUrl = fetchUrl
      ? buildUrl(
          fetchUrl,
          customOptions?.useBaseUrl ?? useBaseUrl,
          params.value,
          query.value,
        )
      : finalUrl.value

    if (!targetUrl) {
      error.value = new Error('URL is required')
      return
    }

    // Check cache first and return if valid
    if (enableCache) {
      const cachedData = getFromCache()
      if (cachedData) {
        data.value = cachedData
        error.value = null
        loading.value = false
        return
      }
    }

    // Set loading state and reset error
    loading.value = true
    error.value = null
    retryCount.value = 0

    // Create new abort controller for request cancellation
    abortController.value = new AbortController()

    /**
     * Recursive function to execute the fetch with retry logic
     * @param currentRetry - Current retry attempt count
     */
    const executeFetch = async (currentRetry = 0): Promise<void> => {
      try {
        // Merge and filter options for useFetch
        const mergedOptions = {
          ...fetchOptions,
          ...(customOptions
            ? Object.fromEntries(
                Object.entries(customOptions).filter(
                  ([key]) =>
                    ![
                      'debounce',
                      'cache',
                      'cacheKey',
                      'cacheTTL',
                      'immediate',
                      'retry',
                      'retryDelay',
                      'useBaseUrl',
                      'transform',
                      'params',
                      'query',
                    ].includes(key),
                ),
              )
            : {}),
          signal: abortController.value?.signal,
          retry: 0, // We handle retry manually
        }

        // Unwrap refs/computeds to plain values for useFetch
        const validFetchOptions: Record<string, any> = {}
        for (const [k, v] of Object.entries(mergedOptions)) {
          validFetchOptions[k] =
            typeof v === 'object' && v !== null && 'value' in v ? v.value : v
        }

        // Special handling for 'timeout' option
        if (
          typeof validFetchOptions.timeout !== 'undefined' &&
          typeof validFetchOptions.timeout !== 'number'
        ) {
          validFetchOptions.timeout =
            Number(validFetchOptions.timeout) || undefined
        }

        // Special handling for 'body' option - convert to JSON if needed
        if (
          validFetchOptions.body &&
          typeof validFetchOptions.body === 'object' &&
          !(validFetchOptions.body instanceof Blob) &&
          !(validFetchOptions.body instanceof ArrayBuffer) &&
          !(validFetchOptions.body instanceof FormData) &&
          !(validFetchOptions.body instanceof URLSearchParams) &&
          !(
            typeof ReadableStream !== 'undefined' &&
            validFetchOptions.body instanceof ReadableStream
          )
        ) {
          // Convert plain object body to JSON string
          validFetchOptions.body = JSON.stringify(validFetchOptions.body)
          if (!validFetchOptions.headers) validFetchOptions.headers = {}
          if (!('Content-Type' in validFetchOptions.headers)) {
            validFetchOptions.headers['Content-Type'] = 'application/json'
          }
        }

        // Execute the fetch using Nuxt's useFetch
        const {
          data: responseData,
          error: fetchError,
          response,
        } = await useFetch<T>(targetUrl, validFetchOptions).json()

        if (fetchError.value) {
          throw new Error(fetchError.value.message || 'Fetch failed')
        }

        // Transform data if needed
        const transformedData = responseData.value
          ? transformData(responseData.value)
          : null

        // Update reactive state
        data.value = transformedData
        statusCode.value = response.value?.status ?? null

        // Save to cache if successful and caching is enabled
        if (enableCache && transformedData) {
          saveToCache(transformedData)
        }

        // Reset retry count on success
        retryCount.value = 0
      } catch (err) {
        error.value = err as Error

        // Retry logic with exponential backoff
        if (currentRetry < retry) {
          retryCount.value = currentRetry + 1
          await new Promise((resolve) => setTimeout(resolve, retryDelay))
          return executeFetch(currentRetry + 1)
        }
      } finally {
        if (currentRetry >= retry) {
          loading.value = false
        }
      }
    }

    await executeFetch()
  }

  // Create debounced version if debounce is enabled
  const debouncedFetch =
    debounce > 0 ? useDebounceFn(fetchData, debounce) : fetchData

  /**
   * Executes the fetch request with optional URL and options
   * @param executeUrl - Optional URL override
   * @param executeOptions - Optional options override
   */
  const execute = async (
    executeUrl?: string,
    executeOptions?: FetchDataOptions<T>,
  ) => {
    return debounce > 0
      ? debouncedFetch(executeUrl, executeOptions)
      : fetchData(executeUrl, executeOptions)
  }

  /**
   * Refreshes the data by clearing cache and re-executing the request
   */
  const refresh = async () => {
    if (enableCache) {
      clearCache()
    }
    return execute()
  }

  /** Aborts the ongoing request if it exists */
  const abort = () => {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
      loading.value = false
    }
  }

  /**
   * Updates URL path parameters and optionally triggers refetch
   * @param newParams - New parameters to merge with existing ones
   */
  const updateParams = (newParams: Record<string, string | number>) => {
    params.value = { ...params.value, ...newParams }
  }

  /**
   * Updates URL query parameters and optionally triggers refetch
   * @param newQuery - New query parameters to merge with existing ones
   */
  const updateQuery = (newQuery: Record<string, any>) => {
    query.value = { ...query.value, ...newQuery }
  }

  // Auto-execute if immediate is true
  if (immediate) {
    if (debounce > 0) {
      setTimeout(() => debouncedFetch(), debounce)
    } else {
      execute()
    }
  }

  // Watch for URL changes and re-execute if immediate is true
  if (isRef(url) || typeof url === 'function') {
    watchEffect(() => {
      if (immediate) {
        execute()
      }
    })
  }

  // Return the public API
  return {
    data: data as Ref<T | null>,
    loading: readonly(loading),
    error: readonly(error),
    statusCode: readonly(statusCode),
    refresh,
    abort,
    execute,
    updateParams,
    updateQuery,
  }
}

/**
 * Convenience methods for common HTTP methods with params and query support
 *
 * @example
 * // GET request
 * const { data } = useFetchDataMethods.get<User[]>('/api/users')
 *
 * @example
 * // POST request with body
 * const { execute } = useFetchDataMethods.post<User>('/api/users', userData)
 */
// export const useFetchDataMethods = {
//   /**
//    * Performs a GET request
//    * @param url - The request URL
//    * @param options - Fetch options
//    */
//   get: <T = any>(
//     url: MaybeRefOrGetter<string>,
//     options?: FetchDataOptions<T>,
//   ) => useFetchData<T>(url, { ...options, method: 'GET' }),

//   /**
//    * Performs a POST request
//    * @param url - The request URL
//    * @param body - The request body
//    * @param options - Fetch options
//    */
//   post: <T = any>(
//     url: MaybeRefOrGetter<string>,
//     body?: any,
//     options?: FetchDataOptions<T>,
//   ) => useFetchData<T>(url, { ...options, method: 'POST', body }),

//   /**
//    * Performs a PUT request
//    * @param url - The request URL
//    * @param body - The request body
//    * @param options - Fetch options
//    */
//   put: <T = any>(
//     url: MaybeRefOrGetter<string>,
//     body?: any,
//     options?: FetchDataOptions<T>,
//   ) => useFetchData<T>(url, { ...options, method: 'PUT', body }),

//   /**
//    * Performs a PATCH request
//    * @param url - The request URL
//    * @param body - The request body
//    * @param options - Fetch options
//    */
//   patch: <T = any>(
//     url: MaybeRefOrGetter<string>,
//     body?: any,
//     options?: FetchDataOptions<T>,
//   ) => useFetchData<T>(url, { ...options, method: 'PATCH', body }),

//   /**
//    * Performs a DELETE request
//    * @param url - The request URL
//    * @param options - Fetch options
//    */
//   delete: <T = any>(
//     url: MaybeRefOrGetter<string>,
//     options?: FetchDataOptions<T>,
//   ) => useFetchData<T>(url, { ...options, method: 'DELETE' }),
// }

// Export BASE_URL_API for external use
export { BASE_URL_API }
