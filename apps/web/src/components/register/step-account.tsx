import {
  fieldGridClass,
  InputField,
  SelectField,
} from "@/components/site/design-fields";

import { ChoiceCard } from "./choice-card";
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
  <>
    <div
      aria-label="Registering as"
      className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3"
      role="radiogroup"
    >
      {accountRoles.map((role) => (
        <ChoiceCard
          name="registrant-role"
          color={role.color}
          description={role.description}
          key={role.value}
          kicker={role.badge}
          onSelect={() => onChange({ role: role.value })}
          selected={account.role === role.value}
          title={role.title}
        />
      ))}
    </div>
    <div
      className="mt-2.5 mb-2 min-h-4 text-[12px] text-[#FF8A7A]"
      role="alert"
    >
      {errors.role}
    </div>
    <div className={fieldGridClass}>
      <InputField
        autoComplete="name"
        error={errors.fullName}
        id="account-full-name"
        label="Full name"
        onValueChange={(fullName) => onChange({ fullName })}
        placeholder="As in school records"
        requirement="required"
        value={account.fullName}
      />
      <InputField
        autoComplete="email"
        error={errors.email}
        id="account-email"
        inputMode="email"
        label="Email"
        onValueChange={(email) => onChange({ email })}
        placeholder="you@school.lk"
        requirement="required"
        type="email"
        value={account.email}
      />
      <InputField
        autoComplete="username"
        error={errors.username}
        hint={accountCopy.usernameHint}
        id="account-username"
        label="Username"
        onValueChange={(username) => onChange({ username })}
        placeholder="your-username"
        requirement="required"
        value={account.username}
      />
      <InputField
        autoComplete="new-password"
        error={errors.password}
        hint={accountCopy.passwordHint}
        id="account-password"
        label="Password"
        onValueChange={(password) => onChange({ password })}
        placeholder="••••••••"
        requirement="required"
        type="password"
        value={account.password}
      />
      <InputField
        error={errors.nationalId}
        id="account-national-id"
        label="National ID"
        onValueChange={(nationalId) => onChange({ nationalId })}
        placeholder="e.g. 199012345678"
        requirement="required"
        value={account.nationalId}
      />
      <InputField
        error={errors.birthday}
        hint={accountCopy.birthdayHint}
        id="account-birthday"
        label="Birthday"
        onValueChange={(birthday) => onChange({ birthday })}
        placeholder="YYYY-MM-DD"
        requirement="required"
        value={account.birthday}
      />
      <SelectField
        error={errors.grade}
        id="account-grade"
        label="Grade"
        onValueChange={(grade) => onChange({ grade: grade || null })}
        options={accountCopy.gradeOptions}
        requirement="required"
        value={account.grade ?? ""}
      />
    </div>
    <div className="text-muted mt-2 rounded-[14px] border border-dashed border-[rgba(185,245,208,0.18)] px-5 py-4 text-[14px] leading-[1.55]">
      <span className="text-fg font-semibold">{accountCopy.studentsTitle}</span>{" "}
      {accountCopy.studentsNote}
    </div>
  </>
);
