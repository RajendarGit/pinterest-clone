"use client";

import { useEffect } from "react";
import { ActivityFeed } from "@/components/activity-feed";
import { SuggestedUsers } from "@/components/suggested-users";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
  fetchActivityFeed,
  fetchSuggestedUsers,
} from "@/lib/store/slices/socialSlice";
import { withAuth } from "@/components/hoc";

function FollowingPage() {
  const dispatch = useAppDispatch();
  const { activities, loading } = useAppSelector((state) => state.social);

  useEffect(() => {
    dispatch(fetchActivityFeed());
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Following
            </h1>
            <p className="text-muted-foreground">
              Stay updated with the latest from people you follow
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading activity...</span>
              </div>
            </div>
          ) : (
            <ActivityFeed activities={activities} />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SuggestedUsers />
        </div>
      </div>
    </>
  );
}

export default withAuth(FollowingPage);