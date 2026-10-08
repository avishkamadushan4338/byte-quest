import type { StudentDetails, VolunteerPhoto } from "./data";
import { successPanel } from "./data";

interface SuccessPanelProps {
  onReset: () => void;
  photo?: VolunteerPhoto | null;
  reference: string;
  roles: string[];
  student: StudentDetails;
}

const metaLabelClass =
  "text-faint pt-0.5 font-mono text-[10.5px] tracking-[0.12em] whitespace-nowrap";

export const SuccessPanel = ({
  onReset,
  reference,
  roles,
  student,
}: SuccessPanelProps) => {
  const [firstWord] = student.fullName.trim().split(/\s+/u);
  const firstName = firstWord || successPanel.fallbackName;

  return (
    <section className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]">
      <output
        className="mx-auto flex max-w-[800px] flex-col gap-6 rounded-[28px] border border-[rgba(255,200,61,0.25)] p-[clamp(24px,4vw,56px)]"
        style={{
          background:
            "radial-gradient(60% 80% at 80% 0%, rgba(255,200,61,0.06), transparent 60%), #030F0B",
        }}
      >
        <div className="flex flex-col gap-[18px]">
          <div className="text-gold-bright flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em]">
            <span className="bg-gold-bright text-ink flex size-[22px] items-center justify-center rounded-full text-[12px] font-bold">
              ⏳
            </span>
            {successPanel.kicker}
          </div>
          <h2 className="m-0 text-[clamp(32px,4vw,50px)] leading-[1.05] tracking-[-0.035em]">
            {successPanel.titleStart} {firstName}.
          </h2>
          <p className="text-muted m-0 max-w-[620px] text-[15.5px] leading-[1.6]">
            {successPanel.body}
          </p>

          <div className="bg-ink my-2 grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-3 rounded-[16px] border border-[rgba(185,245,208,0.12)] p-5 text-[14px]">
            <span className={metaLabelClass}>{successPanel.idLabel}</span>
            <span className="text-volt font-mono font-bold tracking-[0.08em]">
              {reference}
            </span>
            <span className={metaLabelClass}>{successPanel.statusLabel}</span>
            <span className="text-gold-bright font-medium">
              {successPanel.statusValue}
            </span>
            <span className={metaLabelClass}>TEAMS</span>
            <span className="text-fg text-[13px]">{roles.join(", ")}</span>
            <span className={metaLabelClass}>SCHOOL</span>
            <span className="text-muted text-[13px]">{student.school}</span>
          </div>

          <div className="text-muted rounded-[14px] border border-dashed border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-4 text-[13px]">
            💡 <strong className="text-fg">Note:</strong> Official volunteer IDs
            and portal access are granted only after verification and committee
            approval. You will be contacted via phone or email once your status
            is updated.
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              className="bg-volt text-ink hover:bg-lime cursor-pointer rounded-full border-none px-6 py-3.5 font-sans text-[14px] font-bold whitespace-nowrap"
              onClick={onReset}
              type="button"
            >
              {successPanel.resetLabel}
            </button>
          </div>
        </div>
      </output>
    </section>
  );
};
