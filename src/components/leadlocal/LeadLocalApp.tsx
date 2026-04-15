'use client';

import { useMemo, useState } from 'react';
import Input from '@/components/leadlocal/Input';
import Select from '@/components/leadlocal/Select';
import TextArea from '@/components/leadlocal/TextArea';
import StatCard from '@/components/leadlocal/StatCard';
import Badge from '@/components/leadlocal/Badge';
import SchemaCard from '@/components/leadlocal/SchemaCard';

type ProviderCreateResponse = {
  success: boolean;
  provider: {
    id: string;
    email: string;
    plan: string;
  };
};

type StripeCheckoutResponse = { url: string };

type LeadForm = {
  fullName: string;
  phone: string;
  email: string;
  zipCode: string;
  serviceType: string;
  dateNeeded: string;
  details: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
};

type ProviderForm = {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  serviceArea: string;
  teamSize: string;
  plan: string;
};

type ProviderLead = {
  id: string;
  service: string;
  zipCode: string;
  budget: string;
  status: 'new' | 'contacted' | 'booked';
  priority: 'high' | 'medium';
  customer: string;
  requestedAt: string;
};

async function postJson<TResponse>(url: string, payload: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || 'Request failed');
  return data as TResponse;
}

const services = [
  'Standard House Cleaning',
  'Deep Cleaning',
  'Move-Out Cleaning',
  'Airbnb Turnover',
  'Office Cleaning',
  'Post-Construction Cleaning',
];

const defaultLeadForm: LeadForm = {
  fullName: '',
  phone: '',
  email: '',
  zipCode: '',
  serviceType: services[0],
  dateNeeded: '',
  details: '',
  propertyType: 'House',
  bedrooms: '2',
  bathrooms: '2',
};

const defaultProviderForm: ProviderForm = {
  companyName: '',
  ownerName: '',
  email: '',
  phone: '',
  website: '',
  serviceArea: 'Santa Barbara',
  teamSize: '1-3',
  plan: 'Starter',
};

const providerLeads: ProviderLead[] = [
  { id: 'LD-1042', service: 'Move-Out Cleaning', zipCode: '93101', budget: '$240-$360', status: 'new', priority: 'high', customer: 'Emily R.', requestedAt: '7 min ago' },
  { id: 'LD-1041', service: 'Deep Cleaning', zipCode: '93103', budget: '$180-$280', status: 'contacted', priority: 'high', customer: 'Michael T.', requestedAt: '22 min ago' },
  { id: 'LD-1039', service: 'Office Cleaning', zipCode: '93105', budget: '$300-$520', status: 'booked', priority: 'medium', customer: 'Pacific Studio', requestedAt: '1 hr ago' },
];

const plans = [
  { name: 'Starter', price: '$99/mo', description: 'Perfect for solo cleaners and small local teams getting started.', features: ['15 shared leads / month', 'Santa Barbara visibility', 'Basic analytics', 'Email notifications'] },
  { name: 'Growth', price: '$199/mo', description: 'Built for companies that want more consistent deal flow.', features: ['40 shared leads / month', 'Priority placement', 'Lead notes', 'SMS + email alerts'], featured: true },
  { name: 'Exclusive', price: '$349/mo', description: 'For serious teams that want premium and exclusive opportunities.', features: ['25 exclusive leads / month', 'Top placement', 'Advanced dashboard', 'Dedicated onboarding'] },
];

const faqs = [
  { question: 'How does LeadLocal make money?', answer: 'LeadLocal charges cleaning companies through monthly subscriptions first, then can expand into exclusive leads, featured placement, and add-on tools.' },
  { question: 'Do customers pay to submit a request?', answer: 'No. Customers submit quote requests for free so the platform can capture as many high-intent leads as possible.' },
  { question: 'Why start with Santa Barbara?', answer: 'Owning one city first is easier than trying to launch everywhere at once. It helps you build trust and improve lead quality faster.' },
];

