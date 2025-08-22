"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Heart, Share, Download, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { SavePinModal } from "@/components/save-pin-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppSelector } from "@/lib/hooks/redux"
import type { Pin } from "@/lib/store/slices/pinsSlice"

export default function PinDetailPage() {
  const params = useParams()
  const pinId = params.id as string
  const { pins } = useAppSelector((state) => state.pins)
  const [pin, setPin] = useState<Pin | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundPin = pins.find((p) => p.id === pinId)
    setPin(foundPin || null)
    setLoading(false)
  }, [pinId, pins])

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleShare = () => {
    const pinUrl = `${window.location.origin}/pin/${pinId}`
    navigator.clipboard.writeText(pinUrl)
    // TODO: Show toast notification
  }

  const handleDownload = async () => {
    if (!pin) return

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
    } catch (error) {
      console.error("Failed to download image:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Loading pin...</span>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!pin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-2">Pin not found</h1>
            <p className="text-muted-foreground mb-6">The pin you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pin Image */}
            <div className="flex justify-center">
              <Card className="overflow-hidden border-border max-w-lg w-full">
                <div className="relative">
                  <Image
                    src={pin.image_url || "/placeholder.svg"}
                    alt={pin.alt_text || pin.title || "Pin image"}
                    width={pin.width}
                    height={pin.height}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </Card>
            </div>

            {/* Pin Details */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button onClick={handleLike} variant="ghost" size="sm" className="rounded-full p-2">
                    <Heart className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                  </Button>
                  <Button onClick={handleShare} variant="ghost" size="sm" className="rounded-full p-2">
                    <Share className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button onClick={handleDownload} variant="ghost" size="sm" className="rounded-full p-2">
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full p-2">
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>

                <Button
                  onClick={() => setShowSaveModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Save
                </Button>
              </div>

              {/* Pin Info */}
              <div>
                {pin.title && <h1 className="text-2xl font-bold text-foreground mb-4">{pin.title}</h1>}
                {pin.description && <p className="text-muted-foreground mb-6">{pin.description}</p>}
              </div>

              {/* User Info */}
              {pin.user && (
                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Link href={`/user/${pin.user.username}`}>
                        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                          {pin.user.avatar_url ? (
                            <Image
                              src={pin.user.avatar_url || "/placeholder.svg"}
                              alt={pin.user.display_name || pin.user.username}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {(pin.user.display_name || pin.user.username).charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1">
                        <Link
                          href={`/user/${pin.user.username}`}
                          className="font-semibold text-foreground hover:text-primary"
                        >
                          {pin.user.display_name || pin.user.username}
                        </Link>
                        <p className="text-sm text-muted-foreground">@{pin.user.username}</p>
                      </div>

                      <Button variant="outline" size="sm" className="bg-transparent">
                        Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Source Link */}
              {pin.source_url && (
                <Card className="border-border">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">Source</h3>
                    <a
                      href={pin.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 break-all"
                    >
                      {pin.source_url}
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      <SavePinModal pin={pin} open={showSaveModal} onOpenChange={setShowSaveModal} />
    </>
  )
}
