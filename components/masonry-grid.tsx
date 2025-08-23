"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { PinCard } from "./pin-card"
import type { Pin } from "@/lib/store/slices/pinsSlice"
import Loading from "./loading"
import ReachedTheEnd from "./reached-the-end"

interface MasonryGridProps {
  pins: Pin[]
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
}

interface GridItem {
  pin: Pin
  column: number
  top: number
  height: number
}

export function MasonryGrid({ pins, onLoadMore, hasMore, loading }: MasonryGridProps) {
  const [gridItems, setGridItems] = useState<GridItem[]>([])
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const observerRef = useRef<IntersectionObserver | null>(null)

  const COLUMN_WIDTH = 280
  const GAP = 16
  const PADDING = 16

  const getColumnCount = useCallback((width: number) => {
    const availableWidth = width - PADDING * 2
    return Math.max(1, Math.floor((availableWidth + GAP) / (COLUMN_WIDTH + GAP)))
  }, [])

  const calculateLayout = useCallback(
    (pins: Pin[], containerWidth: number) => {
      const columnCount = getColumnCount(containerWidth)
      const columnHeights = new Array(columnCount).fill(0)
      const items: GridItem[] = []

      pins.forEach((pin) => {
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
        const aspectRatio = pin.height / pin.width
        const cardHeight = Math.floor(COLUMN_WIDTH * aspectRatio) + 120

        items.push({
          pin,
          column: shortestColumnIndex,
          top: columnHeights[shortestColumnIndex],
          height: cardHeight,
        })

        columnHeights[shortestColumnIndex] += cardHeight + GAP
      })

      return items
    },
    [getColumnCount],
  )

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Recalculate layout
  useEffect(() => {
    if (containerWidth > 0) {
      setGridItems(calculateLayout(pins, containerWidth))
    }
  }, [pins, containerWidth, calculateLayout])

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 },
    )

    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [hasMore, loading, onLoadMore])

  const columnCount = getColumnCount(containerWidth)
  const totalHeight = Math.max(
    ...new Array(columnCount).fill(0).map((_, colIndex) => {
      const columnItems = gridItems.filter((item) => item.column === colIndex)
      return columnItems.reduce((height, item) => Math.max(height, item.top + item.height), 0)
    }),
  )

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="relative mx-auto"
        style={{
          width: Math.min(
            containerWidth - PADDING * 2,
            columnCount * (COLUMN_WIDTH + GAP) - GAP
          ),
          height: totalHeight,
        }}
      >
        {gridItems.map((item, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: item.column * (COLUMN_WIDTH + GAP),
              top: item.top,
              width: COLUMN_WIDTH,
            }}
          >
            <PinCard pin={item.pin} />
          </div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {loading && <Loading />}
        {!hasMore && pins.length > 0 && <ReachedTheEnd />}
      </div>
    </div>
  );
}
