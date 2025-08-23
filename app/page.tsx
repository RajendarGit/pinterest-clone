"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { MasonryGrid } from "@/components/masonry-grid";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { fetchPins } from "@/lib/store/slices/pinsSlice";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { pins, loading, hasMore, page } = useAppSelector(
    (state) => state.pins
  );

  useEffect(() => {
    // Load initial pins
    if (pins.length === 0) {
      dispatch(fetchPins({ page: 1 }));
    }
  }, [dispatch, pins.length]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchPins({ page }));
    }
  };

  return (
    <>
      {pins.length === 0 && loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading amazing pins...</span>
          </div>
        </div>
      ) : (
        <MasonryGrid
          pins={pins}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loading={loading}
        />
      )}
    </>
  );
}
