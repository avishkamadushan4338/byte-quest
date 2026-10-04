import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";

interface ClosingCtaProps {
  title: string;
  actions: {
    label: string;
    to: string;
    variant?: "primary" | "outline";
  }[];
}

export const ClosingCta = ({ title, actions }: ClosingCtaProps) => (
  <Section id="join" tone="cta">
    <Container className="text-center">
      <h2 className="mx-auto max-w-[820px] text-[clamp(40px,6vw,80px)] leading-[0.92] tracking-[-0.05em]">
        {title}
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        {actions.map((action) => (
          <Button
            key={action.label}
            render={<Link to={action.to} />}
            size="lg"
            variant={action.variant ?? "primary"}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </Container>
  </Section>
);
