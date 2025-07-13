# Puul AI - AI-Native Property Management Platform

## Overview

Puul AI is the first truly AI-native property management platform designed for enterprise property managers. The platform leverages artificial intelligence for predictive maintenance, tenant risk analysis, automated operations, and intelligent insights to transform property portfolio management. Built with elegant, minimal design inspired by Attio CRM, Notion, and Apple software.

## Recent Changes (2025-01-13)

- ✓ Complete platform transformation from RenovatePro to Puul AI
- ✓ Rebuilt as AI-native property management platform for enterprise users
- ✓ Redesigned with minimal, elegant aesthetic inspired by Attio CRM, Notion, and Apple
- ✓ Updated schema for property management: properties, tenants, maintenance requests, AI insights
- ✓ New user types: property_manager, tenant, owner, maintenance staff
- ✓ Added AI features: predictive maintenance, tenant risk scoring, automated insights
- ✓ Updated navigation to focus on properties, tenants, maintenance, and AI insights
- ✓ Completely redesigned landing page with modern B2B SaaS design
- ✓ Updated branding to "Puul AI" with new logo, colors, and messaging
- ✓ Enterprise-focused pricing tiers and features
- ✓ Mobile-optimized responsive design with clean typography

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, local state with React hooks
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JSON responses
- **Middleware**: Custom logging, error handling, and CORS support

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations in the `migrations` directory
- **Connection**: Neon serverless driver for PostgreSQL connections

## Key Components

### Authentication System
- Custom authentication service optimized for property management workflows
- User registration and login endpoints
- Support for multiple user types: property_manager, tenant, owner, maintenance
- Role-based access control with company-level permissions
- Subscription-based access control with Stripe integration

### Subscription System
- **Stripe Integration**: Secure payment processing for enterprise subscription plans
- **Three Pricing Tiers**: Starter ($99/property/month), Professional ($249/property/month), Enterprise (Custom)
- **Plan Features**: Tiered access to AI features, unit limits, and premium support
- **AI Credits**: Usage-based system for AI-powered features and insights

### User Management
- **Users Table**: Core user information with company association and roles
- **Property Managers**: Admin, manager, agent, coordinator roles
- **Multi-tenancy**: Company-level data isolation and permissions

### Property Management
- **Properties Table**: Comprehensive property information with AI insights
- **Property Types**: Apartment, house, commercial, mixed-use properties
- **Status Tracking**: Active, maintenance, vacant property states
- **AI Integration**: Automated insights and performance scoring

### Tenant Management
- **Tenants Table**: Complete tenant profiles with lease information
- **AI Risk Scoring**: Machine learning-based tenant risk assessment
- **Lease Tracking**: Start/end dates, rent amounts, security deposits
- **Communication**: Emergency contacts and pet policies

### Maintenance System
- **Maintenance Requests**: Categorized requests with AI diagnosis
- **AI Recommendations**: Automated maintenance suggestions and priorities
- **Cost Tracking**: Estimated vs actual costs with budget analysis
- **Scheduling**: Automated scheduling and technician assignment

### AI Insights System
- **Predictive Analytics**: Maintenance predictions, tenant risk, market analysis
- **Automated Insights**: Cost optimization, efficiency recommendations
- **Confidence Scoring**: AI confidence levels for decision support
- **Actionable Intelligence**: Clear next steps and recommended actions

### Storage Layer
- **Interface-based Design**: `IStorage` interface for data operations
- **In-Memory Implementation**: `MemStorage` class for development/demo
- **Database Integration**: Ready for PostgreSQL through Drizzle ORM

## Data Flow

### User Registration/Login
1. Frontend form submission to `/api/auth/register` or `/api/auth/login`
2. Backend validates credentials and user data
3. Returns user object and contractor profile (if applicable)
4. Frontend stores auth state in memory and updates UI

### Project Posting (Homeowners)
1. Project creation form with budget, category, and requirements
2. API call to create project in database
3. Project appears in contractor browsing interface
4. Real-time updates through query invalidation

### Bidding Process (Contractors)
1. Contractor browses available projects
2. Submits bid with pricing and proposal details
3. Homeowner reviews bids in project management interface
4. Homeowner accepts/rejects bids, updating project status

### Messaging Flow
1. Users initiate conversations through project interfaces
2. Real-time message threading by project and participants
3. Message status tracking and unread count management
4. Automatic scroll-to-bottom for new messages

## External Dependencies

### UI Framework
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Component variant management
- **Tailwind CSS**: Utility-first CSS framework

### Data Management
- **TanStack Query**: Server state management with caching
- **React Hook Form**: Form validation and submission
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting

### Development Tools
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundling for production
- **Vite**: Development server with hot module replacement
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot reload and fast refresh for frontend
- **Node.js Server**: Express server with TypeScript compilation via TSX
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: `DATABASE_URL` for database connection

### Production Build
1. **Frontend Build**: Vite compiles React app to static assets in `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Static Serving**: Express serves frontend assets and API routes
4. **Database Migrations**: Drizzle push schema changes to production database

### Architecture Decisions

#### Monorepo Structure
- **Problem**: Managing shared types between frontend and backend
- **Solution**: Shared schema definitions in `/shared` directory
- **Benefits**: Type safety across the full stack, single source of truth

#### In-Memory Storage for Demo
- **Problem**: Complex database setup for development and demos
- **Solution**: `MemStorage` implementation alongside database-ready interfaces
- **Trade-offs**: Easy setup vs. data persistence (suitable for prototyping)

#### Component-First UI Architecture
- **Problem**: Consistent design system and reusable components
- **Solution**: Shadcn/ui component library with Tailwind CSS
- **Benefits**: Rapid development, accessibility, consistent styling

#### Query-Based State Management
- **Problem**: Complex server state synchronization
- **Solution**: TanStack Query for caching, invalidation, and optimistic updates
- **Benefits**: Reduced boilerplate, automatic caching, error handling