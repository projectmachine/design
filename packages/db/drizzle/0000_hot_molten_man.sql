CREATE TABLE "global_config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "global_config" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "usage_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text,
	"model" text,
	"event_kind" text NOT NULL,
	"quantity" text,
	"metadata_json" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usage_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" text NOT NULL,
	"title" text,
	"applied_plugin_snapshot_id" text,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "deployments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" text NOT NULL,
	"file_name" text NOT NULL,
	"provider_id" text NOT NULL,
	"url" text NOT NULL,
	"deployment_id" text,
	"deployment_count" integer DEFAULT 1 NOT NULL,
	"target" text DEFAULT 'preview' NOT NULL,
	"status" text DEFAULT 'ready' NOT NULL,
	"status_message" text,
	"reachable_at" bigint,
	"provider_metadata_json" text,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deployments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"conversation_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"agent_id" text,
	"agent_name" text,
	"run_id" text,
	"run_status" text,
	"last_run_event_id" text,
	"events_json" text,
	"attachments_json" text,
	"comment_attachments_json" text,
	"produced_files_json" text,
	"feedback_json" text,
	"started_at" bigint,
	"ended_at" bigint,
	"position" integer NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "preview_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" text NOT NULL,
	"conversation_id" text NOT NULL,
	"file_path" text NOT NULL,
	"element_id" text NOT NULL,
	"selector" text NOT NULL,
	"label" text NOT NULL,
	"text" text NOT NULL,
	"position_json" text NOT NULL,
	"html_hint" text NOT NULL,
	"selection_kind" text,
	"member_count" integer,
	"pod_members_json" text,
	"note" text NOT NULL,
	"status" text NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "preview_comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"skill_id" text,
	"design_system_id" text,
	"pending_prompt" text,
	"metadata_json" text,
	"applied_plugin_snapshot_id" text,
	"custom_instructions" text,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "routine_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"routine_id" text NOT NULL,
	"trigger" text NOT NULL,
	"status" text NOT NULL,
	"project_id" text NOT NULL,
	"conversation_id" text NOT NULL,
	"agent_run_id" text NOT NULL,
	"started_at" bigint NOT NULL,
	"completed_at" bigint,
	"summary" text,
	"error" text,
	"error_code" text
);
--> statement-breakpoint
ALTER TABLE "routine_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "routines" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"prompt" text NOT NULL,
	"schedule_kind" text NOT NULL,
	"schedule_value" text NOT NULL,
	"schedule_json" text,
	"project_mode" text NOT NULL,
	"project_id" text,
	"skill_id" text,
	"agent_id" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "routines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tabs" (
	"user_id" uuid NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"position" integer NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	CONSTRAINT "tabs_project_id_name_pk" PRIMARY KEY("project_id","name")
);
--> statement-breakpoint
ALTER TABLE "tabs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"source_project_id" text,
	"files_json" text NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "templates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "critique_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" text NOT NULL,
	"conversation_id" text,
	"artifact_path" text,
	"status" text NOT NULL,
	"score" real,
	"rounds_json" text DEFAULT '[]' NOT NULL,
	"transcript_path" text,
	"protocol_version" integer NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "critique_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "media_tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" text NOT NULL,
	"status" text NOT NULL,
	"surface" text,
	"model" text,
	"progress_json" text DEFAULT '[]' NOT NULL,
	"file_json" text,
	"error_json" text,
	"started_at" bigint NOT NULL,
	"ended_at" bigint,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "registry_entries" (
	"backend_id" text NOT NULL,
	"name" text NOT NULL,
	"version" text NOT NULL,
	"entry_json" text NOT NULL,
	"updated_at" bigint NOT NULL,
	CONSTRAINT "registry_entries_backend_id_name_pk" PRIMARY KEY("backend_id","name")
);
--> statement-breakpoint
ALTER TABLE "registry_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "applied_plugin_snapshots" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" text NOT NULL,
	"conversation_id" text,
	"run_id" text,
	"plugin_id" text NOT NULL,
	"plugin_spec_version" text DEFAULT '1.0.0' NOT NULL,
	"plugin_version" text NOT NULL,
	"manifest_source_digest" text NOT NULL,
	"source_marketplace_id" text,
	"source_marketplace_entry_name" text,
	"source_marketplace_entry_version" text,
	"marketplace_trust" text,
	"resolved_source" text,
	"resolved_ref" text,
	"archive_integrity" text,
	"pinned_ref" text,
	"task_kind" text NOT NULL,
	"inputs_json" text NOT NULL,
	"resolved_context_json" text NOT NULL,
	"pipeline_json" text,
	"genui_surfaces_json" text DEFAULT '[]' NOT NULL,
	"capabilities_granted" text NOT NULL,
	"capabilities_required" text DEFAULT '[]' NOT NULL,
	"assets_staged_json" text NOT NULL,
	"connectors_required_json" text DEFAULT '[]' NOT NULL,
	"connectors_resolved_json" text DEFAULT '[]' NOT NULL,
	"mcp_servers_json" text DEFAULT '[]' NOT NULL,
	"plugin_title" text,
	"plugin_description" text,
	"query_text" text,
	"status" text DEFAULT 'fresh' NOT NULL,
	"applied_at" bigint NOT NULL,
	"expires_at" bigint
);
--> statement-breakpoint
ALTER TABLE "applied_plugin_snapshots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "genui_surfaces" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" text NOT NULL,
	"conversation_id" text,
	"run_id" text,
	"plugin_snapshot_id" text,
	"surface_id" text NOT NULL,
	"kind" text NOT NULL,
	"persist" text NOT NULL,
	"schema_digest" text,
	"value_json" text,
	"status" text NOT NULL,
	"responded_by" text,
	"requested_at" bigint NOT NULL,
	"responded_at" bigint,
	"expires_at" bigint
);
--> statement-breakpoint
ALTER TABLE "genui_surfaces" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "installed_plugins" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"version" text NOT NULL,
	"source_kind" text NOT NULL,
	"source" text NOT NULL,
	"pinned_ref" text,
	"source_digest" text,
	"source_marketplace_id" text,
	"source_marketplace_entry_name" text,
	"source_marketplace_entry_version" text,
	"marketplace_trust" text,
	"resolved_source" text,
	"resolved_ref" text,
	"archive_integrity" text,
	"trust" text NOT NULL,
	"capabilities_granted" text NOT NULL,
	"manifest_json" text NOT NULL,
	"fs_path" text NOT NULL,
	"installed_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "installed_plugins" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plugin_marketplaces" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"spec_version" text DEFAULT '1.0.0' NOT NULL,
	"version" text DEFAULT '0.0.0' NOT NULL,
	"trust" text NOT NULL,
	"manifest_json" text NOT NULL,
	"added_at" bigint NOT NULL,
	"refreshed_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plugin_marketplaces" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "run_devloop_iterations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"run_id" text NOT NULL,
	"stage_id" text NOT NULL,
	"iteration" integer NOT NULL,
	"artifact_diff_summary" text,
	"critique_summary" text,
	"tokens_used" integer,
	"ended_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "run_devloop_iterations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deployments" ADD CONSTRAINT "deployments_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deployments" ADD CONSTRAINT "deployments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preview_comments" ADD CONSTRAINT "preview_comments_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preview_comments" ADD CONSTRAINT "preview_comments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preview_comments" ADD CONSTRAINT "preview_comments_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_runs" ADD CONSTRAINT "routine_runs_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_runs" ADD CONSTRAINT "routine_runs_routine_id_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_runs" ADD CONSTRAINT "routine_runs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_runs" ADD CONSTRAINT "routine_runs_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routines" ADD CONSTRAINT "routines_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routines" ADD CONSTRAINT "routines_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tabs" ADD CONSTRAINT "tabs_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tabs" ADD CONSTRAINT "tabs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_source_project_id_projects_id_fk" FOREIGN KEY ("source_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "critique_runs" ADD CONSTRAINT "critique_runs_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "critique_runs" ADD CONSTRAINT "critique_runs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "critique_runs" ADD CONSTRAINT "critique_runs_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_tasks" ADD CONSTRAINT "media_tasks_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_tasks" ADD CONSTRAINT "media_tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applied_plugin_snapshots" ADD CONSTRAINT "applied_plugin_snapshots_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applied_plugin_snapshots" ADD CONSTRAINT "applied_plugin_snapshots_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applied_plugin_snapshots" ADD CONSTRAINT "applied_plugin_snapshots_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genui_surfaces" ADD CONSTRAINT "genui_surfaces_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genui_surfaces" ADD CONSTRAINT "genui_surfaces_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genui_surfaces" ADD CONSTRAINT "genui_surfaces_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genui_surfaces" ADD CONSTRAINT "genui_surfaces_plugin_snapshot_id_applied_plugin_snapshots_id_fk" FOREIGN KEY ("plugin_snapshot_id") REFERENCES "public"."applied_plugin_snapshots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "run_devloop_iterations" ADD CONSTRAINT "run_devloop_iterations_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_conv_project" ON "conversations" USING btree ("project_id","updated_at");--> statement-breakpoint
