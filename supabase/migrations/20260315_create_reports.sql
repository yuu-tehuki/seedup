-- 進捗報告テーブル
CREATE TABLE IF NOT EXISTS public.reports (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_project_id ON public.reports(project_id);

-- RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_select_all" ON public.reports
  FOR SELECT USING (true);

CREATE POLICY "reports_insert_own_project" ON public.reports
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT owner_id FROM public.projects WHERE id = project_id)
  );

CREATE POLICY "reports_delete_own_project" ON public.reports
  FOR DELETE USING (
    auth.uid() = (SELECT owner_id FROM public.projects WHERE id = project_id)
  );
