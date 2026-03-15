-- =============================================
-- notifications テーブル
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  link       TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id     ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- トリガー①：支援があったとき → 起業家に通知
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_pledge_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_title    TEXT;
  v_owner_id UUID;
BEGIN
  SELECT title, owner_id INTO v_title, v_owner_id
  FROM public.projects WHERE id = NEW.project_id;

  -- 起業家自身が支援した場合は通知しない
  IF NEW.backer_id IS DISTINCT FROM v_owner_id THEN
    INSERT INTO public.notifications (user_id, title, body, link)
    VALUES (
      v_owner_id,
      '新しい支援がありました',
      '「' || v_title || '」に ¥' || NEW.amount || ' の支援がありました',
      '/projects/' || NEW.project_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_pledge_notify
  AFTER INSERT ON public.pledges
  FOR EACH ROW EXECUTE FUNCTION public.handle_pledge_notification();

-- =============================================
-- トリガー②：進捗報告があったとき → 応援者に通知
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_report_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_title  TEXT;
  v_backer RECORD;
BEGIN
  SELECT title INTO v_title
  FROM public.projects WHERE id = NEW.project_id;

  -- そのプロジェクトの全支援者（重複なし）に通知
  FOR v_backer IN
    SELECT DISTINCT backer_id
    FROM public.pledges
    WHERE project_id = NEW.project_id
  LOOP
    INSERT INTO public.notifications (user_id, title, body, link)
    VALUES (
      v_backer.backer_id,
      '進捗報告が届きました',
      '「' || v_title || '」に新しい進捗報告「' || NEW.title || '」が投稿されました',
      '/projects/' || NEW.project_id
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_report_notify
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_report_notification();