CREATE INDEX "idx_conv_user_updated" ON "conversations" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_deployments_unique_provider" ON "deployments" USING btree ("project_id","file_name","provider_id");--> statement-breakpoint
CREATE INDEX "idx_deployments_project" ON "deployments" USING btree ("project_id","updated_at");--> statement-breakpoint
CREATE INDEX "idx_messages_conv" ON "messages" USING btree ("conversation_id","position");--> statement-breakpoint
CREATE INDEX "idx_messages_user_created" ON "messages" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_preview_comments_unique_target" ON "preview_comments" USING btree ("project_id","conversation_id","file_path","element_id");--> statement-breakpoint
CREATE INDEX "idx_preview_comments_conversation" ON "preview_comments" USING btree ("project_id","conversation_id","updated_at");--> statement-breakpoint
CREATE INDEX "idx_projects_user_updated" ON "projects" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "idx_routine_runs_routine" ON "routine_runs" USING btree ("routine_id","started_at");--> statement-breakpoint
CREATE INDEX "idx_routine_runs_user_started" ON "routine_runs" USING btree ("user_id","started_at");--> statement-breakpoint
CREATE INDEX "idx_routines_user_created" ON "routines" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_tabs_project" ON "tabs" USING btree ("project_id","position");--> statement-breakpoint
CREATE INDEX "idx_templates_user_created" ON "templates" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_critique_runs_project" ON "critique_runs" USING btree ("project_id","updated_at");--> statement-breakpoint
CREATE INDEX "idx_critique_runs_status" ON "critique_runs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_media_tasks_project" ON "media_tasks" USING btree ("project_id","updated_at");--> statement-breakpoint
CREATE INDEX "idx_media_tasks_status" ON "media_tasks" USING btree ("status","updated_at");--> statement-breakpoint
CREATE INDEX "idx_snapshots_project" ON "applied_plugin_snapshots" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_snapshots_run" ON "applied_plugin_snapshots" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "idx_snapshots_plugin" ON "applied_plugin_snapshots" USING btree ("plugin_id","plugin_version");--> statement-breakpoint
CREATE INDEX "idx_genui_proj_surface" ON "genui_surfaces" USING btree ("project_id","surface_id");--> statement-breakpoint
CREATE INDEX "idx_genui_conv_surface" ON "genui_surfaces" USING btree ("conversation_id","surface_id");--> statement-breakpoint
CREATE INDEX "idx_genui_run" ON "genui_surfaces" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "idx_installed_plugins_source_kind" ON "installed_plugins" USING btree ("source_kind");--> statement-breakpoint
CREATE INDEX "idx_devloop_run" ON "run_devloop_iterations" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "idx_devloop_run_stage" ON "run_devloop_iterations" USING btree ("run_id","stage_id");--> statement-breakpoint
CREATE POLICY "global_config_admin_all" ON "global_config" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (select auth.uid())
    AND profiles.role = 'admin'
)) WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (select auth.uid())
    AND profiles.role = 'admin'
));--> statement-breakpoint
CREATE POLICY "usage_events_admin_all" ON "usage_events" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (select auth.uid())
    AND profiles.role = 'admin'
)) WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (select auth.uid())
    AND profiles.role = 'admin'
));--> statement-breakpoint
CREATE POLICY "user_id_authenticated_own_rows" ON "conversations" AS PERMISSIVE FOR ALL TO "authenticated" USING ("conversations"."user_id" = (select auth.uid())) WITH CHECK ("conversations"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_id_authenticated_own_rows" ON "deployments" AS PERMISSIVE FOR ALL TO "authenticated" USING ("deployments"."user_id" = (select auth.uid())) WITH CHECK ("deployments"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_id_authenticated_own_rows" ON "messages" AS PERMISSIVE FOR ALL TO "authenticated" USING ("messages"."user_id" = (select auth.uid())) WITH CHECK ("messages"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_id_authenticated_own_rows" ON "preview_comments" AS PERMISSIVE FOR ALL TO "authenticated" USING ("preview_comments"."user_id" = (select auth.uid())) WITH CHECK ("preview_comments"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_id_authenticated_own_rows" ON "projects" AS PERMISSIVE FOR ALL TO "authenticated" USING ("projects"."user_id" = (select auth.uid())) WITH CHECK ("projects"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_id_authenticated_own_rows" ON "routine_runs" AS PERMISSIVE FOR ALL TO "authenticated" USING ("routine_runs"."user_id" = (select auth.uid())) WITH CHECK ("routine_runs"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_id_authenticated_own_rows" ON "routines" AS PERMISSIVE FOR ALL TO "authenticated" USING ("routines"."user_id" = (select auth.uid())) WITH CHECK ("routines"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_id_authenticated_own_rows" ON "tabs" AS PERMISSIVE FOR ALL TO "authenticated" USING ("tabs"."user_id" = (select auth.uid())) WITH CHECK ("tabs"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_id_authenticated_own_rows" ON "templates" AS PERMISSIVE FOR ALL TO "authenticated" USING ("templates"."user_id" = (select auth.uid())) WITH CHECK ("templates"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "critique_runs_own_rows" ON "critique_runs" AS PERMISSIVE FOR ALL TO "authenticated" USING ("critique_runs"."user_id" = (select auth.uid())) WITH CHECK ("critique_runs"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "media_tasks_own_rows" ON "media_tasks" AS PERMISSIVE FOR ALL TO "authenticated" USING ("media_tasks"."user_id" = (select auth.uid())) WITH CHECK ("media_tasks"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "registry_entries_authenticated_read" ON "registry_entries" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "applied_plugin_snapshots_own_rows" ON "applied_plugin_snapshots" AS PERMISSIVE FOR ALL TO "authenticated" USING ("applied_plugin_snapshots"."user_id" = (select auth.uid())) WITH CHECK ("applied_plugin_snapshots"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "genui_surfaces_own_rows" ON "genui_surfaces" AS PERMISSIVE FOR ALL TO "authenticated" USING ("genui_surfaces"."user_id" = (select auth.uid())) WITH CHECK ("genui_surfaces"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "installed_plugins_admin_all" ON "installed_plugins" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (select auth.uid())
    AND profiles.role = 'admin'
)) WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (select auth.uid())
    AND profiles.role = 'admin'
));--> statement-breakpoint
CREATE POLICY "plugin_marketplaces_admin_all" ON "plugin_marketplaces" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (select auth.uid())
    AND profiles.role = 'admin'
)) WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (select auth.uid())
    AND profiles.role = 'admin'
));--> statement-breakpoint
CREATE POLICY "run_devloop_iterations_own_rows" ON "run_devloop_iterations" AS PERMISSIVE FOR ALL TO "authenticated" USING ("run_devloop_iterations"."user_id" = (select auth.uid())) WITH CHECK ("run_devloop_iterations"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "profiles_select_own" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("profiles"."id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "profiles_update_own" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("profiles"."id" = (select auth.uid())) WITH CHECK ("profiles"."id" = (select auth.uid()));