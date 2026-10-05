import type { StudentDetails, VolunteerPhoto } from "./data";
import { successPanel } from "./data";
import { renderVolunteerIdCard, VolunteerIdCard } from "./volunteer-id-card";

interface SuccessPanelProps {
  onReset: () => void;
  photo: VolunteerPhoto | null;
  reference: string;
  roles: string[];
  student: StudentDetails;
}

const metaLabelClass =
  "text-faint pt-0.5 font-mono text-[10.5px] tracking-[0.12em] whitespace-nowrap";

export const SuccessPanel = ({
  onReset,
  photo,
  reference,
  roles,
  student,
}: SuccessPanelProps) => {
  const [firstWord] = student.fullName.trim().split(/\s+/u);
  const firstName = firstWord || successPanel.fallbackName;

  const handleDownload = () => {
    void renderVolunteerIdCard({
      photoUrl: photo?.url ?? null,
      reference,
      roles,
      student,
    });
  };

  return (
    <section className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]">
      <output
        className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-[clamp(28px,5vw,64px)] rounded-[28px] border border-[rgba(82,255,61,0.2)] p-[clamp(24px,4vw,56px)]"
        style={{
          background:
            "radial-gradient(60% 80% at 80% 0%, rgba(82,255,61,0.08), transparent 60%), #030F0B",
        }}
      >
        <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-[18px]">
          <div className="text-volt flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em]">
            <span className="bg-volt text-ink flex size-[22px] items-center justify-center rounded-full text-[12px] font-bold">
              ✓
            </span>
            {successPanel.kicker}
          </div>
          <h2 className="m-0 text-[clamp(32px,4vw,54px)] leading-[0.98] tracking-[-0.035em]">
            {successPanel.titleStart} {firstName}.
          </h2>
          <p className="text-muted m-0 max-w-[440px] text-[15.5px] leading-[1.6]">
            {successPanel.body}
          </p>
          <div className="bg-ink grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-2.5 rounded-[14px] border border-[rgba(185,245,208,0.1)] px-[18px] py-4 text-[13.5px]">
            <span className={metaLabelClass}>{successPanel.idLabel}</span>
            <span className="text-volt font-mono tracking-[0.06em]">
              {reference}
            </span>
            <span className={metaLabelClass}>{successPanel.statusLabel}</span>
            <span className="text-gold-bright">{successPanel.statusValue}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              className="bg-volt text-ink hover:bg-lime cursor-pointer rounded-full border-none px-[22px] py-3.5 font-sans text-[14px] font-bold whitespace-nowrap"
              onClick={handleDownload}
              type="button"
            >
              {successPanel.downloadLabel}
            </button>
            <button
              className="text-fg hover:border-volt cursor-pointer rounded-full border border-[rgba(242,247,244,0.25)] bg-transparent px-[22px] py-3.5 font-sans text-[14px] font-semibold whitespace-nowrap"
              onClick={onReset}
              type="button"
            >
              {successPanel.resetLabel}
            </button>
          </div>
        </div>
        <VolunteerIdCard
          photo={photo}
          reference={reference}
          roles={roles}
          student={student}
        />
      </output>
    </section>
  );
};
