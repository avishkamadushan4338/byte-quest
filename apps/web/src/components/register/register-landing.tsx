import { useState } from "react";

import { Volunteers } from "@/components/volunteers/volunteers";

import type { RegisterSector } from "./sector-select";
import { SectorSelect } from "./sector-select";
import { Register } from "./wizard";

const BackBar = ({ onBack }: { onBack: () => void }) => (
  <div className="bg-ink px-[clamp(20px,5vw,64px)] pt-[104px] pb-2">
    <div className="mx-auto max-w-[1280px]">
      <button
        className="text-muted-2 hover:text-volt cursor-pointer border-none bg-transparent p-0 font-mono text-[11px] tracking-[0.1em]"
        onClick={onBack}
        type="button"
      >
        ← CHOOSE A DIFFERENT OPTION
      </button>
    </div>
  </div>
);

export const RegisterLanding = () => {
  const [sector, setSector] = useState<RegisterSector | null>(null);

  if (sector === "team") {
    return (
      <>
        <BackBar onBack={() => setSector(null)} />
        <Register />
      </>
    );
  }

  if (sector === "volunteer") {
    return (
      <>
        <BackBar onBack={() => setSector(null)} />
        <Volunteers />
      </>
    );
  }

  return <SectorSelect onSelect={setSector} />;
};