export default function LeadLocalApp() {
  const [activeView, setActiveView] = useState<'home' | 'provider' | 'admin'>('home');
  const [leadForm, setLeadForm] = useState<LeadForm>(defaultLeadForm);
  const [providerForm, setProviderForm] = useState<ProviderForm>(defaultProviderForm);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [providerSubmitted, setProviderSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [providerError, setProviderError] = useState<string | null>(null);

  const dashboardStats = useMemo(
    () => ({
      newLeads: providerLeads.filter((lead) => lead.status === 'new').length,
      openLeads: providerLeads.filter((lead) => lead.status !== 'booked').length,
      bookedJobs: providerLeads.filter((lead) => lead.status === 'booked').length,
      projectedRevenue: '$4,180',
    }),
    []
  );

  const handleLeadChange = (field: keyof LeadForm, value: string) => setLeadForm((prev) => ({ ...prev, [field]: value }));
  const handleProviderChange = (field: keyof ProviderForm, value: string) => setProviderForm((prev) => ({ ...prev, [field]: value }));

  const handleLeadSubmit = async () => {
    setLeadLoading(true);
    setLeadError(null);
    setLeadSubmitted(false);
    try {
      await postJson('/api/leads', {
        fullName: leadForm.fullName,
        phone: leadForm.phone,
        email: leadForm.email,
        zipCode: leadForm.zipCode,
        serviceType: leadForm.serviceType,
        dateNeeded: leadForm.dateNeeded,
        details: leadForm.details,
        propertyType: leadForm.propertyType,
        bedrooms: leadForm.bedrooms,
        bathrooms: leadForm.bathrooms,
      });
      setLeadSubmitted(true);
      setLeadForm(defaultLeadForm);
    } catch (error) {
      setLeadError(error instanceof Error ? error.message : 'Unable to submit lead right now.');
    } finally {
      setLeadLoading(false);
    }
  };

  const handleProviderSubmit = async () => {
    setProviderLoading(true);
    setProviderError(null);
    setProviderSubmitted(false);
    try {
      const provider = await postJson<ProviderCreateResponse>('/api/providers', {
        companyName: providerForm.companyName,
        ownerName: providerForm.ownerName,
        email: providerForm.email,
        phone: providerForm.phone,
        website: providerForm.website,
        serviceArea: providerForm.serviceArea,
        teamSize: providerForm.teamSize,
        plan: providerForm.plan,
      });
      setProviderSubmitted(true);
      const checkout = await postJson<StripeCheckoutResponse>('/api/stripe/checkout', {
        providerId: provider.provider.id,
        plan: provider.provider.plan,
      });
      window.location.href = checkout.url;
    } catch (error) {
      setProviderError(error instanceof Error ? error.message : 'Unable to start provider signup right now.');
    } finally {
      setProviderLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B12] text-[#E9D5FF] selection:bg-purple-500/30">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#7C3AED]/25 blur-3xl" />
        <div className="absolute top-[20rem] -left-24 h-72 w-72 rounded-full bg-[#A855F7]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#4C1D95]/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B12]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <span className="text-lg font-bold text-[#C084FC]">LL</span>
            </div>
            <div>
              <div className="text-lg font-semibold tracking-wide">LeadLocal</div>
              <div className="text-xs text-[#E9D5FF]/60">Santa Barbara leads, done right</div>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-[#E9D5FF]/75 md:flex">
            <button onClick={() => setActiveView('home')}>Customer Site</button>
            <button onClick={() => setActiveView('provider')}>Provider Portal</button>
            <button onClick={() => setActiveView('admin')}>Admin Preview</button>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {activeView === 'home' && (
          <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit rounded-full border border-[#C084FC]/20 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#C084FC]">
                Lead generation platform · Santa Barbara launch
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
                Get matched with trusted <span className="bg-gradient-to-r from-[#C084FC] to-white bg-clip-text text-transparent">local cleaning pros</span> in Santa Barbara.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#E9D5FF]/75 md:text-lg">
                LeadLocal helps homeowners and businesses request cleaning services in minutes while giving local companies a better source of high-intent leads.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#120F1D]/90 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Request a cleaning quote</h2>
                    <p className="mt-1 text-sm text-[#E9D5FF]/60">Get connected with local providers fast</p>
                  </div>
                  <div className="rounded-full border border-[#C084FC]/20 bg-[#C084FC]/10 px-3 py-1 text-xs font-medium text-[#C084FC]">Free</div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Full Name" value={leadForm.fullName} onChange={(v) => handleLeadChange('fullName', v)} placeholder="Your name" />
                    <Input label="Phone" value={leadForm.phone} onChange={(v) => handleLeadChange('phone', v)} placeholder="(805) 555-0123" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Email" value={leadForm.email} onChange={(v) => handleLeadChange('email', v)} placeholder="you@example.com" />
                    <Input label="ZIP Code" value={leadForm.zipCode} onChange={(v) => handleLeadChange('zipCode', v)} placeholder="93101" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select label="Service Type" value={leadForm.serviceType} onChange={(v) => handleLeadChange('serviceType', v)} options={services} />
                    <Input label="Date Needed" value={leadForm.dateNeeded} onChange={(v) => handleLeadChange('dateNeeded', v)} placeholder="ASAP / This week" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Select label="Property Type" value={leadForm.propertyType} onChange={(v) => handleLeadChange('propertyType', v)} options={['House', 'Apartment', 'Office', 'Rental']} />
                    <Select label="Bedrooms" value={leadForm.bedrooms} onChange={(v) => handleLeadChange('bedrooms', v)} options={['1', '2', '3', '4', '5+']} />
                    <Select label="Bathrooms" value={leadForm.bathrooms} onChange={(v) => handleLeadChange('bathrooms', v)} options={['1', '2', '3', '4+']} />
                  </div>
                  <TextArea label="Project Details" value={leadForm.details} onChange={(v) => handleLeadChange('details', v)} placeholder="Tell us about the property, size, special requests, pets, or timing." />
                  <button onClick={handleLeadSubmit} disabled={leadLoading} className="rounded-2xl bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] px-5 py-3 font-semibold text-white disabled:opacity-70">
                    {leadLoading ? 'Submitting...' : 'Submit Request'}
                  </button>
                  {leadError && <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{leadError}</div>}
                  {leadSubmitted && <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">Lead captured successfully.</div>}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeView === 'provider' && (
          <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
                <h2 className="text-xl font-semibold text-white">Provider application</h2>
                <p className="mt-1 text-sm text-[#E9D5FF]/60">Choose a plan and start onboarding</p>
                <div className="mt-6 grid gap-4">
                  <Input label="Company Name" value={providerForm.companyName} onChange={(v) => handleProviderChange('companyName', v)} placeholder="Santa Barbara Sparkle Co." />
                  <Input label="Owner / Contact Name" value={providerForm.ownerName} onChange={(v) => handleProviderChange('ownerName', v)} placeholder="Owner name" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Email" value={providerForm.email} onChange={(v) => handleProviderChange('email', v)} placeholder="owner@company.com" />
                    <Input label="Phone" value={providerForm.phone} onChange={(v) => handleProviderChange('phone', v)} placeholder="(805) 555-0187" />
                  </div>
                  <Input label="Website / Instagram" value={providerForm.website} onChange={(v) => handleProviderChange('website', v)} placeholder="yourcompany.com" />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Select label="Service Area" value={providerForm.serviceArea} onChange={(v) => handleProviderChange('serviceArea', v)} options={['Santa Barbara', 'Goleta', 'Montecito', 'Isla Vista']} />
                    <Select label="Team Size" value={providerForm.teamSize} onChange={(v) => handleProviderChange('teamSize', v)} options={['1-3', '4-8', '9-15', '15+']} />
                    <Select label="Plan" value={providerForm.plan} onChange={(v) => handleProviderChange('plan', v)} options={plans.map((p) => p.name)} />
                  </div>
                  <button onClick={handleProviderSubmit} disabled={providerLoading} className="rounded-2xl bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] px-5 py-3 font-semibold text-white disabled:opacity-70">
                    {providerLoading ? 'Starting Checkout...' : 'Apply as Provider'}
                  </button>
                  {providerError && <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{providerError}</div>}
                  {providerSubmitted && <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">Provider application saved.</div>}
                </div>
              </div>

              <div className="space-y-8">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">Provider dashboard preview</h2>
                      <p className="mt-1 text-sm text-[#E9D5FF]/60">This becomes the logged-in experience for providers</p>
                    </div>
                    <Badge variant="green">Live Leads</Badge>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <StatCard label="New Leads" value={String(dashboardStats.newLeads)} />
                    <StatCard label="Open Leads" value={String(dashboardStats.openLeads)} />
                    <StatCard label="Booked Jobs" value={String(dashboardStats.bookedJobs)} />
                    <StatCard label="Projected" value={dashboardStats.projectedRevenue} />
                  </div>
                  <div className="mt-5 space-y-3">
                    {providerLeads.map((lead) => (
                      <div key={lead.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#120F1D]/80 px-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="font-medium text-white">{lead.service}</div>
                            <Badge variant={lead.priority === 'high' ? 'purple' : 'neutral'}>{lead.priority === 'high' ? 'High Intent' : 'Qualified'}</Badge>
                          </div>
                          <div className="mt-1 text-sm text-[#E9D5FF]/55">{lead.customer} · ZIP {lead.zipCode} · {lead.requestedAt}</div>
                        </div>
                        <Badge variant={lead.status === 'booked' ? 'green' : lead.status === 'contacted' ? 'blue' : 'purple'}>{lead.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {plans.map((plan) => (
                    <div key={plan.name} className={`rounded-[2rem] border p-6 ${plan.featured ? 'border-[#C084FC]/40 bg-[#C084FC]/10' : 'border-white/10 bg-white/5'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-lg font-semibold text-white">{plan.name}</div>
                        {plan.featured && <Badge variant="purple">Best Value</Badge>}
                      </div>
                      <div className="mt-3 text-3xl font-semibold text-white">{plan.price}</div>
                      <p className="mt-3 text-sm leading-6 text-[#E9D5FF]/65">{plan.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeView === 'admin' && (
          <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="mb-10 max-w-4xl">
              <div className="text-sm font-medium uppercase tracking-[0.25em] text-[#C084FC]">Admin preview</div>
              <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">The operating system behind LeadLocal</h1>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
                  <div className="grid gap-4 sm:grid-cols-4">
                    <StatCard label="Total Leads" value="148" />
                    <StatCard label="Approved Providers" value="12" />
                    <StatCard label="Booked Jobs" value="37" />
                    <StatCard label="MRR" value="$2,388" />
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
                  <div className="mb-5 text-xl font-semibold text-white">Suggested Supabase schema</div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <SchemaCard title="leads" fields={['id', 'created_at', 'full_name', 'phone', 'email', 'zip_code', 'service_type', 'property_type', 'bedrooms', 'bathrooms', 'details', 'status', 'assigned_provider_id']} />
                    <SchemaCard title="providers" fields={['id', 'created_at', 'company_name', 'owner_name', 'email', 'phone', 'website', 'service_area', 'team_size', 'plan', 'stripe_customer_id', 'is_approved']} />
                    <SchemaCard title="subscriptions" fields={['id', 'provider_id', 'stripe_subscription_id', 'plan_name', 'status', 'current_period_end']} />
                    <SchemaCard title="lead_events" fields={['id', 'lead_id', 'provider_id', 'event_type', 'notes', 'created_at']} />
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
                  <div className="text-xl font-semibold text-white">FAQs for launch</div>
                  <div className="mt-5 space-y-4">
                    {faqs.map((faq) => (
                      <div key={faq.question} className="rounded-2xl border border-white/10 bg-[#120F1D]/80 p-4">
                        <div className="font-medium text-white">{faq.question}</div>
                        <div className="mt-2 text-sm leading-6 text-[#E9D5FF]/65">{faq.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
