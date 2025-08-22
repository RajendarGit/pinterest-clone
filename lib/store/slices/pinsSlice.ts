import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Pin {
  id: string
  title?: string
  description?: string
  image_url: string
  source_url?: string
  alt_text?: string
  width: number
  height: number
  user_id: string
  board_id?: string
  created_at: string
  user?: {
    username: string
    display_name?: string
    avatar_url?: string
  }
}

interface PinsState {
  pins: Pin[]
  loading: boolean
  error: string | null
  hasMore: boolean
  page: number
}

const initialState: PinsState = {
  pins: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
}

// Async thunk for fetching pins with random images from Unsplash
export const fetchPins = createAsyncThunk(
  "pins/fetchPins",
  async ({ page, limit = 20 }: { page: number; limit?: number }) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?page=${page}&per_page=${limit}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Unsplash API failed")
      }

      const data = await response.json()

      return data.map((photo: any) => ({
        id: photo.id,
        title: photo.alt_description || "Untitled",
        description: photo.description || photo.alt_description,
        image_url: photo.urls.regular,
        source_url: photo.links.html,
        alt_text: photo.alt_description || "Unsplash photo",
        width: photo.width,
        height: photo.height,
        user_id: photo.user.id,
        created_at: photo.created_at,
        user: {
          username: photo.user.username,
          display_name: photo.user.name,
          avatar_url: photo.user.profile_image.medium,
        },
      }))
    } catch (error) {
      // If Unsplash fails, fallback with dynamically generated placeholders
      const mockPins: Pin[] = Array.from({ length: limit }, (_, i) => {
        const width = 300 + Math.floor(Math.random() * 200)
        const height = 200 + Math.floor(Math.random() * 400)
        const id = `${page}-${i}`

        return {
          id,
          title: `Placeholder Image ${id}`,
          description: `A randomly generated placeholder image`,
          image_url: `https://source.unsplash.com/random/${width}x${height}?sig=${id}`,
          alt_text: `Placeholder image ${id}`,
          width,
          height,
          user_id: "demo-user",
          created_at: new Date().toISOString(),
          user: {
            username: "demo-photographer",
            display_name: "Demo Photographer",
            avatar_url: "/diverse-profile-avatars.png",
          },
        }
      })
      return mockPins
    }
  }
)


const pinsSlice = createSlice({
  name: "pins",
  initialState,
  reducers: {
    resetPins: (state) => {
      state.pins = []
      state.page = 1
      state.hasMore = true
    },
    addPin: (state, action: PayloadAction<Pin>) => {
      state.pins.unshift(action.payload)
    },
    removePin: (state, action: PayloadAction<string>) => {
      state.pins = state.pins.filter((pin) => pin.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPins.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPins.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.length === 0) {
          state.hasMore = false
        } else {
          state.pins = [...state.pins, ...action.payload]
          state.page += 1
        }
      })
      .addCase(fetchPins.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch pins"
      })
  },
})

export const { resetPins, addPin, removePin } = pinsSlice.actions
export default pinsSlice.reducer
