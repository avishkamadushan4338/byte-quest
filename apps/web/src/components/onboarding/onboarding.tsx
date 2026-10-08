import { Callout } from "@byte-quest/ui/components/callout";
import { Card } from "@byte-quest/ui/components/card";
import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";
import { Checklist } from "@byte-quest/ui/components/steps";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { PageHero } from "@/components/site/page-hero";
import { orpc } from "@/utils/orpc";

import type { ProfileDetails, ProfileErrors } from "./data";
import {
  initialProfile,
  onboardingAside,
  onboardingHero,
  profileCopy,
  profileValidation,
} from "./data";
import { ProfileForm } from "./profile-form";

const BIRTHDAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;

const validateProfile = (profile: ProfileDetails): ProfileErrors => {
  const errors: ProfileErrors = {};

  if (profile.fullName.trim().length === 0) {
    errors.fullName = profileValidation.required;
  }
  if (profile.nationalId.trim().length === 0) {
    errors.nationalId = profileValidation.required;
  }
  if (!BIRTHDAY_PATTERN.test(profile.birthday.trim())) {
    errors.birthday = profileValidation.birthday;
  }
  if (profile.grade === null) {
    errors.grade = profileValidation.required;
  }

  return errors;
};

export const Onboarding = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileDetails>(initialProfile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [pending, setPending] = useState(false);

  const handleProfileChange = (patch: Partial<ProfileDetails>) => {
    setProfile((current) => ({ ...current, ...patch }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateProfile(profile);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || profile.grade === null) {
      toast.error(profileCopy.incomplete);
      return;
    }

    setPending(true);

    try {
      await orpc.access.signup.call({
        fullName: profile.fullName.trim(),
        nationalId: profile.nationalId.trim(),
        birthday: profile.birthday.trim(),
        grade: profile.grade,
      });
      toast.success(profileCopy.successMessage);
      await navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : profileCopy.failureMessage
      );
    }

    setPending(false);
  };

  const profileDone =
    profile.fullName.trim().length > 0 &&
    profile.nationalId.trim().length > 0 &&
    profile.birthday.trim().length > 0 &&
    profile.grade !== null;

  const checklist = onboardingAside.checklistLabels.map((label, index) => ({
    label,
    done: index === 0 ? profileDone : false,
  }));

  return (
    <main className="bg-ink">
      <PageHero
        id="onboarding"
        kicker={onboardingHero.kicker}
        kickerTone="volt"
        lead={onboardingHero.lead}
        title={onboardingHero.title}
      />

      <Section tone="base">
        <Container>
          <div className="flex flex-wrap items-start gap-5">
            <ProfileForm
              errors={errors}
              onErrorsChange={setErrors}
              onProfileChange={handleProfileChange}
              onSubmit={handleSubmit}
              pending={pending}
              profile={profile}
            />

            <aside className="flex-[1_1_300px] lg:sticky lg:top-[100px]">
              <Card className="grid gap-5 rounded-[20px] p-[clamp(20px,3vw,28px)]">
                <Kicker tone="volt">{onboardingAside.kicker}</Kicker>

                <Checklist items={checklist} />

                <Callout title={onboardingAside.calloutTitle} tone="info">
                  {onboardingAside.calloutBody}
                </Callout>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>
    </main>
  );
};
