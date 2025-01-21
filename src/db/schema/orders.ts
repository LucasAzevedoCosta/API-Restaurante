import { createId } from "@paralleldrive/cuid2"
import { pgEnum, pgTable, text, integer, timestamp } from "drizzle-orm/pg-core"
import { restaurants, users } from "."

export const orderStatusEnum = pgEnum('order_status', [
    'pending',
    'processing',
    'delivering',
    'delivered',
    'canceled',
  ])

  export const orders = pgTable('orders', {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    customerId: text('customer_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    restaurantId: text('restaurant_id')
      .notNull()
      .references(() => restaurants.id, {
        onDelete: 'cascade',
      }),
    status: orderStatusEnum('status').default('pending').notNull(),
    totalInCents: integer('total_in_cents').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  })