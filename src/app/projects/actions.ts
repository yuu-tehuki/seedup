'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'ログインが必要です' }
  }

  const goalAmount = parseInt(formData.get('goal_amount') as string, 10)
  if (isNaN(goalAmount) || goalAmount <= 0) {
    return { error: '目標金額を正しく入力してください' }
  }

  const revenueShareRate = parseFloat(formData.get('revenue_share_rate') as string)
  const returnPeriodYears = parseInt(formData.get('return_period_years') as string, 10)
  const returnCapMultiplier = parseFloat(formData.get('return_cap_multiplier') as string)

  const { data, error } = await supabase
    .from('projects')
    .insert({
      owner_id: user.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      goal_amount: goalAmount,
      category: formData.get('category') as string,
      deadline: formData.get('deadline') as string,
      revenue_share_rate: revenueShareRate,
      return_period_years: returnPeriodYears,
      return_cap_multiplier: returnCapMultiplier,
      entrepreneur_motivation: (formData.get('entrepreneur_motivation') as string) || null,
      entrepreneur_track_record: (formData.get('entrepreneur_track_record') as string) || null,
    })
    .select('id')
    .single()

  if (error) {
    return { error: 'プロジェクトの作成に失敗しました' }
  }

  revalidatePath('/projects')
  redirect(`/projects/${data.id}`)
}

export async function createPledge(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'ログインが必要です' }
  }

  const projectId = formData.get('project_id') as string
  const amount = parseInt(formData.get('amount') as string, 10)

  if (isNaN(amount) || amount <= 0) {
    return { error: '支援金額を正しく入力してください' }
  }

  const { error } = await supabase
    .from('pledges')
    .insert({ project_id: projectId, backer_id: user.id, amount })

  if (error) {
    return { error: '支援に失敗しました' }
  }

  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}
