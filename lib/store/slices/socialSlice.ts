import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  username: string
  display_name?: string
  bio?: string
  avatar_url?: string
  website_url?: string
  location?: string
  follower_count: number
  following_count: number
  board_count: number
  pin_count: number
  is_following?: boolean
}

export interface Activity {
  id: string
  type: "pin_created" | "board_created" | "user_followed" | "pin_liked" | "pin_commented"
  user: User
  created_at: string
  pin?: {
    id: string
    title?: string
    image_url: string
  }
  board?: {
    id: string
    title: string
    cover_image_url?: string
  }
  target_user?: User
}

interface SocialState {
  suggestedUsers: User[]
  followingUsers: User[]
  activities: Activity[]
  loading: boolean
  error: string | null
}

const initialState: SocialState = {
  suggestedUsers: [],
  followingUsers: [],
  activities: [],
  loading: false,
  error: null,
}

// Async thunk for fetching suggested users
export const fetchSuggestedUsers = createAsyncThunk("social/fetchSuggestedUsers", async () => {
  // Mock data for suggested users
  const mockUsers: User[] = [
    {
      id: "user-1",
      username: "sarah_designs",
      display_name: "Sarah Johnson",
      bio: "Interior designer & home decor enthusiast",
      avatar_url: "/diverse-profile-avatars.png",
      follower_count: 12500,
      following_count: 890,
      board_count: 24,
      pin_count: 1250,
      is_following: false,
    },
    {
      id: "user-2",
      username: "chef_marco",
      display_name: "Marco Rodriguez",
      bio: "Professional chef sharing delicious recipes",
      avatar_url: "/diverse-profile-avatars.png",
      follower_count: 8900,
      following_count: 456,
      board_count: 18,
      pin_count: 890,
      is_following: false,
    },
    {
      id: "user-3",
      username: "travel_emma",
      display_name: "Emma Thompson",
      bio: "Travel blogger exploring the world one pin at a time",
      avatar_url: "/diverse-profile-avatars.png",
      follower_count: 15600,
      following_count: 1200,
      board_count: 32,
      pin_count: 2100,
      is_following: true,
    },
    {
      id: "user-4",
      username: "fashion_alex",
      display_name: "Alex Chen",
      bio: "Fashion stylist & trend forecaster",
      avatar_url: "/diverse-profile-avatars.png",
      follower_count: 22000,
      following_count: 780,
      board_count: 28,
      pin_count: 1800,
      is_following: false,
    },
  ]

  return mockUsers
})

// Async thunk for fetching activity feed
export const fetchActivityFeed = createAsyncThunk("social/fetchActivityFeed", async () => {
  // Mock activity data
  const mockActivities: Activity[] = [
    {
      id: "activity-1",
      type: "pin_created",
      user: {
        id: "user-1",
        username: "sarah_designs",
        display_name: "Sarah Johnson",
        avatar_url: "/diverse-profile-avatars.png",
        follower_count: 12500,
        following_count: 890,
        board_count: 24,
        pin_count: 1250,
      },
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      pin: {
        id: "pin-1",
        title: "Modern Living Room Design",
        image_url: "/modern-home-interior.png",
      },
    },
    {
      id: "activity-2",
      type: "board_created",
      user: {
        id: "user-2",
        username: "chef_marco",
        display_name: "Marco Rodriguez",
        avatar_url: "/diverse-profile-avatars.png",
        follower_count: 8900,
        following_count: 456,
        board_count: 18,
        pin_count: 890,
      },
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      board: {
        id: "board-1",
        title: "Summer Cocktail Recipes",
        cover_image_url: "/delicious-food-recipes.png",
      },
    },
    {
      id: "activity-3",
      type: "user_followed",
      user: {
        id: "user-3",
        username: "travel_emma",
        display_name: "Emma Thompson",
        avatar_url: "/diverse-profile-avatars.png",
        follower_count: 15600,
        following_count: 1200,
        board_count: 32,
        pin_count: 2100,
      },
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      target_user: {
        id: "user-4",
        username: "fashion_alex",
        display_name: "Alex Chen",
        avatar_url: "/diverse-profile-avatars.png",
        follower_count: 22000,
        following_count: 780,
        board_count: 28,
        pin_count: 1800,
      },
    },
  ]

  return mockActivities
})

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    followUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      // Update suggested users
      const suggestedUser = state.suggestedUsers.find((user) => user.id === userId)
      if (suggestedUser) {
        suggestedUser.is_following = true
        suggestedUser.follower_count += 1
      }
      // Add to following users if not already there
      if (suggestedUser && !state.followingUsers.find((user) => user.id === userId)) {
        state.followingUsers.push(suggestedUser)
      }
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      // Update suggested users
      const suggestedUser = state.suggestedUsers.find((user) => user.id === userId)
      if (suggestedUser) {
        suggestedUser.is_following = false
        suggestedUser.follower_count -= 1
      }
      // Remove from following users
      state.followingUsers = state.followingUsers.filter((user) => user.id !== userId)
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.unshift(action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.loading = false
        state.suggestedUsers = action.payload
        state.followingUsers = action.payload.filter((user) => user.is_following)
      })
      .addCase(fetchSuggestedUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch suggested users"
      })
      .addCase(fetchActivityFeed.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchActivityFeed.fulfilled, (state, action) => {
        state.loading = false
        state.activities = action.payload
      })
      .addCase(fetchActivityFeed.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch activity feed"
      })
  },
})

export const { followUser, unfollowUser, addActivity, setLoading, setError } = socialSlice.actions
export default socialSlice.reducer
