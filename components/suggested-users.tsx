"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { UserPlus, UserCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { followUser, unfollowUser } from "@/lib/store/slices/socialSlice"

export function SuggestedUsers() {
  const dispatch = useAppDispatch()
  const { suggestedUsers } = useAppSelector((state) => state.social)
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({})

  const handleFollowToggle = async (userId: string, isCurrentlyFollowing: boolean) => {
    setFollowingStates((prev) => ({ ...prev, [userId]: true }))

    try {
      if (isCurrentlyFollowing) {
        dispatch(unfollowUser(userId))
      } else {
        dispatch(followUser(userId))
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error)
    } finally {
      setFollowingStates((prev) => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <Card className="card-theme">
      <CardHeader>
        <CardTitle className="text-lg">Suggested for you</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedUsers.slice(0, 5).map((user) => (
          <div key={user.id} className="flex items-center space-x-3">
            <Link href={`/user/${user.username}`}>
              <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={user.display_name || user.username}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {(user.display_name || user.username).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/user/${user.username}`} className="block">
                <p className="font-medium text-foreground hover:text-primary truncate">
                  {user.display_name || user.username}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user.follower_count.toLocaleString()} followers
                </p>
              </Link>
            </div>

            <Button
              size="sm"
              variant={user.is_following ? "outline" : "default"}
              className={
                user.is_following ? "bg-transparent" : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }
              onClick={() => handleFollowToggle(user.id, user.is_following || false)}
              disabled={followingStates[user.id]}
            >
              {followingStates[user.id] ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : user.is_following ? (
                <>
                  <UserCheck className="w-4 h-4 mr-1" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Follow
                </>
              )}
            </Button>
          </div>
        ))}

        <div className="pt-2">
          <Button variant="ghost" asChild className="w-full bg-transparent">
            <Link href="/people">See all suggestions</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
