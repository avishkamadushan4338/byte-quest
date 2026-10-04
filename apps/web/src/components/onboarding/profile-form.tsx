import { Card } from "@byte-quest/ui/components/card";
import { SelectField, TextField } from "@byte-quest/ui/components/fields";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";
import type { FormEvent } from "react";

import type { ProfileDetails, ProfileErrors } from "./data";
import { gradeOptions, profileCopy } from "./data";

interface ProfileFormProps {
  errors: ProfileErrors;
  onErrorsChange: (errors: ProfileErrors) => void;
  onProfileChange: (patch: Partial<ProfileDetails>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  pending: boolean;
  profile: ProfileDetails;
}

export const ProfileForm = ({
  errors,
  onErrorsChange,
  onProfileChange,
  onSubmit,
  pending,
  profile,
}: ProfileFormProps) => (
  <div className="min-w-0 flex-[3_1_560px]">
    <Card className="border-line-soft rounded-2xl p-[clamp(22px,3.5vw,36px)]">
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          onErrorsChange({});
          onSubmit(event);
        }}
      >
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
          <TextField
            autoComplete="name"
            error={errors.fullName}
            id="profile-full-name"
            label="Full name"
            onValueChange={(value) => onProfileChange({ fullName: value })}
            placeholder="As in school records"
            required
            value={profile.fullName}
          />
          <TextField
            error={errors.nationalId}
            id="profile-national-id"
            inputMode="numeric"
            label="National ID"
            onValueChange={(value) => onProfileChange({ nationalId: value })}
            placeholder="e.g. 199012345678"
            required
            value={profile.nationalId}
          />
          <TextField
            description="Use the YYYY-MM-DD format"
            error={errors.birthday}
            id="profile-birthday"
            label="Birthday"
            maxLength={10}
            onValueChange={(value) => onProfileChange({ birthday: value })}
            placeholder="YYYY-MM-DD"
            required
            type="text"
            value={profile.birthday}
          />
          <SelectField
            error={errors.grade}
            id="profile-grade"
            label="Grade"
            onValueChange={(value) => onProfileChange({ grade: value })}
            options={gradeOptions}
            placeholder="Select grade"
            required
            value={profile.grade}
          />
        </div>

        <div className="border-line-soft flex flex-wrap items-center gap-2.5 border-t pt-5">
          <Button aria-busy={pending} disabled={pending} type="submit">
            {pending ? profileCopy.submittingLabel : profileCopy.submitLabel}
          </Button>
          <Button
            aria-label={profileCopy.skipAriaLabel}
            render={<Link to="/" />}
            variant="ghost"
          >
            {profileCopy.skipLabel}
          </Button>
        </div>
      </form>
    </Card>
  </div>
);
