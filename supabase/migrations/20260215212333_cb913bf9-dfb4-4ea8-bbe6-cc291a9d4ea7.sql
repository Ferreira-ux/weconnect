
-- Replace overly permissive notification insert policy
DROP POLICY "System can insert notifications" ON public.notifications;

-- Only authenticated users can insert notifications (system will use service role for automated ones)
CREATE POLICY "Authenticated can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
