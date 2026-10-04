import { ClosingCta } from "@/components/site/closing-cta";

import { Divisions } from "./divisions";
import { Gains } from "./gains";
import { Hero } from "./hero";
import { Objectives } from "./objectives";
import { Organisers } from "./organisers";
import { Philosophy } from "./philosophy";
import { VisionMission } from "./vision-mission";

export const About = () => (
  <main className="bg-ink overflow-x-hidden">
    <Hero />
    <Philosophy />
    <VisionMission />
    <Objectives />
    <Divisions />
    <Gains />
    <Organisers />
    <ClosingCta
      actions={[
        { label: "Register your team →", to: "/register", variant: "primary" },
        {
          label: "Explore the programme",
          to: "/programme",
          variant: "outline",
        },
      ]}
      title="From curiosity to creation."
    />
  </main>
);
