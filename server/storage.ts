import { 
  users, properties, tenants, maintenanceRequests, messages, aiInsights,
  type User, type InsertUser,
  type Property, type InsertProperty,
  type Tenant, type InsertTenant,
  type MaintenanceRequest, type InsertMaintenanceRequest,
  type Message, type InsertMessage,
  type AiInsight, type InsertAiInsight
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(id: number, customerId: string, subscriptionId: string): Promise<User | undefined>;
  updateUserSubscription(id: number, status: string, plan?: string): Promise<User | undefined>;
  
  // Properties
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(): Promise<Property[]>;
  getPropertiesByManager(managerId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined>;
  
  // Tenants
  getTenant(id: number): Promise<Tenant | undefined>;
  getTenants(): Promise<Tenant[]>;
  getTenantsByProperty(propertyId: number): Promise<Tenant[]>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, updates: Partial<Tenant>): Promise<Tenant | undefined>;
  
  // Maintenance Requests
  getMaintenanceRequest(id: number): Promise<MaintenanceRequest | undefined>;
  getMaintenanceRequests(): Promise<MaintenanceRequest[]>;
  getMaintenanceRequestsByProperty(propertyId: number): Promise<MaintenanceRequest[]>;
  createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
  updateMaintenanceRequest(id: number, updates: Partial<MaintenanceRequest>): Promise<MaintenanceRequest | undefined>;
  
  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByProperty(propertyId: number): Promise<Message[]>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // AI Insights
  getAiInsight(id: number): Promise<AiInsight | undefined>;
  getAiInsights(): Promise<AiInsight[]>;
  getAiInsightsByUser(userId: number): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  updateAiInsight(id: number, updates: Partial<AiInsight>): Promise<AiInsight | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private tenants: Map<number, Tenant>;
  private maintenanceRequests: Map<number, MaintenanceRequest>;
  private messages: Map<number, Message>;
  private aiInsights: Map<number, AiInsight>;
  private currentUserId: number;
  private currentPropertyId: number;
  private currentTenantId: number;
  private currentMaintenanceRequestId: number;
  private currentMessageId: number;
  private currentAiInsightId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.tenants = new Map();
    this.maintenanceRequests = new Map();
    this.messages = new Map();
    this.aiInsights = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentTenantId = 1;
    this.currentMaintenanceRequestId = 1;
    this.currentMessageId = 1;
    this.currentAiInsightId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample property managers
    const manager1 = await this.createUser({
      username: "sarah_chen",
      password: "password123",
      email: "sarah@cityproperties.com",
      firstName: "Sarah",
      lastName: "Chen",
      userType: "property_manager",
      companyName: "City Properties LLC",
      role: "admin",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      subscriptionStatus: "active",
      subscriptionPlan: "enterprise",
      aiCredits: 5000
    });

    const manager2 = await this.createUser({
      username: "david_park",
      password: "password123",
      email: "david@urbanmanagement.com",
      firstName: "David",
      lastName: "Park",
      userType: "property_manager",
      companyName: "Urban Management Co",
      role: "manager",
      phone: "(555) 234-5678",
      location: "Los Angeles, CA",
      subscriptionStatus: "active",
      subscriptionPlan: "professional",
      aiCredits: 2000
    });

    // Create sample properties
    const property1 = await this.createProperty({
      managerId: manager1.id,
      name: "Sunset Apartments",
      address: "123 Sunset Boulevard",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      propertyType: "apartment",
      units: 24,
      squareFootage: 18000,
      yearBuilt: 2015,
      amenities: ["Pool", "Gym", "Parking", "Laundry"],
      images: ["sunset1.jpg", "sunset2.jpg"],
      status: "active",
      aiInsights: JSON.stringify({
        occupancyRate: 0.92,
        avgRent: 3200,
        maintenanceScore: 85,
        tenantSatisfaction: 4.2
      })
    });

    const property2 = await this.createProperty({
      managerId: manager1.id,
      name: "Marina View Condos",
      address: "456 Marina Drive",
      city: "San Francisco",
      state: "CA",
      zipCode: "94123",
      propertyType: "apartment",
      units: 12,
      squareFootage: 15000,
      yearBuilt: 2018,
      amenities: ["Balcony", "Parking", "Storage"],
      images: ["marina1.jpg"],
      status: "active"
    });

    // Create sample tenants
    const tenant1 = await this.createTenant({
      propertyId: property1.id,
      firstName: "Jessica",
      lastName: "Wong",
      email: "jessica.wong@email.com",
      phone: "(555) 345-6789",
      unitNumber: "2A",
      leaseStart: new Date("2024-01-01"),
      leaseEnd: new Date("2024-12-31"),
      rentAmount: 320000, // $3200 in cents
      securityDeposit: 320000,
      status: "active",
      emergencyContact: "Michael Wong - (555) 987-6543",
      petPolicy: "1 cat allowed",
      aiRiskScore: "0.15"
    });

    const tenant2 = await this.createTenant({
      propertyId: property1.id,
      firstName: "Alex",
      lastName: "Kumar",
      email: "alex.kumar@email.com",
      phone: "(555) 456-7890",
      unitNumber: "4B",
      leaseStart: new Date("2023-06-01"),
      leaseEnd: new Date("2024-05-31"),
      rentAmount: 340000, // $3400 in cents
      securityDeposit: 340000,
      status: "active",
      emergencyContact: "Priya Kumar - (555) 876-5432",
      aiRiskScore: "0.08"
    });

    // Create sample maintenance requests
    const maintenance1 = await this.createMaintenanceRequest({
      propertyId: property1.id,
      tenantId: tenant1.id,
      title: "Kitchen Sink Leak",
      description: "Water is leaking from under the kitchen sink. It started yesterday evening.",
      category: "plumbing",
      priority: "high",
      status: "pending",
      estimatedCost: 15000, // $150 in cents
      images: ["sink_leak.jpg"],
      aiDiagnosis: "Likely worn gasket or loose connection. Recommend immediate inspection to prevent water damage.",
      aiRecommendations: ["Schedule plumber within 24 hours", "Check for water damage", "Provide temporary bucket to tenant"]
    });

    const maintenance2 = await this.createMaintenanceRequest({
      propertyId: property1.id,
      tenantId: tenant2.id,
      title: "HVAC Not Heating",
      description: "The heating system is not working properly. Unit is cold.",
      category: "hvac",
      priority: "urgent",
      status: "in_progress",
      estimatedCost: 25000, // $250 in cents
      aiDiagnosis: "Possible thermostat malfunction or filter blockage. Priority repair needed for tenant comfort.",
      aiRecommendations: ["Check thermostat settings", "Replace air filter", "Schedule HVAC technician"]
    });

    // Create sample AI insights
    await this.createAiInsight({
      userId: manager1.id,
      propertyId: property1.id,
      insightType: "maintenance_prediction",
      title: "Upcoming HVAC Maintenance Due",
      description: "Based on historical data, HVAC system servicing is recommended within the next 30 days to prevent breakdowns during peak season.",
      confidence: "0.87",
      actionable: true,
      status: "active",
      metadata: JSON.stringify({
        lastService: "2023-10-15",
        predictedFailureRisk: 0.23,
        recommendedAction: "Schedule preventive maintenance"
      })
    });

    await this.createAiInsight({
      userId: manager1.id,
      insightType: "cost_optimization",
      title: "Energy Efficiency Opportunity",
      description: "Installing smart thermostats could reduce energy costs by an estimated 12-15% annually across your portfolio.",
      confidence: "0.91",
      actionable: true,
      status: "active",
      metadata: JSON.stringify({
        estimatedSavings: 1200,
        paybackPeriod: "18 months",
        properties: [property1.id, property2.id]
      })
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      lastLogin: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(id: number, customerId: string, subscriptionId: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      user.stripeCustomerId = customerId;
      user.stripeSubscriptionId = subscriptionId;
      this.users.set(id, user);
    }
    return user;
  }

  async updateUserSubscription(id: number, status: string, plan?: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      user.subscriptionStatus = status;
      if (plan) {
        user.subscriptionPlan = plan;
      }
      this.users.set(id, user);
    }
    return user;
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertiesByManager(managerId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.managerId === managerId);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const property: Property = { 
      ...insertProperty, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (property) {
      const updated = { ...property, ...updates, updatedAt: new Date() };
      this.properties.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Tenant methods
  async getTenant(id: number): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }

  async getTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  async getTenantsByProperty(propertyId: number): Promise<Tenant[]> {
    return Array.from(this.tenants.values()).filter(t => t.propertyId === propertyId);
  }

  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const id = this.currentTenantId++;
    const tenant: Tenant = { 
      ...insertTenant, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  async updateTenant(id: number, updates: Partial<Tenant>): Promise<Tenant | undefined> {
    const tenant = this.tenants.get(id);
    if (tenant) {
      const updated = { ...tenant, ...updates, updatedAt: new Date() };
      this.tenants.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Maintenance Request methods
  async getMaintenanceRequest(id: number): Promise<MaintenanceRequest | undefined> {
    return this.maintenanceRequests.get(id);
  }

  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    return Array.from(this.maintenanceRequests.values());
  }

  async getMaintenanceRequestsByProperty(propertyId: number): Promise<MaintenanceRequest[]> {
    return Array.from(this.maintenanceRequests.values()).filter(r => r.propertyId === propertyId);
  }

  async createMaintenanceRequest(insertRequest: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const id = this.currentMaintenanceRequestId++;
    const request: MaintenanceRequest = { 
      ...insertRequest, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.maintenanceRequests.set(id, request);
    return request;
  }

  async updateMaintenanceRequest(id: number, updates: Partial<MaintenanceRequest>): Promise<MaintenanceRequest | undefined> {
    const request = this.maintenanceRequests.get(id);
    if (request) {
      const updated = { ...request, ...updates, updatedAt: new Date() };
      this.maintenanceRequests.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByProperty(propertyId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => m.propertyId === propertyId);
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => 
      (m.senderId === user1Id && m.receiverId === user2Id) ||
      (m.senderId === user2Id && m.receiverId === user1Id)
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
    if (message) {
      message.isRead = true;
      this.messages.set(id, message);
    }
    return message;
  }

  // AI Insight methods
  async getAiInsight(id: number): Promise<AiInsight | undefined> {
    return this.aiInsights.get(id);
  }

  async getAiInsights(): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values());
  }

  async getAiInsightsByUser(userId: number): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values()).filter(i => i.userId === userId);
  }

  async createAiInsight(insertInsight: InsertAiInsight): Promise<AiInsight> {
    const id = this.currentAiInsightId++;
    const insight: AiInsight = { 
      ...insertInsight, 
      id,
      createdAt: new Date()
    };
    this.aiInsights.set(id, insight);
    return insight;
  }

  async updateAiInsight(id: number, updates: Partial<AiInsight>): Promise<AiInsight | undefined> {
    const insight = this.aiInsights.get(id);
    if (insight) {
      const updated = { ...insight, ...updates };
      this.aiInsights.set(id, updated);
      return updated;
    }
    return undefined;
  }
}

export const storage = new MemStorage();