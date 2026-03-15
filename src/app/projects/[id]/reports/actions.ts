'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createReport(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'ログインが必要です' }

  const { data: project } = await supabase
    .from('projects')
    .select('owner_id')
    .eq('id', projectId)
    .single()

  if (!project || project.owner_id !== user.id) {
    return { error: '権限がありません' }
  }

  const title = (formData.get('title') as string).trim()
  const body = (formData.get('body') as string).trim()

  if (!title || !body) return { error: 'タイトルと本文を入力してください' }

  const { error } = await supabase
    .from('reports')
    .insert({ project_id: projectId, title, body })

  if (error) return { error: '投稿に失敗しました' }

  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}
