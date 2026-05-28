import { useTranslations } from "next-intl";

type Item = { quote: string; attribution: string; role: string };

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as Item[];

  return (
    <section className="bg-[var(--color-canvas)]">
      <div className="container-wide py-20 md:py-28">
        <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-accent-dark)] mb-4">
          {t("eyebrow")}
        </p>
        <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-[var(--color-ink)] mb-12 max-w-[640px]">
          {t("heading")}
        </h2>
        {/* Generic, experience-based copy — agent is new and has not closed yet, so quotes describe how she works (communication, patience, language), not transaction outcomes. Swap for real client quotes as they come in. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <article
              key={i}
              className="bg-[var(--color-accent-50)] border border-[var(--color-line)] rounded-[12px] p-8 flex flex-col"
            >
              <p className="font-display italic text-[18px] leading-[1.5] text-[var(--color-ink)] mb-6 flex-1">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="border-t border-[var(--color-line)] pt-4">
                <p className="text-[14px] font-semibold text-[var(--color-ink)]">
                  {item.attribution}
                </p>
                <p className="text-[13px] text-[var(--color-graphite)]">
                  {item.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
