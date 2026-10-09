import { Callout } from "@byte-quest/ui/components/callout";
import { Container } from "@byte-quest/ui/components/container";
import { TextareaField, TextField } from "@byte-quest/ui/components/fields";
import { Check } from "@byte-quest/ui/components/icons";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Section } from "@byte-quest/ui/components/section";
import { Button } from "@byte-quest/ui/primitives/button";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { ArrowLabel } from "@/components/site/arrow-label";
import { PageHero } from "@/components/site/page-hero";
import { orpc } from "@/utils/orpc";

import { adminApplyCopy, initialApplication } from "./data";
import type { ApplicationErrors, ApplicationFields } from "./data";

const EMAIL_PATTERN = /^[^@\s@]+@[^\s@]+\.[^@\s@]+$/u;
const USERNAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/u;

const validate = (fields: ApplicationFields): ApplicationErrors => {
  const errors: ApplicationErrors = {};
  if (fields.fullName.trim().length === 0) {
    errors.fullName = adminApplyCopy.required;
  }
  if (!EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = adminApplyCopy.email;
  }
  if (fields.username.trim().length < 3) {
    errors.username = adminApplyCopy.usernameLength;
  } else if (!USERNAME_PATTERN.test(fields.username.trim())) {
    errors.username = adminApplyCopy.username;
  }
  if (fields.organization.trim().length === 0) {
    errors.organization = adminApplyCopy.required;
  }
  if (fields.role.trim().length === 0) {
    errors.role = adminApplyCopy.required;
  }
  if (fields.experience.trim().length < 20) {
    errors.experience = adminApplyCopy.experience;
  }
  return errors;
};

export const AdminApplication = () => {
  const [fields, setFields] = useState<ApplicationFields>(initialApplication);
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (patch: Partial<ApplicationFields>) => {
    setFields((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof ApplicationErrors)[]) {
        next[key] = undefined;
      }
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(fields);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error(adminApplyCopy.incomplete);
      return;
    }

    setPending(true);
    let failure: string | null = null;
    try {
      await orpc.access.applyForAdmin.call({
        fullName: fields.fullName.trim(),
        email: fields.email.trim(),
        username: fields.username.trim().toLowerCase(),
        organization: fields.organization.trim(),
        role: fields.role.trim(),
        experience: fields.experience.trim(),
      });
    } catch (error) {
      failure =
        error instanceof Error && error.message
          ? error.message
          : adminApplyCopy.failed;
    }
    setPending(false);

    if (failure !== null) {
      setErrors({ email: failure });
      toast.error(failure);
      return;
    }

    setSubmitted(true);
    toast.success(adminApplyCopy.received);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <main className="bg-ink">
        <PageHero
          id="apply-admin"
          kicker={adminApplyCopy.kicker}
          kickerTone="gold"
          title={adminApplyCopy.receivedTitle}
        />
        <Section tone="base">
          <Container>
            <div className="border-volt/25 bg-surface rounded-[28px] border p-[clamp(28px,4vw,48px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <span className="bg-volt text-ink flex size-14 items-center justify-center rounded-full shadow-[0_0_40px_rgba(82,255,61,0.45)]">
                <Check className="size-7" />
              </span>
              <h2 className="font-display mt-6 text-[clamp(26px,3.4vw,40px)] leading-[1.05] tracking-[-0.03em]">
                Application received.
              </h2>
              <p className="text-muted mt-4 max-w-[560px] text-[15.5px] leading-[1.65]">
                An organising committee member will review your application. You
                will hear from us at{" "}
                <span className="text-fg">{fields.email.trim()}</span> once a
                decision is made.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <Button
                  onClick={() => {
                    setFields(initialApplication);
                    setSubmitted(false);
                  }}
                  variant="outline"
                >
                  Submit another application
                </Button>
                <Link
                  className="text-muted-2 hover:text-volt inline-flex min-h-8 items-center font-mono text-[11.5px] tracking-[0.1em] transition-colors"
                  to="/"
                >
                  <ArrowLabel>← BACK TO HOME</ArrowLabel>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  return (
    <main className="bg-ink">
      <PageHero
        id="apply-admin"
        kicker={adminApplyCopy.kicker}
        kickerTone="gold"
        lead={adminApplyCopy.lede}
        title={adminApplyCopy.title}
      />

      <Section tone="base">
        <Container>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-10">
            <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
              <div className="border-gold/22 rounded-[20px] border bg-[radial-gradient(60%_80%_at_0%_0%,rgba(212,175,55,0.08),transparent_60%),#030F0B] p-[clamp(20px,3vw,32px)]">
                <TextField
                  error={errors.fullName}
                  id="apply-full-name"
                  label="Full name"
                  onValueChange={(fullName) => update({ fullName })}
                  placeholder="Your full name"
                  required
                  value={fields.fullName}
                />
                <div className="mt-4 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
                  <TextField
                    autoComplete="email"
                    error={errors.email}
                    id="apply-email"
                    inputMode="email"
                    label="Email"
                    onValueChange={(email) => update({ email })}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={fields.email}
                  />
                  <TextField
                    description={adminApplyCopy.usernameHint}
                    error={errors.username}
                    id="apply-username"
                    label="Desired username"
                    onValueChange={(username) => update({ username })}
                    placeholder="your-username"
                    required
                    value={fields.username}
                  />
                  <TextField
                    error={errors.organization}
                    id="apply-organisation"
                    label="Organisation"
                    onValueChange={(organization) => update({ organization })}
                    placeholder="School, company or institution"
                    required
                    value={fields.organization}
                  />
                  <TextField
                    error={errors.role}
                    id="apply-role"
                    label="Your role"
                    onValueChange={(role) => update({ role })}
                    placeholder="e.g. ICT Teacher"
                    required
                    value={fields.role}
                  />
                </div>
                <div className="mt-4">
                  <TextareaField
                    description={adminApplyCopy.experienceHint}
                    error={errors.experience}
                    id="apply-experience"
                    label="Why should you join the organising committee?"
                    onValueChange={(experience) => update({ experience })}
                    placeholder="Tell us about your experience mentoring or teaching students."
                    required
                    rows={5}
                    value={fields.experience}
                  />
                </div>
              </div>

              <Button aria-busy={pending} disabled={pending} type="submit">
                {pending ? (
                  "Submitting…"
                ) : (
                  <ArrowLabel>{adminApplyCopy.submit}</ArrowLabel>
                )}
              </Button>
            </form>

            <aside className="lg:sticky lg:top-[110px] lg:h-fit">
              <div className="border-line-soft bg-surface rounded-[20px] border p-[clamp(20px,3vw,28px)]">
                <Kicker tone="faint">What happens next</Kicker>
                <ol className="mt-5 grid gap-4">
                  {adminApplyCopy.steps.map((entry, index) => (
                    <li className="flex gap-4" key={entry.n}>
                      <span className="text-teal font-mono text-[11px] tracking-[0.12em]">
                        {entry.n}
                      </span>
                      <div>
                        <div className="font-display text-fg text-[15px] font-semibold">
                          {entry.title}
                        </div>
                        <div className="text-muted-2 mt-1 text-[13.5px] leading-[1.55]">
                          {entry.detail}
                        </div>
                      </div>
                      {index < adminApplyCopy.steps.length - 1 ? null : null}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-4">
                <Callout tone="warning" title="Admins approve admin access">
                  {adminApplyCopy.approvalNote}
                </Callout>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </main>
  );
};
