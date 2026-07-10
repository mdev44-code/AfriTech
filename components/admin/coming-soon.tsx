interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
      <p className="text-sm text-text-secondary">
        Cette section arrive dans une prochaine phase.
      </p>
    </div>
  );
}
