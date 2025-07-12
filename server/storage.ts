import { 
  users, contractors, projects, bids, messages,
  type User, type InsertUser,
  type Contractor, type InsertContractor,
  type Project, type InsertProject,
  type Bid, type InsertBid,
  type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contractors
  getContractor(id: number): Promise<Contractor | undefined>;
  getContractorByUserId(userId: number): Promise<Contractor | undefined>;
  createContractor(contractor: InsertContractor): Promise<Contractor>;
  getContractors(): Promise<Contractor[]>;
  updateContractor(id: number, updates: Partial<Contractor>): Promise<Contractor | undefined>;
  
  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsByHomeowner(homeownerId: number): Promise<Project[]>;
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
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contractors: Map<number, Contractor>;
  private projects: Map<number, Project>;
  private bids: Map<number, Bid>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentContractorId: number;
  private currentProjectId: number;
  private currentBidId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.contractors = new Map();
    this.projects = new Map();
    this.bids = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentContractorId = 1;
    this.currentProjectId = 1;
    this.currentBidId = 1;
    this.currentMessageId = 1;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Contractors
  async getContractor(id: number): Promise<Contractor | undefined> {
    return this.contractors.get(id);
  }

  async getContractorByUserId(userId: number): Promise<Contractor | undefined> {
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

  async getProjectsByHomeowner(homeownerId: number): Promise<Project[]> {
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

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
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
}

export const storage = new MemStorage();
