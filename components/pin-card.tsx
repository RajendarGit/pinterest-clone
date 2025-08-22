"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SavePinModal } from "./save-pin-modal"
import { PinOptionsModal } from "./pin-options-modal"
import type { Pin } from "@/lib/store/slices/pinsSlice"

interface PinCardProps {
  pin: Pin
}

export function PinCard({ pin }: PinCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(!liked)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowSaveModal(true)
  }

  const handleOptions = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowOptionsModal(true)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Copy pin URL to clipboard
    const pinUrl = `${window.location.origin}/pin/${pin.id}`
    navigator.clipboard.writeText(pinUrl)
    // TODO: Show toast notification
  }

  return (
    <>
      <Card
        className="group cursor-pointer overflow-hidden bg-card hover:shadow-lg transition-all duration-200 shadow-2xl border-0 p-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={pin.image_url || "/placeholder.svg"}
              alt={pin.alt_text || pin.title || "Pin image"}
              width={pin.width}
              height={pin.height}
              className={`w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay with actions */}
            <div
              className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>

              <div className="absolute bottom-3 right-3 flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full p-2 bg-white/90 hover:bg-white"
                  onClick={handleLike}
                >
                  <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full p-2 bg-white/90 hover:bg-white"
                  onClick={handleShare}
                >
                  <Share className="w-4 h-4 text-gray-700" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full p-2 bg-white/90 hover:bg-white"
                  onClick={handleOptions}
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-700" />
                </Button>
              </div>
            </div>
          </div>

          {/* Pin info */}
          <div className="p-3">
            {pin.title && <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-2">{pin.title}</h3>}

            {pin.user && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
                  {pin.user.avatar_url ? (
                    <Image
                      src={pin.user.avatar_url || "/placeholder.svg"}
                      alt={pin.user.display_name || pin.user.username}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {(pin.user.display_name || pin.user.username).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {pin.user.display_name || pin.user.username}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <SavePinModal pin={pin} open={showSaveModal} onOpenChange={setShowSaveModal} />

      <PinOptionsModal pin={pin} open={showOptionsModal} onOpenChange={setShowOptionsModal} />
    </>
  )
}
