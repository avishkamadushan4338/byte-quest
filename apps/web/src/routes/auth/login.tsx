import { Brand } from "@byte-quest/ui/components/brand";
import { Container } from "@byte-quest/ui/components/container";
import { Kicker } from "@byte-quest/ui/components/kicker";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";

import { SignInForm } from "@/components/auth/sign-in-form";
import { getUser } from "@/functions/get-user";

const accountTypes = [
  {
    n: "01",
    title: "Team captains",
    detail:
      "Issued by the organising committee once your team's registration is reviewed.",
  },
  {
    n: "02",
    title: "Volunteers",
    detail: "Issued once your volunteer application is approved.",
  },
  {
    n: "03",
    title: "Organising committee",
    detail: "Admin access is granted only after an application is approved.",
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
            Sign in with your username.
          </h1>
          <p className="text-muted mt-5 max-w-[460px] text-[17px] leading-[1.65]">
            BYTE QUEST uses a username and password. Schools and volunteers do
            not create their own account — the organising committee issues one
            once a team registration or volunteer application is reviewed.
          </p>

          <div className="border-line-soft mt-9 grid gap-4 border-y py-7">
            {accountTypes.map((account) => (
              <div className="flex gap-4" key={account.n}>
                <span className="text-teal font-mono text-[11px] tracking-[0.12em]">
                  {account.n}
                </span>
                <div>
                  <div className="font-display text-fg text-[16px] font-semibold">
                    {account.title}
                  </div>
                  <div className="text-muted-2 mt-1 text-[14px] leading-[1.5]">
                    {account.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              className="text-muted-2 hover:text-volt inline-flex font-mono text-[11.5px] tracking-[0.1em] transition-colors"
              to="/"
            >
              ← BACK TO HOME
            </Link>
            <Link
              className="text-muted-2 hover:text-volt inline-flex font-mono text-[11.5px] tracking-[0.1em] transition-colors"
              to="/register/team"
            >
              REGISTER A TEAM →
            </Link>
            <Link
              className="text-muted-2 hover:text-volt inline-flex font-mono text-[11.5px] tracking-[0.1em] transition-colors"
              to="/apply-admin"
            >
              APPLY FOR ADMIN →
            </Link>
          </div>
        </div>

        <div className="border-line-soft bg-surface rounded-3xl border p-[clamp(24px,4vw,36px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="border-line-soft mb-7 flex items-center justify-between gap-4 border-b pb-5">
            <div>
              <div className="text-muted-2 font-mono text-[10.5px] tracking-[0.16em]">
                ACCOUNT
              </div>
              <div className="font-display mt-2 text-[24px] font-bold tracking-[-0.02em]">
                Enter the quest
              </div>
            </div>
            <Brand className="text-[15px]" />
          </div>
          <SignInForm />
          <p className="text-faint mt-6 text-[13px] leading-[1.6]">
            No account yet? Register your{" "}
            <Link className="text-volt" to="/register/team">
              team
            </Link>{" "}
            or apply to{" "}
            <Link className="text-volt" to="/register/volunteer">
              volunteer
            </Link>{" "}
            and the organising committee will issue your login once it&apos;s
            reviewed. Committee members apply for admin access.
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
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [{ title: "Sign in | BYTE QUEST" }],
  }),
  component: LoginRoute,
});
