"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { UserPlus, UserCheck, MapPin, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/lib/hooks/redux"
import { followUser, unfollowUser } from "@/lib/store/slices/socialSlice"
import type { User } from "@/lib/store/slices/socialSlice"

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const dispatch = useAppDispatch()
  const [isFollowing, setIsFollowing] = useState(user.is_following || false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollowToggle = async () => {
    setIsLoading(true)

    try {
      if (isFollowing) {
        dispatch(unfollowUser(user.id))
        setIsFollowing(false)
      } else {
        dispatch(followUser(user.id))
        setIsFollowing(true)
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center">
        <Link href={`/user/${user.username}`}>
          <div className="w-20 h-20 rounded-full bg-muted overflow-hidden mx-auto mb-4">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url || "/placeholder.svg"}
                alt={user.display_name || user.username}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <span className="text-xl font-medium text-primary">
                  {(user.display_name || user.username).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </Link>

        <Link href={`/user/${user.username}`}>
          <h3 className="font-semibold text-foreground hover:text-primary mb-1">
            {user.display_name || user.username}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">@{user.username}</p>
        </Link>

        {user.bio && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{user.bio}</p>}

        {user.location && (
          <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            {user.location}
          </div>
        )}

        {user.website_url && (
          <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
            <ExternalLink className="w-4 h-4 mr-1" />
            <a
              href={user.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary truncate"
            >
              {user.website_url.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        <div className="flex justify-center space-x-6 text-sm mb-4">
          <div className="text-center">
            <p className="font-semibold text-foreground">{user.follower_count.toLocaleString()}</p>
            <p className="text-muted-foreground">followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">{user.pin_count.toLocaleString()}</p>
            <p className="text-muted-foreground">pins</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">{user.board_count}</p>
            <p className="text-muted-foreground">boards</p>
          </div>
        </div>

        <Button
          onClick={handleFollowToggle}
          disabled={isLoading}
          variant={isFollowing ? "outline" : "default"}
          className={
            isFollowing ? "w-full bg-transparent" : "w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          }
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isFollowing ? (
            <>
              <UserCheck className="w-4 h-4 mr-2" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Follow
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
