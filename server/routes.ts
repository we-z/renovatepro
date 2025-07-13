import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertUserSchema, insertPropertySchema, insertTenantSchema, insertMaintenanceRequestSchema, insertMessageSchema, insertAiInsightSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  // Users
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Properties
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      const propertiesWithDetails = await Promise.all(
        properties.map(async (property) => {
          const manager = await storage.getUser(property.managerId);
          const tenants = await storage.getTenantsByProperty(property.id);
          const maintenanceRequests = await storage.getMaintenanceRequestsByProperty(property.id);
          return { 
            ...property, 
            manager, 
            tenantCount: tenants.length,
            maintenanceCount: maintenanceRequests.filter(r => r.status === 'pending').length
          };
        })
      );
      res.json(propertiesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      const manager = await storage.getUser(property.managerId);
      const tenants = await storage.getTenantsByProperty(property.id);
      const maintenanceRequests = await storage.getMaintenanceRequestsByProperty(property.id);
      res.json({ ...property, manager, tenants, maintenanceRequests });
    } catch (error) {
      res.status(500).json({ message: "Failed to get property" });
    }
  });

  app.get("/api/users/:managerId/properties", async (req, res) => {
    try {
      const managerId = parseInt(req.params.managerId);
      const properties = await storage.getPropertiesByManager(managerId);
      const propertiesWithDetails = await Promise.all(
        properties.map(async (property) => {
          const tenants = await storage.getTenantsByProperty(property.id);
          const maintenanceRequests = await storage.getMaintenanceRequestsByProperty(property.id);
          return { 
            ...property, 
            tenantCount: tenants.length,
            maintenanceCount: maintenanceRequests.filter(r => r.status === 'pending').length
          };
        })
      );
      res.json(propertiesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user properties" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: "Failed to create property" });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const property = await storage.updateProperty(id, updates);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: "Failed to update property" });
    }
  });

  // Tenants
  app.get("/api/tenants", async (req, res) => {
    try {
      const tenants = await storage.getTenants();
      const tenantsWithDetails = await Promise.all(
        tenants.map(async (tenant) => {
          const property = await storage.getProperty(tenant.propertyId);
          return { ...tenant, property };
        })
      );
      res.json(tenantsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get tenants" });
    }
  });

  app.get("/api/properties/:propertyId/tenants", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const tenants = await storage.getTenantsByProperty(propertyId);
      res.json(tenants);
    } catch (error) {
      res.status(500).json({ message: "Failed to get property tenants" });
    }
  });

  app.post("/api/tenants", async (req, res) => {
    try {
      const tenantData = insertTenantSchema.parse(req.body);
      const tenant = await storage.createTenant(tenantData);
      res.json(tenant);
    } catch (error) {
      res.status(400).json({ message: "Failed to create tenant" });
    }
  });

  app.put("/api/tenants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const tenant = await storage.updateTenant(id, updates);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenant);
    } catch (error) {
      res.status(400).json({ message: "Failed to update tenant" });
    }
  });

  // Maintenance Requests
  app.get("/api/maintenance-requests", async (req, res) => {
    try {
      const requests = await storage.getMaintenanceRequests();
      const requestsWithDetails = await Promise.all(
        requests.map(async (request) => {
          const property = await storage.getProperty(request.propertyId);
          const tenant = request.tenantId ? await storage.getTenant(request.tenantId) : null;
          const assignedTo = request.assignedTo ? await storage.getUser(request.assignedTo) : null;
          return { ...request, property, tenant, assignedTo };
        })
      );
      res.json(requestsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get maintenance requests" });
    }
  });

  app.get("/api/properties/:propertyId/maintenance-requests", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const requests = await storage.getMaintenanceRequestsByProperty(propertyId);
      const requestsWithDetails = await Promise.all(
        requests.map(async (request) => {
          const tenant = request.tenantId ? await storage.getTenant(request.tenantId) : null;
          const assignedTo = request.assignedTo ? await storage.getUser(request.assignedTo) : null;
          return { ...request, tenant, assignedTo };
        })
      );
      res.json(requestsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get property maintenance requests" });
    }
  });

  app.post("/api/maintenance-requests", async (req, res) => {
    try {
      const requestData = insertMaintenanceRequestSchema.parse(req.body);
      const request = await storage.createMaintenanceRequest(requestData);
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Failed to create maintenance request" });
    }
  });

  app.put("/api/maintenance-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const request = await storage.updateMaintenanceRequest(id, updates);
      if (!request) {
        return res.status(404).json({ message: "Maintenance request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Failed to update maintenance request" });
    }
  });

  // AI Insights
  app.get("/api/ai-insights", async (req, res) => {
    try {
      const insights = await storage.getAiInsights();
      const insightsWithDetails = await Promise.all(
        insights.map(async (insight) => {
          const user = await storage.getUser(insight.userId);
          const property = insight.propertyId ? await storage.getProperty(insight.propertyId) : null;
          return { ...insight, user, property };
        })
      );
      res.json(insightsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI insights" });
    }
  });

  app.get("/api/users/:userId/ai-insights", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const insights = await storage.getAiInsightsByUser(userId);
      const insightsWithDetails = await Promise.all(
        insights.map(async (insight) => {
          const property = insight.propertyId ? await storage.getProperty(insight.propertyId) : null;
          return { ...insight, property };
        })
      );
      res.json(insightsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user AI insights" });
    }
  });

  app.post("/api/ai-insights", async (req, res) => {
    try {
      const insightData = insertAiInsightSchema.parse(req.body);
      const insight = await storage.createAiInsight(insightData);
      res.json(insight);
    } catch (error) {
      res.status(400).json({ message: "Failed to create AI insight" });
    }
  });

  app.put("/api/ai-insights/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const insight = await storage.updateAiInsight(id, updates);
      if (!insight) {
        return res.status(404).json({ message: "AI insight not found" });
      }
      res.json(insight);
    } catch (error) {
      res.status(400).json({ message: "Failed to update AI insight" });
    }
  });

  // Messages
  app.get("/api/properties/:propertyId/messages", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const messages = await storage.getMessagesByProperty(propertyId);
      const messagesWithUsers = await Promise.all(
        messages.map(async (message) => {
          const sender = await storage.getUser(message.senderId);
          const receiver = await storage.getUser(message.receiverId);
          return { ...message, sender, receiver };
        })
      );
      res.json(messagesWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.get("/api/messages/between/:user1Id/:user2Id", async (req, res) => {
    try {
      const user1Id = parseInt(req.params.user1Id);
      const user2Id = parseInt(req.params.user2Id);
      const messages = await storage.getMessagesBetweenUsers(user1Id, user2Id);
      const messagesWithUsers = await Promise.all(
        messages.map(async (message) => {
          const sender = await storage.getUser(message.senderId);
          const receiver = await storage.getUser(message.receiverId);
          return { ...message, sender, receiver };
        })
      );
      res.json(messagesWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to create message" });
    }
  });

  app.put("/api/messages/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markMessageAsRead(id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to mark message as read" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post('/api/get-or-create-subscription', async (req, res) => {
    try {
      // For demo purposes, return a mock subscription
      const mockSubscription = {
        subscriptionId: "sub_mock123",
        clientSecret: "pi_mock123_secret_mock456"
      };
      res.json(mockSubscription);
    } catch (error: any) {
      return res.status(400).send({ error: { message: error.message } });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}