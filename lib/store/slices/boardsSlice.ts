import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Board {
  id: string
  title: string
  description?: string
  is_private: boolean
  cover_image_url?: string
  user_id: string
  created_at: string
  pin_count?: number
}

interface BoardsState {
  boards: Board[]
  loading: boolean
  error: string | null
}

const initialState: BoardsState = {
  boards: [],
  loading: false,
  error: null,
}

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload
    },
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.unshift(action.payload)
    },
    updateBoard: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex((board) => board.id === action.payload.id)
      if (index !== -1) {
        state.boards[index] = action.payload
      }
    },
    removeBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter((board) => board.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setBoards, addBoard, updateBoard, removeBoard, setLoading, setError } = boardsSlice.actions
export default boardsSlice.reducer
