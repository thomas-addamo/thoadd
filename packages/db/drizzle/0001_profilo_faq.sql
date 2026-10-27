CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"question" jsonb NOT NULL,
	"answer" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "level" SET DEFAULT 2;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "employment_type" jsonb;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "looking_for" jsonb;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "headline" jsonb;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "bio_personal" jsonb;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "current_role" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "focus" jsonb;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "seeking" jsonb;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "work_mode" jsonb;--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN "size" integer DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN "accent" boolean DEFAULT false NOT NULL;