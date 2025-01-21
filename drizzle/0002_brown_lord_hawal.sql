ALTER TABLE "authLinks" DROP CONSTRAINT "authLinks_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "authLinks" ADD CONSTRAINT "authLinks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;