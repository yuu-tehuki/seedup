-- profilesテーブルにroleカラムを追加
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('entrepreneur', 'supporter'));

-- 新規ユーザー登録トリガーをrole対応に更新
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NULLIF(NEW.raw_user_meta_data->>'role', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
