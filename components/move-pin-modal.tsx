"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { removePin, addPin } from "@/lib/store/slices/pinsSlice"
import type { Pin } from "@/lib/store/slices/pinsSlice"

interface MovePinModalProps {
  pin: Pin
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovePinModal({ pin, open, onOpenChange }: MovePinModalProps) {
  const dispatch = useAppDispatch()
  const { boards } = useAppSelector((state) => state.boards)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const [moving, setMoving] = useState(false)

  const filteredBoards = boards.filter(
    (board) => board.title.toLowerCase().includes(searchQuery.toLowerCase()) && board.id !== pin.board_id, // Exclude current board
  )

  const currentBoard = boards.find((board) => board.id === pin.board_id)

  const handleMoveToBoard = async (boardId: string) => {
    setMoving(true)
    setSelectedBoard(boardId)

    try {
      // Remove pin from current location
      dispatch(removePin(pin.id))

      // Add pin to new board
      const movedPin: Pin = {
        ...pin,
        board_id: boardId,
        updated_at: new Date().toISOString(),
      }

      dispatch(addPin(movedPin))

      // Close modal after short delay to show success state
      setTimeout(() => {
        onOpenChange(false)
        setSelectedBoard(null)
        setSearchQuery("")
      }, 1000)
    } catch (error) {
      console.error("Failed to move pin:", error)
      setSelectedBoard(null)
    } finally {
      setMoving(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSelectedBoard(null)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move pin</DialogTitle>
          <DialogDescription>Move this pin from "{currentBoard?.title}" to another board</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search boards */}
          <Input
            placeholder="Search boards"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border focus:ring-primary"
          />

          {/* Current board indicator */}
          {currentBoard && (
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-primary">{currentBoard.title.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{currentBoard.title}</p>
                <p className="text-sm text-muted-foreground">Current board</p>
              </div>
            </div>
          )}

          {/* Boards list */}
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {filteredBoards.map((board) => (
                <Button
                  key={board.id}
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto"
                  onClick={() => handleMoveToBoard(board.id)}
                  disabled={moving}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                      {board.cover_image_url ? (
                        <img
                          src={board.cover_image_url || "/placeholder.svg"}
                          alt={board.title}
                          className="w-full h-full object-cover"
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
                  {selectedBoard === board.id && moving ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : selectedBoard === board.id ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
              ))}

              {filteredBoards.length === 0 && searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No boards found matching "{searchQuery}"</p>
                </div>
              )}

              {filteredBoards.length === 0 && !searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No other boards available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
