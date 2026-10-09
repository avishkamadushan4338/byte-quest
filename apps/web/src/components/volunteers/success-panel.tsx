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
  "text-faint font-mono text-[12.5px] tracking-[0.16em] uppercase whitespace-nowrap";

export const SuccessPanel = ({
  onReset,
  reference,
  roles,
  student,
}: SuccessPanelProps) => {
  const [firstWord] = student.fullName.trim().split(/\s+/u);
  const firstName = firstWord || successPanel.fallbackName;

  const details = [
    { label: successPanel.idLabel, mono: true, value: reference },
    { label: "Teams", mono: false, value: roles.join(", ") },
    { label: "School", mono: false, value: student.school },
  ];

  return (
    <section className="px-[clamp(20px,5vw,64px)] pb-[clamp(64px,8vw,112px)]">
      <output
        className="relative mx-auto flex max-w-[820px] flex-col overflow-hidden rounded-[28px] border border-[rgba(255,200,61,0.22)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)]"
        style={{
          background:
            "radial-gradient(70% 90% at 85% 0%, rgba(255,200,61,0.09), transparent 60%), linear-gradient(180deg, #05160F 0%, #030F0B 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,200,61,0.7), transparent)",
          }}
        />

        <div className="flex flex-col gap-8 p-[clamp(24px,4.5vw,60px)]">
          <header className="flex flex-col gap-5">
            <div className="border-gold-bright/30 bg-gold-bright/10 text-gold-bright inline-flex w-fit items-center gap-2.5 rounded-full border px-3.5 py-1.5 font-mono text-[12.5px] tracking-[0.18em]">
              <span className="relative flex size-2">
                <span className="bg-gold-bright absolute inline-flex size-full animate-ping rounded-full opacity-60" />
                <span className="bg-gold-bright relative inline-flex size-2 rounded-full" />
              </span>
              APPLICATION RECEIVED
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-faint font-mono text-[13px] tracking-[0.2em]">
                {successPanel.kicker}
              </span>
              <h2 className="m-0 text-[clamp(34px,4.6vw,56px)] leading-[1.02] tracking-[-0.04em]">
                {successPanel.titleStart} {firstName}.
              </h2>
              <p className="text-muted m-0 text-[clamp(16px,1.6vw,19px)]">
                {successPanel.body}
              </p>
            </div>
          </header>

          <dl className="m-0 flex flex-col overflow-hidden rounded-[18px] border border-[rgba(185,245,208,0.12)] bg-[rgba(0,0,0,0.35)]">
            {details.map((item) => (
              <div
                className="grid grid-cols-1 gap-1 border-b border-[rgba(185,245,208,0.08)] px-5 py-4 last:border-b-0 sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-6"
                key={item.label}
              >
                <dt className={metaLabelClass}>{item.label}</dt>
                <dd
                  className={`m-0 ${
                    item.mono
                      ? "text-volt font-mono text-[15px] font-bold tracking-[0.08em]"
                      : "text-fg text-[14.5px]"
                  }`}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-muted m-0 border-l-2 border-[rgba(255,200,61,0.45)] pl-4 text-[15px] leading-[1.65]">
            <strong className="text-fg font-semibold">Please note.</strong>{" "}
            Approved volunteers will be added to the WhatsApp group and issued
            an official ID. This happens only after verification and committee
            approval.
          </p>

          <div>
            <button
              className="text-fg hover:border-gold-bright/60 hover:text-gold-bright cursor-pointer rounded-full border border-[rgba(255,255,255,0.18)] bg-transparent px-6 py-3.5 font-sans text-[15.5px] font-semibold whitespace-nowrap transition-colors"
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
