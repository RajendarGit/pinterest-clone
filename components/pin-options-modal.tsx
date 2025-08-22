"use client"

import { useState } from "react"
import { Download, ExternalLink, Flag, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MovePinModal } from "./move-pin-modal"
import { useAppDispatch } from "@/lib/hooks/redux"
import { removePin } from "@/lib/store/slices/pinsSlice"
import type { Pin } from "@/lib/store/slices/pinsSlice"

interface PinOptionsModalProps {
  pin: Pin
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PinOptionsModal({ pin, open, onOpenChange }: PinOptionsModalProps) {
  const dispatch = useAppDispatch()
  const [showMoveModal, setShowMoveModal] = useState(false)

  const handleDownload = async () => {
    try {
      const response = await fetch(pin.image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `pin-${pin.id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to download image:", error)
    }
  }

  const handleVisitSource = () => {
    if (pin.source_url) {
      window.open(pin.source_url, "_blank")
    }
    onOpenChange(false)
  }

  const handleMove = () => {
    setShowMoveModal(true)
    onOpenChange(false)
  }

  const handleDelete = () => {
    dispatch(removePin(pin.id))
    onOpenChange(false)
  }

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log("Report pin:", pin.id)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Pin options</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-3" />
              Download image
            </Button>

            {pin.source_url && (
              <Button variant="ghost" className="w-full justify-start" onClick={handleVisitSource}>
                <ExternalLink className="w-4 h-4 mr-3" />
                Visit source
              </Button>
            )}

            {pin.board_id && (
              <Button variant="ghost" className="w-full justify-start" onClick={handleMove}>
                <Edit className="w-4 h-4 mr-3" />
                Move to board
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-primary-foreground"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete pin
            </Button>

            <Button variant="ghost" className="w-full justify-start" onClick={handleReport}>
              <Flag className="w-4 h-4 mr-3" />
              Report pin
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MovePinModal pin={pin} open={showMoveModal} onOpenChange={setShowMoveModal} />
    </>
  )
}
