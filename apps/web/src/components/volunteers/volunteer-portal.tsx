import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";

import type { StudentDetails } from "./data";
import { idCard, roleLabels } from "./data";
import { VolunteerIdCard } from "./volunteer-id-card";

export interface VolunteerPortalApplication {
  reference: string;
  teams: string[];
  fullName: string;
  school: string;
  admissionNumber: string | null;
  grade: string;
  className: string;
  contactNumber: string;
  email: string | null;
}

interface VolunteerPortalProps {
  application: VolunteerPortalApplication | null;
}

export const VolunteerPortal = ({ application }: VolunteerPortalProps) => (
  <main className="bg-ink min-h-svh overflow-x-hidden px-[clamp(20px,5vw,64px)] py-32">
    <Container className="max-w-[720px]">
      <Kicker tone="gold">Volunteer</Kicker>
      <h1 className="mt-5 text-[clamp(32px,5vw,52px)] leading-[0.95] tracking-[-0.04em]">
        {application ? "You're on the crew." : "Your application is pending."}
      </h1>

      {application ? (
        <>
          <p className="text-muted mt-5 max-w-[520px] text-[16px] leading-[1.65]">
            Welcome to the BYTE QUEST crew, {application.fullName.split(" ")[0]}
            . Here&apos;s your volunteer ID — the organising committee will
            reach out with your first assignment.
          </p>
          <div className="mt-10 flex justify-center">
            <VolunteerIdCard
              photo={null}
              reference={application.reference}
              roles={roleLabels(application.teams)}
              student={
                {
                  fullName: application.fullName,
                  school: application.school,
                  admissionNumber: application.admissionNumber ?? "",
                  grade: application.grade,
                  className: application.className,
                  contactNumber: application.contactNumber,
                  email: application.email ?? "",
                } satisfies StudentDetails
              }
            />
          </div>
          <p className="text-faint mt-10 text-center text-[13px] leading-[1.6]">
            {idCard.tagline}
          </p>
        </>
      ) : (
        <p className="text-muted mt-5 max-w-[520px] text-[16px] leading-[1.65]">
          We couldn&apos;t find an approved application linked to this account
          yet. If you believe this is a mistake, contact the organising
          committee.
        </p>
      )}
    </Container>
  </main>
);
