import { IconChip } from "@byte-quest/ui/components/breadcrumb";
import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";
import { Button } from "@byte-quest/ui/primitives/button";

import { enquireSection, partnerBenefits } from "./data";

export const Enquire = () => (
  <Section id="enquire">
    <Container>
      <Card
        className="border-gold/18 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-[clamp(28px,4vw,56px)] rounded-[28px] p-[clamp(28px,4vw,48px)]"
        style={{
          background:
            "radial-gradient(60% 80% at 100% 0%, rgba(212,175,55,0.1), transparent 60%), linear-gradient(160deg,#071d16,#030f0b)",
        }}
      >
        <div>
          <Kicker tone="gold">{enquireSection.kicker}</Kicker>
          <h2 className="text-fg mt-4 text-[clamp(28px,3.2vw,42px)] leading-[0.98] tracking-[-0.04em]">
            {enquireSection.title}
          </h2>
          <p className="text-muted mt-5 text-[16.5px] leading-[1.65]">
            {enquireSection.body}
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Button
              className="bg-gold text-ink hover:bg-gold-bright"
              render={
                <a
                  aria-label="Email a BYTE QUEST sponsorship enquiry"
                  href={`mailto:?subject=${enquireSection.sponsorSubject}`}
                />
              }
            >
              {enquireSection.sponsorAction}
            </Button>
            <Button
              render={
                <a
                  aria-label="Email a BYTE QUEST partnership enquiry"
                  href={`mailto:?subject=${enquireSection.partnerSubject}`}
                />
              }
              variant="outline"
            >
              {enquireSection.partnerAction}
            </Button>
          </div>
        </div>

        <div className="border-line-soft bg-line-soft grid grid-cols-2 gap-px border-l pl-px">
          {partnerBenefits.map((benefit) => (
            <div
              className="bg-surface-3 flex flex-col gap-2.5 p-[clamp(18px,2.4vw,26px)]"
              key={benefit.title}
            >
              <IconChip tone="gold" />
              <div className="font-display text-fg text-[16px] font-semibold tracking-[-0.02em]">
                {benefit.title}
              </div>
              <div className="text-muted-2 text-[13px] leading-[1.5]">
                {benefit.description}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Container>
  </Section>
);
