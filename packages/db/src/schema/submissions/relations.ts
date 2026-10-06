import { relations } from "drizzle-orm";

import { userProfile } from "../access/user-profile";
import { school } from "../schools/school";
import { team } from "../teams/team";
import { submission } from "./submission";

export const submissionRelations = relations(submission, ({ one }) => ({
  team: one(team, {
    fields: [submission.teamId],
    references: [team.id],
  }),
  school: one(school, {
    fields: [submission.schoolId],
    references: [school.id],
  }),
  forwardedBy: one(userProfile, {
    fields: [submission.forwardedByUserId],
    references: [userProfile.userId],
  }),
  reviewedBy: one(userProfile, {
    fields: [submission.reviewedByUserId],
    references: [userProfile.userId],
  }),
}));
