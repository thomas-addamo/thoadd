CREATE TYPE "public"."cefr_level" AS ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native');--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"issuer" text,
	"issued_on" date,
	"url" text
);
--> statement-breakpoint
CREATE TABLE "cv_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"lang" text NOT NULL,
	"version_id" integer,
	"country" text
);
--> statement-breakpoint
CREATE TABLE "cv_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"snapshot" jsonb NOT NULL,
	"pdf_it_url" text,
	"pdf_en_url" text
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"school" text NOT NULL,
	"title" jsonb NOT NULL,
	"city" text,
	"start_year" integer,
	"end_year" integer,
	"grade" text
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"company" text NOT NULL,
	"role" jsonb NOT NULL,
	"city" text,
	"start_date" date NOT NULL,
	"end_date" date,
	"description" jsonb,
	"technologies" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" jsonb NOT NULL,
	"level" "cefr_level" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"kind" text NOT NULL,
	"label" text,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"full_name" text DEFAULT 'Thomas Addamo' NOT NULL,
	"role" jsonb NOT NULL,
	"tagline" jsonb NOT NULL,
	"bio" jsonb NOT NULL,
	"city" text,
	"photo_url" text,
	"status" jsonb,
	"available" boolean DEFAULT true NOT NULL,
	"email" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"kind" jsonb,
	"year" integer,
	"summary" jsonb NOT NULL,
	"image_url" text,
	"url" text,
	"repo_url" text,
	"featured" boolean DEFAULT false NOT NULL,
	"technologies" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"level" integer DEFAULT 3 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cv_downloads" ADD CONSTRAINT "cv_downloads_version_id_cv_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."cv_versions"("id") ON DELETE no action ON UPDATE no action;