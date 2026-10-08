import type { PolicyMeta } from "./policy-page";

export const privacyPolicy: PolicyMeta = {
  slug: "privacy",
  title: "Privacy Policy",
  pageTitle: "Privacy | BYTE QUEST",
  kicker: "PRIVACY",
  lede: "What BYTE QUEST collects, why we collect it, and what we never do with it.",
  sections: [
    {
      id: "what-we-collect",
      heading: "What we collect",
      body: (
        <>
          <p>
            We collect only what the programme needs to run: your email address,
            full name, national ID, date of birth, grade and the school you
            represent. If you volunteer or submit a project, we also collect the
            details you enter on those forms.
          </p>
          <p>
            We never collect passwords. Signing in uses a one-time code sent to
            your inbox, so there is no credential for us to hold or leak.
          </p>
        </>
      ),
    },
    {
      id: "why-we-collect",
      heading: "Why we collect it",
      body: (
        <>
          <p>
            Identification data is required to register a student for the Grand
            Final and to verify eligibility for a division. Contact details are
            used only by the organising committee to coordinate teams, mentors
            and volunteers.
          </p>
          <p>
            Your grade determines whether you compete in the primary or
            secondary division, and your school determines which team you belong
            to.
          </p>
        </>
      ),
    },
    {
      id: "who-sees-it",
      heading: "Who can see it",
      body: (
        <>
          <p>
            Student details are private by default. Other students see only the
            minimum needed to run a team: a display name, grade and role. Full
            identification data is visible only to the organising committee.
          </p>
          <p>
            Sponsors and mentors do not receive student identification data.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      heading: "How long we keep it",
      body: (
        <p>
          We keep your data for the duration of the programme and for as long
          afterwards as the organising committee is required to retain
          competition records. You can ask us to delete your account at any time
          by contacting the committee.
        </p>
      ),
    },
    {
      id: "your-rights",
      heading: "Your rights",
      body: (
        <p>
          You may request a copy of the data we hold about you, ask us to
          correct it, or ask us to remove it. Contact the organising committee
          and we will respond.
        </p>
      ),
    },
  ],
};

export const termsPolicy: PolicyMeta = {
  slug: "terms",
  title: "Terms of Participation",
  pageTitle: "Terms | BYTE QUEST",
  kicker: "TERMS",
  lede: "The ground rules every BYTE QUEST participant agrees to.",
  sections: [
    {
      id: "eligibility",
      heading: "Eligibility",
      body: (
        <>
          <p>
            Teams register through a school with a teacher in charge. Each team
            has three to five students, all in the grades for its division.
          </p>
          <p>
            Primary division teams compete in grades 6 to 9. Secondary division
            teams compete in grades 10 to 13.
          </p>
        </>
      ),
    },
    {
      id: "registration",
      heading: "Registration",
      body: (
        <p>
          A school may field one team per division. Registration details are
          confirmed with the school before a team is admitted, and a team is
          admitted only when every member&apos;s grade matches the chosen
          division.
        </p>
      ),
    },
    {
      id: "original-work",
      heading: "Original work",
      body: (
        <p>
          Projects must be the original work of the team. Teams may use open
          libraries, frameworks and AI tools, but must be able to explain every
          part of what they submit.
        </p>
      ),
    },
    {
      id: "conduct",
      heading: "Good conduct",
      body: (
        <p>
          Everyone taking part - students, mentors, volunteers and sponsors -
          agrees to the code of conduct. Behaviour that puts another participant
          at risk, or that misrepresents work, ends participation.
        </p>
      ),
    },
    {
      id: "submission-rights",
      heading: "Submission and judging",
      body: (
        <p>
          Each team may submit one project. Submissions are reviewed by the
          organising committee, and decisions on awards are final. The committee
          may publish project titles, descriptions and repositories as part of
          programme communications.
        </p>
      ),
    },
  ],
};

export const codeOfConductPolicy: PolicyMeta = {
  slug: "code-of-conduct",
  title: "Code of Conduct",
  pageTitle: "Code of Conduct | BYTE QUEST",
  kicker: "CODE OF CONDUCT",
  lede: "How we work together for twelve weeks.",
  sections: [
    {
      id: "respect",
      heading: "Respect everyone",
      body: (
        <p>
          Treat every student, mentor, volunteer and organiser with respect.
          Harassment, bullying, discrimination or intimidation of any kind is
          not tolerated at any programme event, online or in project work.
        </p>
      ),
    },
    {
      id: "safe-space",
      heading: "Keep it a safe space",
      body: (
        <p>
          Ask before photographing or recording someone. Keep your project and
          discussion free from offensive content. If something makes you
          uncomfortable, speak to your teacher in charge or any committee
          member.
        </p>
      ),
    },
    {
      id: "fair-play",
      heading: "Fair play",
      body: (
        <>
          <p>
            Do your own work. Share generously and credit properly, but do not
            copy another team&apos;s project, and do not attempt to disrupt
            another team.
          </p>
          <p>
            Mentors guide and review. They do not write code for a team or take
            over a project.
          </p>
        </>
      ),
    },
    {
      id: "property",
      heading: "Property and permissions",
      body: (
        <p>
          Use only equipment and software you are authorised to use. Anything
          you build stays yours; you grant the programme permission to showcase
          and award your work.
        </p>
      ),
    },
    {
      id: "reporting",
      heading: "Reporting",
      body: (
        <p>
          Report a concern to your teacher in charge or to the organising
          committee. Reports are handled discreetly and actioned under the
          programme&apos;s safeguarding process.
        </p>
      ),
    },
  ],
};

export const submissionGuidelinesPolicy: PolicyMeta = {
  slug: "submission-guidelines",
  title: "Submission Guidelines",
  pageTitle: "Submission Guidelines | BYTE QUEST",
  kicker: "SUBMISSION GUIDELINES",
  lede: "What to submit, when, and how it is judged.",
  sections: [
    {
      id: "what-to-submit",
      heading: "What to submit",
      body: (
        <>
          <p>
            Each team submits one project with a title, a description and an
            optional public repository link. The description should explain the
            problem, your approach and what you built - enough for a judge who
            has not seen your project.
          </p>
          <p>
            Teams that have entered a hackathon or reached the Grand Final may
            also be asked for a demonstration at the Innovation Expo.
          </p>
        </>
      ),
    },
    {
      id: "deadlines",
      heading: "Deadlines",
      body: (
        <p>
          Exact dates are published with the programme schedule. A submission is
          only reviewable after it has been forwarded to the school, so plan to
          finish before the hackathon weekend rather than the week of the Grand
          Final.
        </p>
      ),
    },
    {
      id: "review",
      heading: "How submissions are reviewed",
      body: (
        <>
          <p>
            The organising committee checks every forwarded submission for
            eligibility and completeness before judging. Only submissions that
            have been forwarded are reviewed.
          </p>
          <p>
            Judging weighs originality, technical execution, design quality,
            impact and the quality of the pitch. Criteria are published with
            each challenge brief.
          </p>
        </>
      ),
    },
    {
      id: "awards",
      heading: "Awards",
      body: (
        <p>
          Champion, first runner-up and second runner-up are awarded in each
          division, alongside special awards for creativity, coding, educational
          value, SDG impact, innovation, technical solution, sustainability and
          presentation.
        </p>
      ),
    },
    {
      id: "questions",
      heading: "Questions",
      body: (
        <p>
          Ask your teacher in charge first - they are your fastest route to the
          organising committee.
        </p>
      ),
    },
  ],
};
