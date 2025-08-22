"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAppDispatch } from "@/lib/hooks/redux"
import { updateBoard } from "@/lib/store/slices/boardsSlice"
import type { Board } from "@/lib/store/slices/boardsSlice"

interface EditBoardModalProps {
  board: Board
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBoardModal({ board, open, onOpenChange }: EditBoardModalProps) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && board) {
      setTitle(board.title)
      setDescription(board.description || "")
      setIsPrivate(board.is_private)
    }
  }, [open, board])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)

    try {
      const updatedBoard = {
        ...board,
        title: title.trim(),
        description: description.trim() || undefined,
        is_private: isPrivate,
      }

      dispatch(updateBoard(updatedBoard))
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update board:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit board</DialogTitle>
          <DialogDescription>Update your board details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Name</Label>
            <Input
              id="edit-title"
              placeholder="Board name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Textarea
              id="edit-description"
              placeholder="What's your board about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border-border focus:ring-primary resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="edit-privacy">Keep this board secret</Label>
              <p className="text-sm text-muted-foreground">So only you and collaborators can see it</p>
            </div>
            <Switch id="edit-privacy" checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!title.trim() || isLoading}
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
