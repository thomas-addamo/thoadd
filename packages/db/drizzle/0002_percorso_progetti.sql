ALTER TABLE "education" ADD COLUMN "status" text DEFAULT 'completato' NOT NULL;--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN "description" jsonb;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "kind" text DEFAULT 'esperienza' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "body" jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "gallery" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "links" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "attachments" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_slug_unique" UNIQUE("slug");