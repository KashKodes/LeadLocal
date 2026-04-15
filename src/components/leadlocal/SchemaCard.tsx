export default function SchemaCard({ title, fields }: { title: string; fields: string[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#120F1D]/80 p-5">
      <div className="text-lg font-semibold text-white">{title}</div>
      <div className="mt-4 space-y-2">
        {fields.map((field) => (
          <div key={field} className="text-sm text-[#E9D5FF]/75">
            • {field}
          </div>
        ))}
      </div>
    </div>
  );
}
