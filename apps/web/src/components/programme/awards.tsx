import { Diamond } from "@byte-quest/ui/components/breadcrumb";
import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";
import { Link } from "@tanstack/react-router";

import {
  keyRules,
  podiumPlaces,
  rulesFootnoteLead,
  rulesFootnoteLink,
  specialAwards,
} from "./data";

export const Awards = () => (
  <Section id="awards">
    <Container>
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4">
        <Card
          className="p-[clamp(22px,3vw,32px)]"
          style={{
            background:
              "linear-gradient(180deg,rgba(212,175,55,0.07),transparent 60%),#030f0b",
            border: "1px solid rgba(212,175,55,0.22)",
          }}
        >
          <Kicker tone="gold">AWARDS</Kicker>

          <div className="mt-6 flex flex-wrap gap-2">
            {podiumPlaces.map((place) => (
              <span
                className="border-gold/35 bg-gold/10 text-gold-bright rounded-[10px] border px-3.5 py-2 text-[15px] font-semibold"
                key={place}
              >
                {place}
              </span>
            ))}
          </div>

          <div className="text-muted-2 mt-8 font-mono text-[10.5px] tracking-[0.16em]">
            SPECIAL AWARDS
          </div>

          <div className="mt-4 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-y-3.5">
            {specialAwards.map((award) => (
              <div className="flex items-center gap-2.5" key={award}>
                <Diamond className="bg-gold" />
                <span className="text-fg-dim text-[13.5px]">{award}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-line-soft p-[clamp(22px,3vw,32px)]">
          <Kicker tone="teal">KEY RULES</Kicker>

          <div className="border-line-soft mt-6 border-t">
            {keyRules.map((rule) => (
              <div
                className="border-line-soft grid grid-cols-[36px_1fr] items-start gap-x-3 border-b py-3.5"
                key={rule.n}
              >
                <span className="text-volt font-mono text-[12px] tracking-[0.1em]">
                  {rule.n}
                </span>
                <p className="text-fg-dim m-0 text-[14px] leading-[1.5]">
                  {rule.text}
                </p>
              </div>
            ))}
          </div>

          <p className="text-faint mt-6 text-[12.5px] leading-[1.6]">
            {rulesFootnoteLead}{" "}
            <Link className="text-volt" to="/submission-guidelines">
              {rulesFootnoteLink}
            </Link>
            .
          </p>
        </Card>
      </div>
    </Container>
  </Section>
);
