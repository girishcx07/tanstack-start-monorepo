interface FeatureCardProps {
  title: string;
  desc: string;
}

export function FeatureCard({ title, desc }: FeatureCardProps) {
  return (
    <div className="bg-card rounded-xl border p-6 text-left shadow-sm transition hover:shadow-md">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{desc}</p>
    </div>
  );
}
