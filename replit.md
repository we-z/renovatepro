# RenovatePro - Home Improvement Platform

## Overview

RenovatePro is a comprehensive SaaS platform that connects homeowners and property managers with trusted contractors for renovation projects. The platform features a professional landing page, subscription-based pricing tiers, and Stripe payment integration for secure transactions.

## Recent Changes (2025-01-14)

### Payment Processing System (2025-01-14)
- ✓ Implemented comprehensive Stripe payment integration for project deposits
- ✓ Added deposits table to database schema with payment status tracking
- ✓ Created secure backend payment processing routes with Stripe API integration
- ✓ Built sophisticated deposit payment modal with multi-step flow
- ✓ Added deposit payment page with full Stripe Elements integration
- ✓ Enhanced bid table with "Pay Deposit" functionality for accepted bids
- ✓ Implemented payment confirmation and project status updates
- ✓ Added proper error handling and user feedback throughout payment flow
- ✓ Created secure payment intent creation and confirmation workflow
- ✓ Integrated payment success callbacks to update project and bid statuses

### UI/UX Enhancements (2025-01-14)
- ✓ Completely redesigned "How RenovatePro Works" section with sophisticated visual design
- ✓ Added advanced glassmorphism cards with enhanced backdrop blur effects
- ✓ Implemented 3D step numbers with gradient backgrounds and sparkle animations
- ✓ Created dynamic progress indicators for each process step
- ✓ Added floating decorative elements with subtle animations
- ✓ Enhanced section with professional typography hierarchy and spacing
- ✓ Integrated decorative grid patterns and connection lines between steps
- ✓ Added new float animation variants for enhanced visual appeal
- ✓ Improved overall landing page aesthetic with Attio-inspired minimal design

### Previous Changes (2025-01-12)
- ✓ Enhanced landing page with comprehensive hover animations and visual effects
- ✓ Added smooth transitions, scale effects, and gradient animations throughout all sections
- ✓ Implemented advanced CSS animations: fadeInUp, fadeInRight, bounceSubtle, and shimmer effects
- ✓ Enhanced navigation with backdrop blur, rotating logos, and animated underlines
- ✓ Upgraded hero section with floating background elements and interactive text effects
- ✓ Improved features section with 3D hover transforms and gradient overlays
- ✓ Enhanced pricing cards with dynamic scaling, shadow effects, and animated features
- ✓ Added beautiful CTA section with gradient backgrounds and pulsing elements
- ✓ Upgraded footer with interactive hover states and smooth transitions
- ✓ Added glass morphism effects and pulse animations for premium visual appeal
- ✓ Added comprehensive Open Graph and Twitter Card meta tags for beautiful link previews
- ✓ Created professional OG preview image (1200x630) with brand elements and key features
- ✓ Added SEO-optimized meta tags including title, description, and keywords
- ✓ Created custom favicon and branding elements for better recognition

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

### Payment Processing System (New)
- **Deposit Management**: Secure handling of project deposits through Stripe
- **Payment Intents**: Server-side creation and confirmation of Stripe payment intents
- **Escrow Protection**: Funds held securely until project completion
- **Multi-step Flow**: User-friendly payment process with clear status updates
- **Integration Points**: Seamless connection between bids, projects, and payments

### Storage Layer
- **Interface-based Design**: `IStorage` interface for data operations
- **In-Memory Implementation**: `MemStorage` class for development/demo
- **Database Integration**: Ready for PostgreSQL through Drizzle ORM
- **Deposits Management**: Full CRUD operations for payment tracking and status updates

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