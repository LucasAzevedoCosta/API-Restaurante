CREATE TABLE "evaluations" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text,
	"restaurant_id" text,
	"rate" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_restaurant_id_users_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;