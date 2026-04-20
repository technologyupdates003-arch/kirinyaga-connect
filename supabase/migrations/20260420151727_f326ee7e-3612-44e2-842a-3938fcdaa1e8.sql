
-- Tighten members INSERT: anonymous users can register, but if signed in, user_id must be self.
DROP POLICY "Anyone can register" ON public.members;
CREATE POLICY "Public can register"
  ON public.members FOR INSERT
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() = user_id)
  );

-- Tighten contact_messages INSERT with shape constraints.
DROP POLICY "Anyone can send a message" ON public.contact_messages;
CREATE POLICY "Public can send valid message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND char_length(message) BETWEEN 1 AND 2000
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- Replace the broad public read on event-covers with a per-object read.
-- Public bucket already serves individual file URLs; we don't need a SELECT policy
-- that matches the entire bucket — drop it.
DROP POLICY "Public read event covers" ON storage.objects;
-- Public buckets serve files via the public URL anyway; we no longer expose listing.
