"use client"

import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Activity } from "@/lib/store/slices/socialSlice"

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "pin_created":
        return "created a new pin"
      case "board_created":
        return "created a new board"
      case "user_followed":
        return "started following"
      case "pin_liked":
        return "liked a pin"
      case "pin_commented":
        return "commented on a pin"
      default:
        return "had some activity"
    }
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "pin_liked":
        return <Heart className="w-4 h-4 text-red-500" />
      case "pin_commented":
        return <MessageCircle className="w-4 h-4 text-blue-500" />
      case "user_followed":
        return <UserPlus className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No activity yet</h3>
        <p className="text-muted-foreground mb-6">Follow some people to see their latest pins and boards here</p>
        <Button asChild>
          <Link href="/people">Discover people</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <Card key={activity.id} className="bg-transparent shadow-2xl border-0">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {/* User avatar */}
              <Link href={`/user/${activity.user.username}`}>
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                  {activity.user.avatar_url ? (
                    <Image
                      src={activity.user.avatar_url || "/placeholder.svg"}
                      alt={activity.user.display_name || activity.user.username}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {(activity.user.display_name || activity.user.username).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                {/* Activity header */}
                <div className="flex items-center space-x-2 mb-2">
                  <Link
                    href={`/user/${activity.user.username}`}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {activity.user.display_name || activity.user.username}
                  </Link>
                  <span className="text-muted-foreground">{getActivityText(activity)}</span>
                  {activity.target_user && (
                    <Link
                      href={`/user/${activity.target_user.username}`}
                      className="font-semibold text-foreground hover:text-primary"
                    >
                      {activity.target_user.display_name || activity.target_user.username}
                    </Link>
                  )}
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity content */}
                <div className="flex items-center space-x-4">
                  {activity.pin && (
                    <Link href={`/pin/${activity.pin.id}`} className="flex items-center space-x-3 group">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={activity.pin.image_url || "/placeholder.svg"}
                          alt={activity.pin.title || "Pin"}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      {activity.pin.title && (
                        <span className="text-sm text-foreground group-hover:text-primary">{activity.pin.title}</span>
                      )}
                    </Link>
                  )}

                  {activity.board && (
                    <Link href={`/boards/${activity.board.id}`} className="flex items-center space-x-3 group">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        {activity.board.cover_image_url ? (
                          <Image
                            src={activity.board.cover_image_url || "/placeholder.svg"}
                            alt={activity.board.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {activity.board.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-foreground group-hover:text-primary">{activity.board.title}</span>
                    </Link>
                  )}
                </div>

                {/* Timestamp */}
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
