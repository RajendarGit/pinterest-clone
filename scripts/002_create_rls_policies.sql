-- Row Level Security Policies for Pinterest Clone

-- Profiles policies
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Boards policies
CREATE POLICY "boards_select_public" ON public.boards FOR SELECT USING (
  NOT is_private OR user_id = auth.uid()
);
CREATE POLICY "boards_insert_own" ON public.boards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "boards_update_own" ON public.boards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "boards_delete_own" ON public.boards FOR DELETE USING (auth.uid() = user_id);

-- Pins policies
CREATE POLICY "pins_select_all" ON public.pins FOR SELECT USING (
  board_id IS NULL OR 
  board_id IN (
    SELECT id FROM public.boards WHERE NOT is_private OR user_id = auth.uid()
  )
);
CREATE POLICY "pins_insert_own" ON public.pins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pins_update_own" ON public.pins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "pins_delete_own" ON public.pins FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "follows_select_all" ON public.follows FOR SELECT USING (true);
CREATE POLICY "follows_insert_own" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete_own" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Board follows policies
CREATE POLICY "board_follows_select_all" ON public.board_follows FOR SELECT USING (true);
CREATE POLICY "board_follows_insert_own" ON public.board_follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "board_follows_delete_own" ON public.board_follows FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "likes_select_all" ON public.likes FOR SELECT USING (true);
CREATE POLICY "likes_insert_own" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "comments_select_all" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update_own" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete_own" ON public.comments FOR DELETE USING (auth.uid() = user_id);
