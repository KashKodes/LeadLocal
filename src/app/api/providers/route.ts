import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { providerSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = providerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid provider submission', details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const { error, data: inserted } = await supabaseAdmin
      .from('providers')
      .insert({
        company_name: data.companyName,
        owner_name: data.ownerName,
        email: data.email,
        phone: data.phone,
        website: data.website || null,
        service_area: data.serviceArea,
        team_size: data.teamSize,
        plan: data.plan,
        status: 'pending',
      })
      .select('id,email,plan')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, provider: inserted });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 });
  }
}
