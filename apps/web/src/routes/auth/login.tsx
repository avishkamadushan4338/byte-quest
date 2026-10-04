import { Brand } from "@byte-quest/ui/components/brand";
import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";

import { OtpSignIn } from "@/components/auth/otp-sign-in";
import { getUser } from "@/functions/get-user";

const steps = [
  {
    n: "01",
    title: "Enter your school email",
    detail: "Students, mentors and organisers all sign in the same way.",
  },
  {
    n: "02",
    title: "Paste the 6-digit code",
    detail: "The code lands in your inbox and expires in five minutes.",
  },
  {
    n: "03",
    title: "Start building",
    detail: "Create your profile, form a team and enter the quest.",
  },
];

const LoginRoute = () => (
  <main className="relative min-h-svh overflow-hidden px-[clamp(20px,5vw,64px)] py-32">
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(50% 55% at 20% 30%, rgba(8,122,85,0.35), transparent 65%), radial-gradient(45% 50% at 85% 75%, rgba(212,175,55,0.08), transparent 70%), #020807",
      }}
    />

    <Container className="relative max-w-[1120px]">
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-14">
        <div>
          <Kicker tone="volt">Access the Quest</Kicker>
          <h1 className="mt-5 text-[clamp(40px,6vw,72px)] leading-[0.92] tracking-[-0.045em]">
            Sign in with a one-time code.
          </h1>
          <p className="text-muted mt-5 max-w-[460px] text-[17px] leading-[1.65]">
            BYTE QUEST runs on email OTP — we send a 6-digit code to your inbox,
            you enter it, you&apos;re in. No passwords, no forms.
          </p>

          <div className="border-line-soft mt-9 grid gap-4 border-y py-7">
            {steps.map((step) => (
              <div className="flex gap-4" key={step.n}>
                <span className="text-teal font-mono text-[11px] tracking-[0.12em]">
                  {step.n}
                </span>
                <div>
                  <div className="font-display text-fg text-[16px] font-semibold">
                    {step.title}
                  </div>
                  <div className="text-muted-2 mt-1 text-[14px] leading-[1.5]">
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            className="text-muted-2 hover:text-volt mt-7 inline-flex font-mono text-[11.5px] tracking-[0.1em] transition-colors"
            to="/"
          >
            ← BACK TO HOME
          </Link>
        </div>

        <div className="border-line-soft bg-surface rounded-3xl border p-[clamp(24px,4vw,36px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="border-line-soft mb-7 flex items-center justify-between gap-4 border-b pb-5">
            <div>
              <div className="text-muted-2 font-mono text-[10.5px] tracking-[0.16em]">
                ONE-TIME PASSWORD
              </div>
              <div className="font-display mt-2 text-[24px] font-bold tracking-[-0.02em]">
                Enter the quest
              </div>
            </div>
            <Brand className="text-[15px]" />
          </div>
          <OtpSignIn />
          <p className="text-faint mt-6 text-[13px] leading-[1.6]">
            Registration is open to school teams. Your first code creates your
            account automatically.
          </p>
        </div>
      </div>
    </Container>
  </main>
);

export const Route = createFileRoute("/auth/login")({
  beforeLoad: async () => {
    const session = await getUser();
    if (session) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [{ title: "Sign in | BYTE QUEST" }],
  }),
  component: LoginRoute,
});
