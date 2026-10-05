import { Marquee } from "@byte-quest/ui/components/marquee";

const SCHOOL_SLOT_COUNT = 10;
const schoolSlots = Array.from(
  { length: SCHOOL_SLOT_COUNT },
  (_, index) => index
);

export const Schools = () => (
  <section
    className="overflow-hidden border-y border-[rgba(185,245,208,0.07)] py-[clamp(48px,6vw,80px)]"
    id="schools"
    style={{ background: "linear-gradient(180deg,#020807,#051712)" }}
  >
    <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-[clamp(20px,5vw,64px)]">
      <div className="text-teal font-mono text-[11px] tracking-[0.16em]">
        PARTICIPATING SCHOOLS
      </div>
      <div className="text-faint font-mono text-[10.5px] tracking-[0.12em]">
        LOGOS PUBLISHED ON CONFIRMATION
      </div>
    </div>
    <Marquee className="mt-7">
      {schoolSlots.map((slot) => (
        <div
          className="mr-4 flex h-[88px] w-[200px] shrink-0 items-center justify-center gap-3 rounded-[16px] border border-[rgba(185,245,208,0.1)] bg-[repeating-linear-gradient(135deg,#061C16_0_10px,#04140F_10px_20px)]"
          key={slot}
        >
          <span className="size-9 rounded-full border border-dashed border-[rgba(185,245,208,0.25)]" />
          <span className="text-faint font-mono text-[10.5px] tracking-[0.1em]">
            SCHOOL LOGO
          </span>
        </div>
      ))}
    </Marquee>
  </section>
);
