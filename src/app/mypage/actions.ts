'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'ログインが必要です' }

  const display_name = (formData.get('display_name') as string).trim()
  if (!display_name) return { error: '表示名を入力してください' }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name,
      bio: (formData.get('bio') as string).trim() || null,
      motivation: (formData.get('motivation') as string).trim() || null,
      track_record: (formData.get('track_record') as string).trim() || null,
    })
    .eq('id', user.id)

  if (error) return { error: 'プロフィールの更新に失敗しました' }

  revalidatePath('/mypage')
  redirect('/mypage')
}
