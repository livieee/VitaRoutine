import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Health profile model
export const healthProfiles = pgTable("health_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  healthGoals: jsonb("health_goals").notNull(),
  lifestyle: jsonb("lifestyle").notNull(),
});

export const insertHealthProfileSchema = createInsertSchema(healthProfiles).pick({
  userId: true,
  healthGoals: true,
  lifestyle: true,
});

export type InsertHealthProfile = z.infer<typeof insertHealthProfileSchema>;
export type HealthProfile = typeof healthProfiles.$inferSelect;

// Recommendation model
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => healthProfiles.id),
  supplementRoutine: jsonb("supplement_routine").notNull(),
  foodSuggestions: jsonb("food_suggestions").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).pick({
  profileId: true,
  supplementRoutine: true,
  foodSuggestions: true,
  createdAt: true,
});

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
