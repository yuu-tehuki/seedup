-- 起業家情報カラムを profiles テーブルに追加
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS motivation   TEXT,
  ADD COLUMN IF NOT EXISTS track_record TEXT;
