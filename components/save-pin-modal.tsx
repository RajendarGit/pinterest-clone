"use client"

import { useState, useEffect } from "react"
import { Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateBoardModal } from "./create-board-modal"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { addPin } from "@/lib/store/slices/pinsSlice"
import type { Pin } from "@/lib/store/slices/pinsSlice"
import Image from "next/image"

interface SavePinModalProps {
  pin: Pin
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SavePinModal({ pin, open, onOpenChange }: SavePinModalProps) {
  const dispatch = useAppDispatch()
  const { boards } = useAppSelector((state) => state.boards)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [saving, setSaving] = useState(false)

  const filteredBoards = boards.filter((board) => board.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSaveToBoard = async (boardId: string) => {
    setSaving(true)
    setSelectedBoard(boardId)

    try {
      // Create a new pin instance for the selected board
      const newPin: Pin = {
        ...pin,
        id: `${pin.id}-${boardId}-${Date.now()}`, // Create unique ID for the saved pin
        board_id: boardId,
        created_at: new Date().toISOString(),
      }

      dispatch(addPin(newPin))

      // Close modal after short delay to show success state
      setTimeout(() => {
        onOpenChange(false)
        setSelectedBoard(null)
        setSearchQuery("")
      }, 1000)
    } catch (error) {
      console.error("Failed to save pin:", error)
      setSelectedBoard(null)
    } finally {
      setSaving(false)
    }
  }

  const handleCreateBoard = () => {
    setShowCreateBoard(true)
  }

  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSelectedBoard(null)
    }
  }, [open])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save to board</DialogTitle>
            <DialogDescription>Choose a board to save this pin to</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search boards */}
            <Input
              placeholder="Search boards"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border focus:ring-primary"
            />

            {/* Create new board option */}
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleCreateBoard}>
              <Plus className="w-4 h-4 mr-2" />
              Create board
            </Button>

            {/* Boards list */}
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {filteredBoards.map((board) => (
                  <Button
                    key={board.id}
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto rounded-md hover:bg-gray-100"
                    onClick={() => handleSaveToBoard(board.id)}
                    disabled={saving}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                        {board.cover_image_url ? (
                          <Image
                            src={board.cover_image_url || "/placeholder.svg"}
                            alt={board.title}
                            className="w-full h-full object-cover"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {board.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">{board.title}</p>
                        <p className="text-sm text-muted-foreground">{board.pin_count || 0} pins</p>
                      </div>
                    </div>
                    {selectedBoard === board.id && saving ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : selectedBoard === board.id ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : null}
                  </Button>
                ))}

                {filteredBoards.length === 0 && searchQuery && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No boards found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <CreateBoardModal open={showCreateBoard} onOpenChange={setShowCreateBoard} />
    </>
  )
}
