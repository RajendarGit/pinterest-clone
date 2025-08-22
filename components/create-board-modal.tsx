"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAppDispatch } from "@/lib/hooks/redux"
import { addBoard } from "@/lib/store/slices/boardsSlice"

interface CreateBoardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBoardModal({ open, onOpenChange }: CreateBoardModalProps) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)

    try {
      // In a real app, this would make an API call
      const newBoard = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim() || undefined,
        is_private: isPrivate,
        user_id: "demo-user",
        created_at: new Date().toISOString(),
        pin_count: 0,
      }

      dispatch(addBoard(newBoard))

      // Reset form
      setTitle("")
      setDescription("")
      setIsPrivate(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create board:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create board</DialogTitle>
          <DialogDescription>Create a new board to organize your pins</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Name</Label>
            <Input
              id="title"
              placeholder="Like 'Places to go' or 'Recipes to make'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What's your board about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border-border focus:ring-primary resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="privacy">Keep this board secret</Label>
              <p className="text-sm text-muted-foreground">So only you and collaborators can see it</p>
            </div>
            <Switch id="privacy" checked={isPrivate} onCheckedChange={setIsPrivate} />
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
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
