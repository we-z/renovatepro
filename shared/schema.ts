import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  userType: text("user_type").notNull(), // 'homeowner' or 'contractor'
  phone: text("phone"),
  location: text("location"),
  profileImage: text("profile_image"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"), // 'active', 'canceled', 'past_due', 'inactive'
  subscriptionPlan: text("subscription_plan"), // 'basic', 'pro', 'enterprise'
  createdAt: timestamp("created_at").defaultNow(),
});

export const contractors = pgTable("contractors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyName: text("company_name").notNull(),
  description: text("description"),
  specialties: text("specialties").array(),
  experience: integer("experience"), // years of experience
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  portfolio: text("portfolio").array(), // array of image URLs
  licenses: text("licenses").array(),
  insurance: boolean("insurance").default(false),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  homeownerId: integer("homeowner_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  timeline: text("timeline"),
  location: text("location").notNull(),
  status: text("status").notNull().default("posted"), // 'posted', 'bidding', 'awarded', 'in_progress', 'completed'
  images: text("images").array(),
  depositRequired: boolean("deposit_required").default(false),
  depositPercentage: integer("deposit_percentage").default(25), // percentage of bid amount
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  contractorId: integer("contractor_id").references(() => contractors.id).notNull(),
  amount: integer("amount").notNull(),
  timeline: text("timeline").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  payerId: integer("payer_id").references(() => users.id).notNull(), // homeowner paying the deposit
  contractorId: integer("contractor_id").references(() => contractors.id).notNull(),
  bidId: integer("bid_id").references(() => bids.id).notNull(),
  amount: integer("amount").notNull(), // amount in cents
  status: text("status").notNull().default("pending"), // 'pending', 'processing', 'completed', 'failed', 'refunded'
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeChargeId: text("stripe_charge_id"),
  description: text("description"),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  refundedAt: timestamp("refunded_at"),
  refundAmount: integer("refund_amount"), // amount refunded in cents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContractorSchema = createInsertSchema(contractors).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Contractor = typeof contractors.$inferSelect;
export type InsertContractor = z.infer<typeof insertContractorSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;
