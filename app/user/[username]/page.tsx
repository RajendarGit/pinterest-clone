"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  ExternalLink,
  Calendar,
  Settings,
  UserPlus,
  UserCheck,
  Share,
} from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/header";
import { MasonryGrid } from "@/components/masonry-grid";
import { BoardCard } from "@/components/board-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditProfileModal } from "@/components/edit-profile-modal";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { followUser, unfollowUser } from "@/lib/store/slices/socialSlice";
import type { User } from "@/lib/store/slices/socialSlice";
import type { Pin } from "@/lib/store/slices/pinsSlice";
import type { Board } from "@/lib/store/slices/boardsSlice";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const dispatch = useAppDispatch();
  const { suggestedUsers } = useAppSelector((state) => state.social);
  const { pins } = useAppSelector((state) => state.pins);
  const { boards } = useAppSelector((state) => state.boards);

  const [user, setUser] = useState<User | null>(null);
  const [userPins, setUserPins] = useState<Pin[]>([]);
  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = username === "you"; // Mock check for own profile

  useEffect(() => {
    // Find user data
    const foundUser = suggestedUsers.find((u) => u.username === username);

    if (foundUser) {
      setUser(foundUser);
      setIsFollowing(foundUser.is_following || false);
    } else if (username === "you") {
      // Mock current user data
      setUser({
        id: "current-user",
        username: "you",
        display_name: "Your Name",
        bio: "Welcome to your Pinterest profile! Start creating boards and saving pins.",
        avatar_url: "/diverse-profile-avatars.png",
        website_url: "https://yourwebsite.com",
        location: "Your City",
        follower_count: 156,
        following_count: 89,
        board_count: 12,
        pin_count: 234,
      });
    }

    // Filter user's pins and boards
    const filteredPins = pins.filter((pin) => pin.user?.username === username);
    const filteredBoards = boards.filter(
      (board) => board.user_id === (foundUser?.id || "current-user")
    );

    setUserPins(filteredPins);
    setUserBoards(filteredBoards);
    setIsLoading(false);
  }, [username, suggestedUsers, pins, boards]);

  const handleFollowToggle = async () => {
    if (!user) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        dispatch(unfollowUser(user.id));
        setIsFollowing(false);
      } else {
        dispatch(followUser(user.id));
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLoadMore = () => {
    // Mock load more functionality
    console.log("Load more pins for user:", username);
  };

  if (isLoading) {
    return (
      <>
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            User not found
          </h1>
          <p className="text-muted-foreground mb-6">
            The user you're looking for doesn't exist.
          </p>
          <Button asChild>
            <a href="/people">Discover people</a>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="w-32 h-32 rounded-full bg-muted overflow-hidden mx-auto mb-6">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url || "/placeholder.svg"}
              alt={user.display_name || user.username}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <span className="text-4xl font-medium text-primary">
                {(user.display_name || user.username).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          {user.display_name || user.username}
        </h1>
        <p className="text-lg text-muted-foreground mb-4">@{user.username}</p>

        {user.bio && (
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {user.bio}
          </p>
        )}

        {/* User details */}
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground mb-6">
          {user.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {user.location}
            </div>
          )}
          {user.website_url && (
            <div className="flex items-center">
              <ExternalLink className="w-4 h-4 mr-1" />
              <a
                href={user.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {user.website_url.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Joined 2023
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {user.follower_count.toLocaleString()}
            </p>
            <p className="text-muted-foreground">followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {user.following_count.toLocaleString()}
            </p>
            <p className="text-muted-foreground">following</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {user.pin_count.toLocaleString()}
            </p>
            <p className="text-muted-foreground">pins</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center space-x-3">
          {isOwnProfile ? (
            <>
              <Button
                onClick={() => setShowEditProfile(true)}
                variant="outline"
                className="bg-transparent"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit profile
              </Button>
              <Button variant="outline" className="bg-transparent">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleFollowToggle}
                disabled={followLoading}
                variant={isFollowing ? "outline" : "default"}
                className={
                  isFollowing
                    ? "bg-transparent"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }
              >
                {followLoading ? (
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
              <Button variant="outline" className="bg-transparent">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <Tabs defaultValue="pins" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="pins">Pins</TabsTrigger>
          <TabsTrigger value="boards">Boards</TabsTrigger>
        </TabsList>

        <TabsContent value="pins">
          {userPins.length > 0 ? (
            <MasonryGrid
              pins={userPins}
              onLoadMore={handleLoadMore}
              hasMore={false}
              loading={false}
            />
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-muted-foreground">📌</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {isOwnProfile
                  ? "No pins yet"
                  : `${
                      user.display_name || user.username
                    } hasn't pinned anything yet`}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isOwnProfile
                  ? "Start creating pins to share your ideas"
                  : "Check back later for new pins"}
              </p>
              {isOwnProfile && (
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a href="/create">Create your first pin</a>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="boards">
          {userBoards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-muted-foreground">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {isOwnProfile
                  ? "No boards yet"
                  : `${
                      user.display_name || user.username
                    } hasn't created any boards yet`}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isOwnProfile
                  ? "Create boards to organize your pins"
                  : "Check back later for new boards"}
              </p>
              {isOwnProfile && (
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a href="/boards">Create your first board</a>
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {isOwnProfile && (
        <EditProfileModal
          user={user}
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
        />
      )}
    </>
  );
}
