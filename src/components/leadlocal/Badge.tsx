export default function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: 'purple' | 'green' | 'blue' | 'neutral';
}) {
  const classes = {
    purple: 'border-[#C084FC]/20 bg-[#C084FC]/10 text-[#C084FC]',
    green: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    blue: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
    neutral: 'border-white/10 bg-white/5 text-[#E9D5FF]/70',
  } as const;

  return (
    <div className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${classes[variant]}`}>
      {children}
    </div>
  );
}
