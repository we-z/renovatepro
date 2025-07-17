import { 
  users, contractors, projects, bids, messages, deposits,
  type User, type InsertUser, type UpsertUser,
  type Contractor, type InsertContractor,
  type Project, type InsertProject,
  type Bid, type InsertBid,
  type Message, type InsertMessage,
  type Deposit, type InsertDeposit
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User | undefined>;
  updateUserSubscription(id: string, status: string, plan?: string): Promise<User | undefined>;
  updateUserType(id: string, userType: string): Promise<User | undefined>;
  
  // Contractors
  getContractor(id: number): Promise<Contractor | undefined>;
  getContractorByUserId(userId: string): Promise<Contractor | undefined>;
  createContractor(contractor: InsertContractor): Promise<Contractor>;
  getContractors(): Promise<Contractor[]>;
  updateContractor(id: number, updates: Partial<Contractor>): Promise<Contractor | undefined>;
  
  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsByHomeowner(homeownerId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  
  // Bids
  getBid(id: number): Promise<Bid | undefined>;
  getBidsByProject(projectId: number): Promise<Bid[]>;
  getBidsByContractor(contractorId: number): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBid(id: number, updates: Partial<Bid>): Promise<Bid | undefined>;
  
  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByProject(projectId: number): Promise<Message[]>;
  getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Deposits
  getDeposit(id: number): Promise<Deposit | undefined>;
  getDepositsByProject(projectId: number): Promise<Deposit[]>;
  getDepositsByPayer(payerId: string): Promise<Deposit[]>;
  getDepositsByContractor(contractorId: number): Promise<Deposit[]>;
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  updateDeposit(id: number, updates: Partial<Deposit>): Promise<Deposit | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contractors: Map<number, Contractor>;
  private projects: Map<number, Project>;
  private bids: Map<number, Bid>;
  private messages: Map<number, Message>;
  private deposits: Map<number, Deposit>;
  private currentContractorId: number;
  private currentProjectId: number;
  private currentBidId: number;
  private currentMessageId: number;
  private currentDepositId: number;

  constructor() {
    this.users = new Map();
    this.contractors = new Map();
    this.projects = new Map();
    this.bids = new Map();
    this.messages = new Map();
    this.deposits = new Map();
    this.currentContractorId = 1;
    this.currentProjectId = 1;
    this.currentBidId = 1;
    this.currentMessageId = 1;
    this.currentDepositId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample homeowners with Google-style IDs
    const homeowner1 = await this.upsertUser({
      id: "google_12345",
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      userType: "homeowner",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      subscriptionStatus: "active",
      subscriptionPlan: "pro"
    });

    const homeowner2 = await this.upsertUser({
      id: "google_67890",
      email: "mike@example.com",
      firstName: "Mike",
      lastName: "Chen",
      userType: "homeowner",
      phone: "(555) 234-5678",
      location: "Los Angeles, CA",
      subscriptionStatus: "active",
      subscriptionPlan: "basic"
    });

    // Create sample contractors
    const contractorUser1 = await this.upsertUser({
      id: "google_11111",
      email: "contact@eliteconstruction.com",
      firstName: "David",
      lastName: "Smith",
      userType: "contractor",
      phone: "(555) 345-6789",
      location: "San Francisco, CA"
    });

    const contractor1 = await this.createContractor({
      userId: contractorUser1.id,
      companyName: "Elite Construction Co.",
      description: "Premier construction company specializing in high-end residential renovations. We pride ourselves on exceptional craftsmanship and attention to detail.",
      specialties: ["Kitchen Renovation", "Bathroom Remodel", "General Construction"],
      experience: 15,
      rating: "4.8",
      reviewCount: 127,
      portfolio: ["kitchen1.jpg", "bathroom1.jpg", "living1.jpg"],
      licenses: ["CA-1234567", "B-General Building"],
      insurance: true
    });

    const contractorUser2 = await this.upsertUser({
      id: "google_22222",
      email: "info@modernkitchens.com",
      firstName: "Lisa",
      lastName: "Rodriguez",
      userType: "contractor",
      phone: "(555) 456-7890",
      location: "San Francisco, CA"
    });

    const contractor2 = await this.createContractor({
      userId: contractorUser2.id,
      companyName: "Modern Kitchen Designs",
      description: "Specialized kitchen renovation experts with over a decade of experience transforming outdated kitchens into modern masterpieces.",
      specialties: ["Kitchen Renovation", "Custom Cabinetry"],
      experience: 12,
      rating: "4.9",
      reviewCount: 89,
      portfolio: ["kitchen2.jpg", "kitchen3.jpg"],
      licenses: ["CA-2345678", "C-Kitchen Specialist"],
      insurance: true
    });

    const contractorUser3 = await this.upsertUser({
      id: "google_33333",
      email: "service@bayroofing.com",
      firstName: "James",
      lastName: "Wilson",
      userType: "contractor",
      phone: "(555) 567-8901",
      location: "Oakland, CA"
    });

    const contractor3 = await this.createContractor({
      userId: contractorUser3.id,
      companyName: "Bay Area Roofing Solutions",
      description: "Trusted roofing contractor serving the Bay Area for over 20 years. We handle everything from repairs to complete roof replacements.",
      specialties: ["Roofing", "Gutters", "Siding"],
      experience: 20,
      rating: "4.7",
      reviewCount: 156,
      portfolio: ["roof1.jpg", "roof2.jpg", "siding1.jpg"],
      licenses: ["CA-3456789", "C-Roofing Contractor"],
      insurance: true
    });

    // Create sample projects
    const project1 = await this.createProject({
      homeownerId: homeowner1.id,
      title: "Kitchen Renovation",
      description: "Complete kitchen remodel including new cabinets, countertops, appliances, and flooring. Looking for modern design with quality finishes.",
      category: "Kitchen Renovation",
      budgetMin: 25000,
      budgetMax: 40000,
      timeline: "2-3 months",
      location: "San Francisco, CA",
      status: "posted",
      images: ["kitchen_before.jpg"]
    });

    const project2 = await this.createProject({
      homeownerId: homeowner2.id,
      title: "Bathroom Remodel",
      description: "Master bathroom renovation with walk-in shower, double vanity, and modern fixtures. Need waterproofing expertise.",
      category: "Bathroom Remodel",
      budgetMin: 15000,
      budgetMax: 25000,
      timeline: "1-2 months",
      location: "Los Angeles, CA",
      status: "bidding",
      images: ["bathroom_before.jpg"]
    });

    // Create sample bids
    await this.createBid({
      projectId: project1.id,
      contractorId: contractor1.id,
      amount: 32000,
      timeline: "10 weeks",
      description: "Complete kitchen renovation with premium materials and finishes. Includes demolition, plumbing, electrical, and installation.",
      status: "pending"
    });

    await this.createBid({
      projectId: project1.id,
      contractorId: contractor2.id,
      amount: 28500,
      timeline: "8 weeks",
      description: "Modern kitchen design with custom cabinetry and high-end appliances. Specialized in kitchen transformations.",
      status: "pending"
    });

    await this.createBid({
      projectId: project2.id,
      contractorId: contractor1.id,
      amount: 18000,
      timeline: "6 weeks",
      description: "Luxury bathroom remodel with premium tiles and fixtures. Full waterproofing included.",
      status: "accepted"
    });

    // Create sample messages
    await this.createMessage({
      projectId: project1.id,
      senderId: homeowner1.id,
      receiverId: contractorUser1.id,
      content: "Hi David, I'm interested in your bid for my kitchen renovation. Can we schedule a time to discuss the project details?",
      isRead: false
    });

    await this.createMessage({
      projectId: project1.id,
      senderId: contractorUser1.id,
      receiverId: homeowner1.id,
      content: "Hello Sarah! I'd be happy to discuss your kitchen project. I'm available this week for a consultation. What time works best for you?",
      isRead: true
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      ...insertUser, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(insertUser.id!, user);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      ...existingUser,
      ...userData,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date()
    };
    this.users.set(userData.id!, user);
    return user;
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated = { 
      ...user, 
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date()
    };
    this.users.set(id, updated);
    return updated;
  }

  async updateUserSubscription(id: string, status: string, plan?: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated = { 
      ...user, 
      subscriptionStatus: status,
      ...(plan && { subscriptionPlan: plan }),
      updatedAt: new Date()
    };
    this.users.set(id, updated);
    return updated;
  }

  async updateUserType(id: string, userType: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated = { 
      ...user, 
      userType,
      updatedAt: new Date()
    };
    this.users.set(id, updated);
    return updated;
  }

  // Contractors
  async getContractor(id: number): Promise<Contractor | undefined> {
    return this.contractors.get(id);
  }

  async getContractorByUserId(userId: string): Promise<Contractor | undefined> {
    return Array.from(this.contractors.values()).find(contractor => contractor.userId === userId);
  }

  async createContractor(insertContractor: InsertContractor): Promise<Contractor> {
    const id = this.currentContractorId++;
    const contractor: Contractor = { ...insertContractor, id };
    this.contractors.set(id, contractor);
    return contractor;
  }

  async getContractors(): Promise<Contractor[]> {
    return Array.from(this.contractors.values());
  }

  async updateContractor(id: number, updates: Partial<Contractor>): Promise<Contractor | undefined> {
    const contractor = this.contractors.get(id);
    if (!contractor) return undefined;
    
    const updated = { ...contractor, ...updates };
    this.contractors.set(id, updated);
    return updated;
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByHomeowner(homeownerId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.homeownerId === homeownerId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updated = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  // Bids
  async getBid(id: number): Promise<Bid | undefined> {
    return this.bids.get(id);
  }

  async getBidsByProject(projectId: number): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(bid => bid.projectId === projectId);
  }

  async getBidsByContractor(contractorId: number): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter(bid => bid.contractorId === contractorId);
  }

  async createBid(insertBid: InsertBid): Promise<Bid> {
    const id = this.currentBidId++;
    const bid: Bid = { 
      ...insertBid, 
      id,
      createdAt: new Date()
    };
    this.bids.set(id, bid);
    return bid;
  }

  async updateBid(id: number, updates: Partial<Bid>): Promise<Bid | undefined> {
    const bid = this.bids.get(id);
    if (!bid) return undefined;
    
    const updated = { ...bid, ...updates };
    this.bids.set(id, updated);
    return updated;
  }

  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByProject(projectId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(message => message.projectId === projectId);
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(message => 
      (message.senderId === user1Id && message.receiverId === user2Id) ||
      (message.senderId === user2Id && message.receiverId === user1Id)
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { 
      ...insertMessage, 
      id,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updated = { ...message, isRead: true };
    this.messages.set(id, updated);
    return updated;
  }

  // Deposit methods
  async getDeposit(id: number): Promise<Deposit | undefined> {
    return this.deposits.get(id);
  }

  async getDepositsByProject(projectId: number): Promise<Deposit[]> {
    return Array.from(this.deposits.values()).filter(deposit => deposit.projectId === projectId);
  }

  async getDepositsByPayer(payerId: string): Promise<Deposit[]> {
    return Array.from(this.deposits.values()).filter(deposit => deposit.payerId === payerId);
  }

  async getDepositsByContractor(contractorId: number): Promise<Deposit[]> {
    return Array.from(this.deposits.values()).filter(deposit => deposit.contractorId === contractorId);
  }

  async createDeposit(insertDeposit: InsertDeposit): Promise<Deposit> {
    const id = this.currentDepositId++;
    const deposit: Deposit = { 
      ...insertDeposit, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.deposits.set(id, deposit);
    return deposit;
  }

  async updateDeposit(id: number, updates: Partial<Deposit>): Promise<Deposit | undefined> {
    const deposit = this.deposits.get(id);
    if (deposit) {
      const updatedDeposit = { 
        ...deposit, 
        ...updates, 
        updatedAt: new Date() 
      };
      this.deposits.set(id, updatedDeposit);
      return updatedDeposit;
    }
    return undefined;
  }
}

// Use database storage for production, memory storage for development
import { DatabaseStorage } from "./databaseStorage";

export const storage = process.env.NODE_ENV === "production" 
  ? new DatabaseStorage() 
  : new MemStorage();
