import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Project } from '@/lib/types'
import { updateProject } from '@/app/projects/actions'
import EditProjectForm from './EditProjectForm'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: { user } }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (!project) notFound()
  if (!user || user.id !== project.owner_id) redirect('/mypage')

  const action = updateProject.bind(null, id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">プロジェクトを編集</h1>
      <EditProjectForm project={project as Project} action={action} />
    </div>
  )
}
