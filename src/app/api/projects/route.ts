import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseServer(token);

  // Projects viewable by members via RLS
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseServer(token);
  const body = await request.json();
  const { name, description } = body;

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Create Project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([{ name, description, created_by: userData.user.id }])
    .select()
    .single();

  if (projectError) return NextResponse.json({ error: projectError.message }, { status: 500 });

  // Add creator as ADMIN in project_members
  const { error: memberError } = await supabase
    .from('project_members')
    .insert([{ project_id: project.id, user_id: userData.user.id, role: 'ADMIN' }]);

  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });

  return NextResponse.json(project);
}
