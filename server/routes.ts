import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertContractorSchema, insertProjectSchema, insertBidSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Get contractor profile if user is a contractor
      let contractor = null;
      if (user.userType === "contractor") {
        contractor = await storage.getContractorByUserId(user.id);
      }
      
      res.json({ user: { ...user, password: undefined }, contractor });
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

  // Contractors
  app.get("/api/contractors", async (req, res) => {
    try {
      const contractors = await storage.getContractors();
      const contractorsWithUsers = await Promise.all(
        contractors.map(async (contractor) => {
          const user = await storage.getUser(contractor.userId);
          return { ...contractor, user };
        })
      );
      res.json(contractorsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get contractors" });
    }
  });

  app.get("/api/contractors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contractor = await storage.getContractor(id);
      if (!contractor) {
        return res.status(404).json({ message: "Contractor not found" });
      }
      const user = await storage.getUser(contractor.userId);
      res.json({ ...contractor, user });
    } catch (error) {
      res.status(500).json({ message: "Failed to get contractor" });
    }
  });

  app.post("/api/contractors", async (req, res) => {
    try {
      const contractorData = insertContractorSchema.parse(req.body);
      const contractor = await storage.createContractor(contractorData);
      res.json(contractor);
    } catch (error) {
      res.status(400).json({ message: "Failed to create contractor" });
    }
  });

  app.put("/api/contractors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const contractor = await storage.updateContractor(id, updates);
      if (!contractor) {
        return res.status(404).json({ message: "Contractor not found" });
      }
      res.json(contractor);
    } catch (error) {
      res.status(400).json({ message: "Failed to update contractor" });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      const projectsWithDetails = await Promise.all(
        projects.map(async (project) => {
          const homeowner = await storage.getUser(project.homeownerId);
          const bids = await storage.getBidsByProject(project.id);
          return { ...project, homeowner, bidCount: bids.length };
        })
      );
      res.json(projectsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      const homeowner = await storage.getUser(project.homeownerId);
      const bids = await storage.getBidsByProject(project.id);
      res.json({ ...project, homeowner, bids });
    } catch (error) {
      res.status(500).json({ message: "Failed to get project" });
    }
  });

  app.get("/api/users/:userId/projects", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const projects = await storage.getProjectsByHomeowner(userId);
      const projectsWithDetails = await Promise.all(
        projects.map(async (project) => {
          const bids = await storage.getBidsByProject(project.id);
          return { ...project, bidCount: bids.length };
        })
      );
      res.json(projectsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const project = await storage.updateProject(id, updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Failed to update project" });
    }
  });

  // Bids
  app.get("/api/projects/:projectId/bids", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const bids = await storage.getBidsByProject(projectId);
      const bidsWithContractors = await Promise.all(
        bids.map(async (bid) => {
          const contractor = await storage.getContractor(bid.contractorId);
          const user = contractor ? await storage.getUser(contractor.userId) : null;
          return { ...bid, contractor: contractor ? { ...contractor, user } : null };
        })
      );
      res.json(bidsWithContractors);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bids" });
    }
  });

  app.get("/api/contractors/:contractorId/bids", async (req, res) => {
    try {
      const contractorId = parseInt(req.params.contractorId);
      const bids = await storage.getBidsByContractor(contractorId);
      const bidsWithProjects = await Promise.all(
        bids.map(async (bid) => {
          const project = await storage.getProject(bid.projectId);
          const homeowner = project ? await storage.getUser(project.homeownerId) : null;
          return { ...bid, project: project ? { ...project, homeowner } : null };
        })
      );
      res.json(bidsWithProjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get contractor bids" });
    }
  });

  app.post("/api/bids", async (req, res) => {
    try {
      const bidData = insertBidSchema.parse(req.body);
      const bid = await storage.createBid(bidData);
      res.json(bid);
    } catch (error) {
      res.status(400).json({ message: "Failed to create bid" });
    }
  });

  app.put("/api/bids/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const bid = await storage.updateBid(id, updates);
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }
      
      // If bid was accepted, update project status
      if (updates.status === "accepted") {
        const project = await storage.getProject(bid.projectId);
        if (project) {
          await storage.updateProject(project.id, { status: "awarded" });
        }
      }
      
      res.json(bid);
    } catch (error) {
      res.status(400).json({ message: "Failed to update bid" });
    }
  });

  // Messages
  app.get("/api/projects/:projectId/messages", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const messages = await storage.getMessagesByProject(projectId);
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

  app.get("/api/users/:user1Id/messages/:user2Id", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
