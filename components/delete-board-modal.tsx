"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppDispatch } from "@/lib/hooks/redux"
import { removeBoard } from "@/lib/store/slices/boardsSlice"
import type { Board } from "@/lib/store/slices/boardsSlice"

interface DeleteBoardModalProps {
  board: Board
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteBoardModal({ board, open, onOpenChange }: DeleteBoardModalProps) {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would make an API call
      dispatch(removeBoard(board.id))
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to delete board:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete board</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{board.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete board"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
