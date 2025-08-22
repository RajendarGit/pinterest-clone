"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Header } from "@/components/header"
import { BoardCard } from "@/components/board-card"
import { CreateBoardModal } from "@/components/create-board-modal"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { setBoards } from "@/lib/store/slices/boardsSlice"
import type { Board } from "@/lib/store/slices/boardsSlice"
import Loading from "./loading"

export default function BoardsPage() {
  const dispatch = useAppDispatch()
  const { boards, loading } = useAppSelector((state) => state.boards)
  const { user } = useAppSelector((state) => state.auth)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    // Load user's boards - for now using mock data
    const mockBoards: Board[] = [
      {
        id: "1",
        title: "Home Decor Ideas",
        description: "Beautiful interior design inspiration",
        is_private: false,
        cover_image_url: "/modern-home-interior.png",
        user_id: "demo-user",
        created_at: new Date().toISOString(),
        pin_count: 24,
      },
      {
        id: "2",
        title: "Recipe Collection",
        description: "Delicious recipes to try",
        is_private: false,
        cover_image_url: "/delicious-food-recipes.png",
        user_id: "demo-user",
        created_at: new Date().toISOString(),
        pin_count: 18,
      },
      {
        id: "3",
        title: "Travel Dreams",
        description: "Places I want to visit someday",
        is_private: true,
        cover_image_url: "/diverse-travel-destinations.png",
        user_id: "demo-user",
        created_at: new Date().toISOString(),
        pin_count: 42,
      },
      {
        id: "4",
        title: "Fashion Inspiration",
        description: "Style ideas and outfit inspiration",
        is_private: false,
        cover_image_url: "/diverse-fashion-outfits.png",
        user_id: "demo-user",
        created_at: new Date().toISOString(),
        pin_count: 31,
      },
    ]

    dispatch(setBoards(mockBoards))
  }, [dispatch])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your boards</h1>
            <p className="text-muted-foreground mt-2">Organize your pins into themed collections</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create board
          </Button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}

        {boards.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No boards yet</h3>
            <p className="text-muted-foreground mb-6">Create your first board to start organizing your pins</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create your first board
            </Button>
          </div>
        )}
      </main>

      <CreateBoardModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}
