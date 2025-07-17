import {
  users,
  contractors,
  projects,
  bids,
  messages,
  deposits,
  type User,
  type UpsertUser,
  type InsertUser,
  type Contractor,
  type InsertContractor,
  type Project,
  type InsertProject,
  type Bid,
  type InsertBid,
  type Message,
  type InsertMessage,
  type Deposit,
  type InsertDeposit,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserSubscription(id: string, status: string, plan?: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: status,
        ...(plan && { subscriptionPlan: plan }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserType(id: string, userType: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        userType,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Contractors
  async getContractor(id: number): Promise<Contractor | undefined> {
    const [contractor] = await db.select().from(contractors).where(eq(contractors.id, id));
    return contractor;
  }

  async getContractorByUserId(userId: string): Promise<Contractor | undefined> {
    const [contractor] = await db.select().from(contractors).where(eq(contractors.userId, userId));
    return contractor;
  }

  async createContractor(contractorData: InsertContractor): Promise<Contractor> {
    const [contractor] = await db
      .insert(contractors)
      .values(contractorData)
      .returning();
    return contractor;
  }

  async getContractors(): Promise<Contractor[]> {
    return await db.select().from(contractors);
  }

  async updateContractor(id: number, updates: Partial<Contractor>): Promise<Contractor | undefined> {
    const [contractor] = await db
      .update(contractors)
      .set(updates)
      .where(eq(contractors.id, id))
      .returning();
    return contractor;
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProjectsByHomeowner(homeownerId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.homeownerId, homeownerId));
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  // Bids
  async getBid(id: number): Promise<Bid | undefined> {
    const [bid] = await db.select().from(bids).where(eq(bids.id, id));
    return bid;
  }

  async getBidsByProject(projectId: number): Promise<Bid[]> {
    return await db.select().from(bids).where(eq(bids.projectId, projectId));
  }

  async getBidsByContractor(contractorId: number): Promise<Bid[]> {
    return await db.select().from(bids).where(eq(bids.contractorId, contractorId));
  }

  async createBid(bidData: InsertBid): Promise<Bid> {
    const [bid] = await db
      .insert(bids)
      .values(bidData)
      .returning();
    return bid;
  }

  async updateBid(id: number, updates: Partial<Bid>): Promise<Bid | undefined> {
    const [bid] = await db
      .update(bids)
      .set(updates)
      .where(eq(bids.id, id))
      .returning();
    return bid;
  }

  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async getMessagesByProject(projectId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.projectId, projectId));
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
          and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
        )
      );
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [message] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }

  // Deposits
  async getDeposit(id: number): Promise<Deposit | undefined> {
    const [deposit] = await db.select().from(deposits).where(eq(deposits.id, id));
    return deposit;
  }

  async getDepositsByProject(projectId: number): Promise<Deposit[]> {
    return await db.select().from(deposits).where(eq(deposits.projectId, projectId));
  }

  async getDepositsByPayer(payerId: string): Promise<Deposit[]> {
    return await db.select().from(deposits).where(eq(deposits.payerId, payerId));
  }

  async getDepositsByContractor(contractorId: number): Promise<Deposit[]> {
    return await db.select().from(deposits).where(eq(deposits.contractorId, contractorId));
  }

  async createDeposit(depositData: InsertDeposit): Promise<Deposit> {
    const [deposit] = await db
      .insert(deposits)
      .values(depositData)
      .returning();
    return deposit;
  }

  async updateDeposit(id: number, updates: Partial<Deposit>): Promise<Deposit | undefined> {
    const [deposit] = await db
      .update(deposits)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(deposits.id, id))
      .returning();
    return deposit;
  }
}