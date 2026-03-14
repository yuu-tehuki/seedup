-- project-images バケット作成（public）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 公開読み取り
CREATE POLICY "project_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

-- 認証済みユーザーのアップロード
CREATE POLICY "project_images_authenticated_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images' AND auth.uid() IS NOT NULL
  );

-- 自分のフォルダのみ削除可能（パスは {user_id}/... の形式）
CREATE POLICY "project_images_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
