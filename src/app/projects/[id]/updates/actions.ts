'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createUpdate(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'ログインが必要です' }

  // オーナー確認
  const { data: project } = await supabase
    .from('projects')
    .select('owner_id')
    .eq('id', projectId)
    .single()

  if (!project || project.owner_id !== user.id) {
    return { error: '権限がありません' }
  }

  const { error } = await supabase.from('updates').insert({
    project_id: projectId,
    title: formData.get('title') as string,
    body: formData.get('body') as string,
  })

  if (error) return { error: '投稿に失敗しました' }

  revalidatePath(`/projects/${projectId}`)
  redirect(`/projects/${projectId}`)
}
