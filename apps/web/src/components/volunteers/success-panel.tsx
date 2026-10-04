import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { DataItem, DataList } from "@byte-quest/ui/components/data-list";
import { Check } from "@byte-quest/ui/components/icons";
import { Section } from "@byte-quest/ui/components/section";
import { Button } from "@byte-quest/ui/primitives/button";

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
    <Section>
      <Container>
        <output className="block">
          <Card
            className="border-volt/20 flex flex-row flex-wrap items-center gap-[clamp(28px,5vw,64px)] rounded-[28px] p-[clamp(28px,4vw,48px)]"
            style={{
              background:
                "radial-gradient(60% 80% at 80% 0%, rgba(82,255,61,0.08), transparent 60%), #030f0b",
            }}
          >
            <div className="flex-[1_1_340px]">
              <div className="flex items-center gap-3">
                <span className="bg-volt text-ink flex size-[22px] items-center justify-center rounded-full">
                  <Check className="size-3.5" />
                </span>
                <span className="text-volt font-mono text-[11px] tracking-[0.16em]">
                  {successPanel.kicker}
                </span>
              </div>

              <h2 className="text-fg mt-5 text-[clamp(28px,3.4vw,44px)] leading-[0.98] tracking-[-0.04em]">
                {successPanel.titleStart} {firstName}.
              </h2>
              <p className="text-muted mt-4 max-w-[480px] text-[16px] leading-[1.65]">
                {successPanel.body}
              </p>

              <div className="border-line bg-ink mt-7 rounded-[14px] border p-5">
                <DataList
                  className="gap-5"
                  columns="minmax(min(100%,180px),1fr)"
                >
                  <DataItem
                    label={successPanel.idLabel}
                    value={reference}
                    valueClassName="font-mono text-volt"
                  />
                  <DataItem
                    label={successPanel.statusLabel}
                    value={successPanel.statusValue}
                    valueClassName="text-gold-bright"
                  />
                </DataList>
              </div>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <Button onClick={handleDownload}>
                  {successPanel.downloadLabel}
                </Button>
                <Button onClick={onReset} variant="outline">
                  {successPanel.resetLabel}
                </Button>
              </div>
            </div>

            <div className="flex-[0_1_460px]">
              <VolunteerIdCard
                photo={photo}
                reference={reference}
                roles={roles}
                student={student}
              />
            </div>
          </Card>
        </output>
      </Container>
    </Section>
  );
};
