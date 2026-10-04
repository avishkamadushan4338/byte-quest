import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";

export const CallToAction = () => (
  <Section
    className="overflow-hidden py-[clamp(88px,12vw,160px)]"
    id="register"
    tone="cta"
  >
    <Container className="max-w-[960px] text-center">
      <Kicker tone="volt">Join the Quest</Kicker>
      <h2 className="mt-[22px] text-[clamp(48px,8vw,112px)] leading-[0.9] tracking-[-0.05em]">
        Your idea could be next.
      </h2>
      <p className="text-muted mx-auto mt-6 max-w-[460px] text-[17px] leading-[1.6]">
        Register your team. Build something meaningful.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-2.5">
        <Button
          className="h-[52px] px-[30px] text-[15px]"
          render={<Link to="/auth/login" />}
        >
          Register now <span aria-hidden="true">→</span>
        </Button>
        <Button
          className="h-[52px] px-[30px] text-[15px]"
          render={<a aria-label="Read the programme" href="#programme" />}
          variant="outline"
        >
          Read the programme
        </Button>
      </div>

      <p className="text-muted-2 mt-6 font-mono text-[11px] tracking-[0.1em]">
        REGISTRATION DATES TO BE ANNOUNCED
      </p>
    </Container>
  </Section>
);
