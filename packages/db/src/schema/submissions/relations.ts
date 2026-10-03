import { defineRelationsPart } from "drizzle-orm";

import { userProfile } from "../access/user-profile";
import { school } from "../schools/school";
import { team } from "../teams/team";
import { submission } from "./submission";

export const submissionRelations = defineRelationsPart(
  { submission, team, school, userProfile },
  (r) => ({
    submission: {
      team: r.one.team({
        from: r.submission.teamId,
        to: r.team.id,
      }),
      school: r.one.school({
        from: r.submission.schoolId,
        to: r.school.id,
      }),
      forwardedBy: r.one.userProfile({
        from: r.submission.forwardedByUserId,
        to: r.userProfile.userId,
      }),
      reviewedBy: r.one.userProfile({
        from: r.submission.reviewedByUserId,
        to: r.userProfile.userId,
      }),
    },
    team: {
      submission: r.one.submission({
        from: r.team.id,
        to: r.submission.teamId,
      }),
    },
  })
);
