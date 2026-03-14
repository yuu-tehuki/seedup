import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'
import { updateProfile } from '@/app/mypage/actions'
import ProfileEditForm from './ProfileEditForm'

export default async function ProfileEditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">プロフィール編集</h1>
      <ProfileEditForm profile={profile as Profile} action={updateProfile} />
    </div>
  )
}
