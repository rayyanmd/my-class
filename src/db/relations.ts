import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  // Auth
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },

  course: {
    assignemnt: r.many.assignment(),
    link: r.many.link(),
    schedule: r.many.schedule(),
  },

  // Assignment
  assignment: {
    course: r.one.course({
      from: r.assignment.courseId,
      to: r.course.id,
    }),
  },

  // Link
  link: {
    course: r.one.course({
      from: r.link.courseId,
      to: r.course.id,
    }),
  },

  schedule: {
    course: r.one.course({
      from: r.schedule.courseId,
      to: r.course.id,
    }),
  },
}));
