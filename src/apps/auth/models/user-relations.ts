import { relations } from "drizzle-orm";
import { user } from "./user";
import { session } from "./session";
import { account } from "./account";
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));
