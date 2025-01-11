CREATE TABLE "authLinks" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"userId" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "authLinks_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "authLinks" ADD CONSTRAINT "authLinks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;