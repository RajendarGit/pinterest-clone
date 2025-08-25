"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/header";
import { UserCard } from "@/components/user-card";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { fetchSuggestedUsers } from "@/lib/store/slices/socialSlice";
import { withAuth } from "@/components/hoc";

function PeoplePage() {
  const dispatch = useAppDispatch();
  const { suggestedUsers, loading } = useAppSelector((state) => state.social);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  const filteredUsers = suggestedUsers.filter(
    (user) =>
      user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Discover people
        </h1>
        <p className="text-muted-foreground mb-6">
          Find and follow people who share your interests
        </p>

        {/* Search */}
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search people"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-border focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading people...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && !loading && searchQuery && (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No people found
          </h3>
          <p className="text-muted-foreground">
            Try searching with different keywords
          </p>
        </div>
      )}
    </>
  );
}

export default withAuth(PeoplePage);