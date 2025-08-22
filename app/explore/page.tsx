"use client"

import { useEffect, useState } from "react"
import { Search, TrendingUp, Users, Bookmark } from "lucide-react"
import { Header } from "@/components/header"
import { MasonryGrid } from "@/components/masonry-grid"
import { UserCard } from "@/components/user-card"
import { BoardCard } from "@/components/board-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { fetchPins } from "@/lib/store/slices/pinsSlice"
import { fetchSuggestedUsers } from "@/lib/store/slices/socialSlice"

const trendingTopics = [
  "Home Decor",
  "Fashion",
  "Food & Recipes",
  "Travel",
  "DIY Projects",
  "Wedding Ideas",
  "Art & Design",
  "Photography",
  "Fitness",
  "Beauty",
]

export default function ExplorePage() {
  const dispatch = useAppDispatch()
  const { pins, loading: pinsLoading } = useAppSelector((state) => state.pins)
  const { suggestedUsers, loading: usersLoading } = useAppSelector((state) => state.social)
  const { boards } = useAppSelector((state) => state.boards)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchPins({ page: 1 }))
    dispatch(fetchSuggestedUsers())
  }, [dispatch])

  const handleLoadMore = () => {
    // Mock load more functionality
    console.log("Load more explore content")
  }

  const filteredPins = pins.filter((pin) => {
    const matchesSearch =
      !searchQuery ||
      pin.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTopic =
      !selectedTopic ||
      pin.title?.toLowerCase().includes(selectedTopic.toLowerCase()) ||
      pin.description?.toLowerCase().includes(selectedTopic.toLowerCase())

    return matchesSearch && matchesTopic
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Explore</h1>
          <p className="text-muted-foreground mb-6">Discover trending ideas and popular creators</p>

          {/* Search */}
          <div className="max-w-md mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search ideas"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border focus:ring-primary"
              />
            </div>
          </div>

          {/* Trending Topics */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Trending topics
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTopic === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTopic(null)}
                className={selectedTopic === null ? "bg-primary text-primary-foreground" : "bg-transparent"}
              >
                All
              </Button>
              {trendingTopics.map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTopic(topic)}
                  className={selectedTopic === topic ? "bg-primary text-primary-foreground" : "bg-transparent"}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="pins" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="pins" className="flex items-center">
              <Bookmark className="w-4 h-4 mr-2" />
              Pins
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              People
            </TabsTrigger>
            <TabsTrigger value="boards" className="flex items-center">
              <Bookmark className="w-4 h-4 mr-2" />
              Boards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pins">
            {pinsLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Loading pins...</span>
                </div>
              </div>
            ) : (
              <MasonryGrid pins={filteredPins} onLoadMore={handleLoadMore} hasMore={true} loading={false} />
            )}
          </TabsContent>

          <TabsContent value="people">
            {usersLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Loading people...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {suggestedUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="boards">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
