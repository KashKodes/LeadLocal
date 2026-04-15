import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { leadSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid lead submission', details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const { error, data: inserted } = await supabaseAdmin
      .from('leads')
      .insert({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        zip_code: data.zipCode,
        service_type: data.serviceType,
        date_needed: data.dateNeeded || null,
        details: data.details || null,
        property_type: data.propertyType,
        bedrooms: data.bedrooms ? Number(data.bedrooms.replace('+', '')) : null,
        bathrooms: data.bathrooms ? Number(data.bathrooms.replace('+', '')) : null,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, leadId: inserted.id });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 });
  }
}
