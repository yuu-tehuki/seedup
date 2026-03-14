-- リターン条件カラムを projects テーブルに追加
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS revenue_share_rate    NUMERIC(4,1) NOT NULL DEFAULT 3   CHECK (revenue_share_rate    BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS return_period_years   SMALLINT     NOT NULL DEFAULT 3   CHECK (return_period_years   BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS return_cap_multiplier NUMERIC(3,1) NOT NULL DEFAULT 2   CHECK (return_cap_multiplier BETWEEN 1 AND 3);
