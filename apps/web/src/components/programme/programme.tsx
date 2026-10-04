import { ClosingCta } from "@/components/site/closing-cta";

import { Awards } from "./awards";
import { Divisions } from "./divisions";
import { Hero } from "./hero";
import { Milestones } from "./milestones";
import { Structure } from "./structure";

export const Programme = () => (
  <main className="bg-ink overflow-x-hidden">
    <Hero />
    <Structure />
    <Milestones />
    <Divisions />
    <Awards />
    <ClosingCta
      actions={[
        { label: "Register your team →", to: "/register" },
        { label: "View the journey", to: "/journey", variant: "outline" },
      ]}
      title="Ready to build something meaningful?"
    />
  </main>
);
