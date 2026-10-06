import { relations } from "drizzle-orm";

import { user } from "../auth";
import { adminApplication } from "./admin-application";
import { userProfile } from "./user-profile";

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}));

export const adminApplicationRelations = relations(
  adminApplication,
  ({ one }) => ({
    reviewedBy: one(userProfile, {
      fields: [adminApplication.reviewedByUserId],
      references: [userProfile.userId],
    }),
  })
);
