import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from ".";

export const authLinks = pgTable('authLinks', {
    id: text('id')
     .$defaultFn(() => createId())
     .primaryKey(),
    code: text('code').notNull().unique(),
    userId: text('userId').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    creatdAt: timestamp('created_at').defaultNow(),
})