// Shared heading for public site sections: small eyebrow, title, optional subtitle.
export default function SectionHeading({eyebrow, title, subtitle, align = "center"}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base/7 text-slate-600">{subtitle}</p>}
    </div>
  );
}
