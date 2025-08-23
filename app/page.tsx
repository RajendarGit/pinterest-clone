"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { MasonryGrid } from "@/components/masonry-grid";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { fetchPins } from "@/lib/store/slices/pinsSlice";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { pins, loading, hasMore, page } = useAppSelector((state) => state.pins);

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (pins.length === 0) {
      dispatch(fetchPins({ page: 1 }));
    }
  }, [dispatch, pins.length]);

  const handleLoadMore = () => {
    if (!loading && hasMore && !query) {
      dispatch(fetchPins({ page }));
    }
  };

  // 🔥 Filter pins based on alt_text/title/description
  const filteredPins = query
    ? pins.filter((pin) =>
        (pin.alt_text?.toLowerCase().includes(query.toLowerCase()) ||
         pin.title?.toLowerCase().includes(query.toLowerCase()) ||
         pin.description?.toLowerCase().includes(query.toLowerCase()))
      )
    : pins;

  return (
    <>
      <Header onSearch={setQuery} />
      {filteredPins.length === 0 && loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading amazing pins...</span>
          </div>
        </div>
      ) : filteredPins.length === 0 && query ? (
        <div className="text-center text-muted-foreground py-10">
          No results found for "{query}"
        </div>
      ) : (
        <MasonryGrid
          pins={filteredPins}
          onLoadMore={handleLoadMore}
          hasMore={!query && hasMore}
          loading={loading}
        />
      )}
    </>
  );
}
