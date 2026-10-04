import { Kicker } from "@byte-quest/ui/components/kicker";
import type { ReactNode } from "react";

import { PageHero } from "@/components/site/page-hero";

export interface PolicySection {
  id: string;
  heading: string;
  body: ReactNode;
}

export interface PolicyMeta {
  slug: string;
  title: string;
  pageTitle: string;
  kicker: string;
  lede: string;
  updated: string;
  sections: PolicySection[];
}

export const PolicyPage = ({ meta }: { meta: PolicyMeta }) => (
  <>
    <PageHero
      aside={
        <div className="border-line-soft flex items-center gap-3 rounded-[14px] border px-[18px] py-4">
          <Kicker tone="faint">Last updated</Kicker>
          <span className="text-muted text-[13px]">{meta.updated}</span>
        </div>
      }
      breadcrumb={[{ label: "Home", to: "/" }, { label: meta.title }]}
      id={meta.slug}
      kicker={meta.kicker}
      lead={meta.lede}
      title={meta.title}
    />

    <div className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]">
      <div className="mx-auto grid w-full max-w-[1280px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-12 lg:gap-x-[72px]">
        <nav
          aria-label="On this page"
          className="lg:sticky lg:top-[110px] lg:h-fit"
        >
          <Kicker tone="faint">On this page</Kicker>
          <ol className="text-muted-2 mt-4 grid gap-2.5 text-[14px]">
            {meta.sections.map((section, index) => (
              <li key={section.id}>
                <a
                  className="hover:text-volt transition-colors"
                  href={`#${section.id}`}
                >
                  <span className="text-teal mr-2 font-mono text-[11px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid gap-12">
          {meta.sections.map((section) => (
            <section className="scroll-mt-28" id={section.id} key={section.id}>
              <h2 className="text-[clamp(22px,2.4vw,30px)] leading-[1.15] tracking-[-0.03em]">
                {section.heading}
              </h2>
              <div className="text-muted mt-5 grid gap-4 text-[15px] leading-[1.7]">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  </>
);
