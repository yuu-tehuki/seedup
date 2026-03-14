-- 起業家情報カラムを projects テーブルに追加
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS entrepreneur_motivation    TEXT,
  ADD COLUMN IF NOT EXISTS entrepreneur_track_record  TEXT;
