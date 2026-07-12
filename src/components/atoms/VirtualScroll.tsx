import React, { useState, useRef, useMemo, useCallback } from 'react'

interface VirtualScrollProps {
  items: any[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: any, index: number) => React.ReactNode
  overscan?: number
  className?: string
}

/**
 * Virtual scrolling component for efficient rendering of large lists
 *
 * Features:
 * - Only renders visible items + overscan
 * - Smooth scrolling performance
 * - Memory efficient
 * - Customizable overscan for smoother scrolling
 */
export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className: _className = '',
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    )
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (scrollElementRef.current) {
      setScrollTop(scrollElementRef.current.scrollTop)
    }
  }, [])

  // Visible items to render
  const visibleItems = useMemo(() => {
    const result = []
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      result.push({
        item: items[i],
        index: i,
        top: i * itemHeight,
      })
    }
    return result
  }, [visibleRange, items, itemHeight])

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${_className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, top }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Hook for virtual scrolling implementation
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useVirtualScroll = (
  items: any[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    )
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  const totalHeight = items.length * itemHeight

  const visibleItems = useMemo(() => {
    const result = []
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      result.push({
        item: items[i],
        index: i,
        top: i * itemHeight,
      })
    }
    return result
  }, [visibleRange, items, itemHeight])

  const scrollProps = {
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    },
  }

  return {
    visibleRange,
    visibleItems,
    totalHeight,
    scrollProps,
    scrollTop,
  }
}

/**
 * Grid virtual scrolling component
 */
interface VirtualGridProps {
  items: any[]
  itemWidth: number
  itemHeight: number
  containerWidth: number
  containerHeight: number
  renderItem: (item: any, index: number) => React.ReactNode
  gap?: number
  overscan?: number
  className?: string
}

export const VirtualGrid: React.FC<VirtualGridProps> = ({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  renderItem,
  gap = 0,
  overscan = 2,
  className = '',
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  // Calculate columns and rows
  const columns = Math.floor((containerWidth + gap) / (itemWidth + gap))
  const rows = Math.ceil(items.length / columns)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startRow = Math.max(
      0,
      Math.floor(scrollTop / (itemHeight + gap)) - overscan
    )
    const endRow = Math.min(
      rows - 1,
      Math.ceil((scrollTop + containerHeight) / (itemHeight + gap)) + overscan
    )

    const startCol = Math.max(
      0,
      Math.floor(scrollLeft / (itemWidth + gap)) - overscan
    )
    const endCol = Math.min(
      columns - 1,
      Math.ceil((scrollLeft + containerWidth) / (itemWidth + gap)) + overscan
    )

    return { startRow, endRow, startCol, endCol }
  }, [
    scrollTop,
    scrollLeft,
    itemHeight,
    itemWidth,
    containerHeight,
    containerWidth,
    gap,
    overscan,
    rows,
    columns,
  ])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (scrollElementRef.current) {
      setScrollTop(scrollElementRef.current.scrollTop)
      setScrollLeft(scrollElementRef.current.scrollLeft)
    }
  }, [])

  // Visible items to render
  const visibleItems = useMemo(() => {
    const result = []

    for (let row = visibleRange.startRow; row <= visibleRange.endRow; row++) {
      for (let col = visibleRange.startCol; col <= visibleRange.endCol; col++) {
        const index = row * columns + col
        if (index < items.length) {
          result.push({
            item: items[index],
            index,
            top: row * (itemHeight + gap),
            left: col * (itemWidth + gap),
          })
        }
      }
    }

    return result
  }, [visibleRange, items, columns, itemHeight, itemWidth, gap])

  const totalWidth = columns * (itemWidth + gap) - gap
  const totalHeight = rows * (itemHeight + gap) - gap

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight, width: containerWidth }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: totalHeight,
          width: totalWidth,
          position: 'relative',
        }}
      >
        {visibleItems.map(({ item, index, top, left }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top,
              left,
              width: itemWidth,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualScroll
