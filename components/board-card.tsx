"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal, Lock, Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditBoardModal } from "./edit-board-modal"
import { DeleteBoardModal } from "./delete-board-modal"
import type { Board } from "@/lib/store/slices/boardsSlice"

interface BoardCardProps {
  board: Board
}

export function BoardCard({ board }: BoardCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <>
      <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-200 card-theme">
        <Link href={`/boards/${board.id}`}>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={board.cover_image_url || "/placeholder.svg?height=300&width=400&query=board+cover"}
              alt={board.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* Privacy indicator */}
            {board.is_private && (
              <div className="absolute top-3 left-3 bg-black/60 rounded-full p-1">
                <Lock className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Actions menu */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full p-2 bg-white/90 hover:bg-white"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      setShowEditModal(true)
                    }}
                    className="focus:text-primary-foreground"
                  >
                    <Edit className="w-4 h-4 mr-2 focus:text-primary-foreground" />
                    Edit board
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      setShowDeleteModal(true)
                    }}
                    className="text-destructive focus:text-primary-foreground"
                  >
                    <Trash2 className="w-4 h-4 mr-2 focus:text-primary-foreground" />
                    Delete board
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Link>

        <CardContent className="p-4">
          <Link href={`/boards/${board.id}`}>
            <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {board.title}
            </h3>
            {board.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{board.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {board.pin_count || 0} {board.pin_count === 1 ? "pin" : "pins"}
            </p>
          </Link>
        </CardContent>
      </Card>

      <EditBoardModal board={board} open={showEditModal} onOpenChange={setShowEditModal} />
      <DeleteBoardModal board={board} open={showDeleteModal} onOpenChange={setShowDeleteModal} />
    </>
  )
}
