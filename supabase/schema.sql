-- =============================================
-- Seedup Database Schema
-- =============================================

-- =============================================
-- 1. profiles テーブル（Supabase Auth の users に紐づく）
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 2. projects テーブル
-- =============================================
CREATE TYPE project_status AS ENUM ('draft', 'active', 'closed', 'successful');

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal_amount INTEGER NOT NULL CHECK (goal_amount > 0),
  current_amount INTEGER NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  deadline TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  status project_status NOT NULL DEFAULT 'active',
  revenue_share_rate    NUMERIC(4,1) NOT NULL DEFAULT 3 CHECK (revenue_share_rate    BETWEEN 1 AND 10),
  return_period_years   SMALLINT     NOT NULL DEFAULT 3 CHECK (return_period_years   BETWEEN 1 AND 5),
  return_cap_multiplier NUMERIC(3,1) NOT NULL DEFAULT 2 CHECK (return_cap_multiplier BETWEEN 1 AND 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 3. pledges テーブル（支援）
-- =============================================
CREATE TABLE IF NOT EXISTS public.pledges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  backer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 4. updates テーブル（進捗報告）
-- =============================================
CREATE TABLE IF NOT EXISTS public.updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- インデックス
-- =============================================
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_pledges_project_id ON public.pledges(project_id);
CREATE INDEX IF NOT EXISTS idx_pledges_backer_id ON public.pledges(backer_id);
CREATE INDEX IF NOT EXISTS idx_updates_project_id ON public.updates(project_id);

-- =============================================
-- updated_at 自動更新トリガー
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 新規ユーザー登録時にprofileを自動作成するトリガー
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 支援時にcurrent_amountを自動更新するトリガー
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_pledge()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.projects
  SET current_amount = current_amount + NEW.amount
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_pledge_created
  AFTER INSERT ON public.pledges
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_pledge();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_all" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "projects_insert_authenticated" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "projects_update_own" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "projects_delete_own" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);

-- pledges
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pledges_select_all" ON public.pledges
  FOR SELECT USING (true);

CREATE POLICY "pledges_insert_authenticated" ON public.pledges
  FOR INSERT WITH CHECK (auth.uid() = backer_id);

-- updates
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "updates_select_all" ON public.updates
  FOR SELECT USING (true);

CREATE POLICY "updates_insert_own_project" ON public.updates
  FOR INSERT WITH CHECK (
    auth.uid() = (
      SELECT owner_id FROM public.projects WHERE id = project_id
    )
  );

CREATE POLICY "updates_update_own_project" ON public.updates
  FOR UPDATE USING (
    auth.uid() = (
      SELECT owner_id FROM public.projects WHERE id = project_id
    )
  );

CREATE POLICY "updates_delete_own_project" ON public.updates
  FOR DELETE USING (
    auth.uid() = (
      SELECT owner_id FROM public.projects WHERE id = project_id
    )
  );
