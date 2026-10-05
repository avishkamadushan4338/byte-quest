import { Callout } from "@byte-quest/ui/components/callout";
import {
  RadioCardField,
  SelectField,
  TextField,
} from "@byte-quest/ui/components/fields";
import { Info } from "@byte-quest/ui/components/icons";

import { accountCopy, accountRoles } from "./data";
import type { AccountDetails, AccountErrors } from "./data";

interface StepAccountProps {
  account: AccountDetails;
  errors: AccountErrors;
  onChange: (patch: Partial<AccountDetails>) => void;
}

export const StepAccount = ({
  account,
  errors,
  onChange,
}: StepAccountProps) => (
  <div className="grid gap-6">
    <RadioCardField
      columns="minmax(min(100%,260px),1fr)"
      error={errors.role}
      legend="Registering as"
      name="registrantRole"
      onValueChange={(value) =>
        onChange({ role: value === "mic" ? "mic" : "leader" })
      }
      options={accountRoles}
      value={account.role}
    />

    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
      <TextField
        error={errors.fullName}
        id="account-full-name"
        label="Full name"
        onValueChange={(fullName) => onChange({ fullName })}
        placeholder="As in school records"
        required
        value={account.fullName}
      />
      <TextField
        autoComplete="email"
        error={errors.email}
        id="account-email"
        inputMode="email"
        label="Email"
        onValueChange={(email) => onChange({ email })}
        placeholder="you@school.lk"
        required
        type="email"
        value={account.email}
      />
      <TextField
        description={accountCopy.usernameHint}
        error={errors.username}
        id="account-username"
        label="Username"
        onValueChange={(username) => onChange({ username })}
        placeholder="your-username"
        required
        value={account.username}
      />
      <TextField
        description={accountCopy.passwordHint}
        error={errors.password}
        id="account-password"
        label="Password"
        onValueChange={(password) => onChange({ password })}
        placeholder="••••••••"
        required
        type="password"
        value={account.password}
      />
      <TextField
        error={errors.nationalId}
        id="account-national-id"
        label="National ID"
        onValueChange={(nationalId) => onChange({ nationalId })}
        placeholder="e.g. 199012345678"
        required
        value={account.nationalId}
      />
      <TextField
        description={accountCopy.birthdayHint}
        error={errors.birthday}
        id="account-birthday"
        label="Birthday"
        onValueChange={(birthday) => onChange({ birthday })}
        placeholder="YYYY-MM-DD"
        required
        value={account.birthday}
      />
      <SelectField
        error={errors.grade}
        id="account-grade"
        label="Grade"
        onValueChange={(grade) => onChange({ grade })}
        options={accountCopy.gradeOptions}
        required
        value={account.grade}
      />
    </div>

    <Callout
      icon={<Info className="size-4.5" />}
      title="Students don't register here"
    >
      {accountCopy.studentsNote}
    </Callout>
  </div>
);
