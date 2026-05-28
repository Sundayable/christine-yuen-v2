import { useTranslations } from "next-intl";

interface Tile {
  number: string;
  title: string;
  body: string;
}

export default function HowIWork() {
  const t = useTranslations("howIWork");
  const tiles = t.raw("tiles") as Tile[];

  return (
    <section id="how-i-work" className="bg-[var(--color-accent-50)]">
      <div className="container-wide py-20 md:py-28">
        <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--color-accent-dark)] mb-4">
          {t("eyebrow")}
        </p>
        <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-[var(--color-ink)] mb-3 max-w-[640px]">
          {t("heading")}
        </h2>
        <p className="text-[18px] leading-[1.5] text-[var(--color-graphite)] mb-12 max-w-[640px]">
          {t("subhead")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map((tile) => (
            <article
              key={tile.number}
              className="group bg-white border border-[var(--color-line)] rounded-[12px] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(42,37,33,0.08)]"
            >
              <p className="font-display text-[56px] leading-none text-[var(--color-accent)] group-hover:text-[var(--color-accent-dark)] transition-colors mb-6">
                {tile.number}
              </p>
              <h3 className="text-[20px] font-semibold text-[var(--color-ink)] mb-3">
                {tile.title}
              </h3>
              <p className="text-[15px] leading-[1.6] text-[var(--color-graphite)]">
                {tile.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
