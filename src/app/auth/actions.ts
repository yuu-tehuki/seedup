'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: 'メールアドレスまたはパスワードが正しくありません' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('display_name') as string
  const role = formData.get('role') as string

  if (role !== 'entrepreneur' && role !== 'supporter') {
    return { error: '役割を選択してください' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, role },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'このメールアドレスはすでに登録されています' }
    }
    return { error: '登録に失敗しました。もう一度お試しください' }
  }

  revalidatePath('/', 'layout')
  redirect(role === 'entrepreneur' ? '/projects/new' : '/projects')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
