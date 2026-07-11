export type IntersectionObserverCallback = (
  entry: IntersectionObserverEntry
) => void

const observers = new Map<string, IntersectionObserver>()
const callbacks = new Map<Element, IntersectionObserverCallback>()
const elementOptions = new Map<Element, string>()

function getKey(options: IntersectionObserverInit = {}): string {
  const rootMargin = options.rootMargin ?? '0px'
  const threshold = Array.isArray(options.threshold)
    ? options.threshold.join(',')
    : options.threshold
  return `${rootMargin}|${threshold}`
}

function createObserver(
  key: string,
  options: IntersectionObserverInit
): IntersectionObserver {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const callback = callbacks.get(entry.target)
      callback?.(entry)
    })
  }, options)
  observers.set(key, observer)
  return observer
}

export function observe(
  element: Element,
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): () => void {
  if (!element) return () => {}

  if (typeof IntersectionObserver === 'undefined') {
    callback({
      isIntersecting: true,
      target: element,
      time: 0,
      boundingClientRect:
        element.getBoundingClientRect?.() ?? ({} as DOMRectReadOnly),
      intersectionRatio: 1,
      intersectionRect:
        element.getBoundingClientRect?.() ?? ({} as DOMRectReadOnly),
      rootBounds: null,
    } as IntersectionObserverEntry)
    return () => {}
  }

  const key = getKey(options)
  elementOptions.set(element, key)
  callbacks.set(element, callback)

  let observer = observers.get(key)
  if (!observer) {
    observer = createObserver(key, options ?? {})
  }
  observer.observe(element)

  return () => unobserve(element)
}

export function unobserve(element: Element): void {
  if (!element) return
  const key = elementOptions.get(element)
  if (key) {
    const observer = observers.get(key)
    if (observer) observer.unobserve(element)
  }
  callbacks.delete(element)
  elementOptions.delete(element)
}

export function resetSharedIntersectionObserver(): void {
  observers.forEach(observer => observer.disconnect())
  observers.clear()
  callbacks.clear()
  elementOptions.clear()
}
