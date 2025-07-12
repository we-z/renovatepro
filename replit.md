# RenovatePro - Home Improvement Platform

## Overview

RenovatePro is a comprehensive SaaS platform that connects homeowners and property managers with trusted contractors for renovation projects. The platform features a professional landing page, subscription-based pricing tiers, and Stripe payment integration for secure transactions.

## Recent Changes (2024-12-21)

- ✓ Created professional landing page with hero, features, pricing, and testimonials sections
- ✓ Integrated Stripe API for subscription payments with three pricing tiers (Basic $29, Pro $79, Enterprise $199)
- ✓ Updated database schema to include subscription fields (stripeCustomerId, stripeSubscriptionId, subscriptionStatus, subscriptionPlan)
- ✓ Restructured routing: Landing page at `/`, app functionality at `/app/*`, subscription page at `/subscribe`
- ✓ Added subscription gating system to control access based on user plans
- ✓ Implemented clean, trustworthy design with professional UI components

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
- Custom authentication service without JWT/sessions for simplicity
- User registration and login endpoints
- Support for two user types: homeowners and contractors
- Password stored in plain text (suitable for development/demo purposes)
- Subscription-based access control with Stripe integration

### Subscription System
- **Stripe Integration**: Secure payment processing for subscription plans
- **Three Pricing Tiers**: Basic ($29/month), Pro ($79/month), Enterprise ($199/month)
- **Plan Features**: Tiered access to project posting limits, contractor matching, and premium features
- **Subscription Management**: Track subscription status, plan type, and Stripe customer/subscription IDs

### User Management
- **Users Table**: Core user information (username, email, contact details)
- **Contractors Table**: Extended profile for contractors with company info, specialties, ratings
- Role-based access control based on `userType` field

### Project Management
- **Projects Table**: Homeowner project postings with budgets, timelines, and requirements
- **Project Lifecycle**: posted → bidding → awarded → in_progress → completed
- **Categories**: Kitchen, bathroom, roofing, flooring, deck/patio, painting, general construction

### Bidding System
- **Bids Table**: Contractor bids on projects with pricing and proposals
- **Bid Status**: pending → accepted/rejected
- Real-time bid management and acceptance workflow

### Messaging System
- **Messages Table**: Direct communication between homeowners and contractors
- **Thread-based**: Messages organized by project and participants
- **Read Status**: Message read/unread tracking

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