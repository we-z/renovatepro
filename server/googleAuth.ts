import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

// Google OAuth credentials must be set as environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth credentials not configured");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET not configured");
}

// Configure session store
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development with HTTP
      sameSite: 'lax',
      maxAge: sessionTtl,
    },
  });
}

export async function setupGoogleAuth(app: Express) {
  // Trust proxy for secure cookies in production
  app.set("trust proxy", 1);
  
  // Session middleware
  app.use(getSession());
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "https://c87ef50c-4409-492f-a048-caf4e8291a44-00-1hbrq1kktyewb.janeway.replit.dev/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract user info from Google profile
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value;
      const firstName = profile.name?.givenName;
      const lastName = profile.name?.familyName;
      const profileImageUrl = profile.photos?.[0]?.value;

      // Check if user exists
      let user = await storage.getUser(googleId);
      
      if (!user) {
        // Create new user
        user = await storage.upsertUser({
          id: googleId,
          email,
          firstName,
          lastName,
          profileImageUrl,
          userType: null, // Will be set during onboarding
        });
      } else {
        // Update existing user
        user = await storage.upsertUser({
          id: googleId,
          email,
          firstName,
          lastName,
          profileImageUrl,
          userType: user.userType, // Preserve existing user type
          phone: user.phone,
          location: user.location,
          stripeCustomerId: user.stripeCustomerId,
          stripeSubscriptionId: user.stripeSubscriptionId,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPlan: user.subscriptionPlan,
        });
      }

      return done(null, user);
    } catch (error) {
      console.error("Google OAuth error:", error);
      return done(error, null);
    }
  }));

  // Passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      console.error("Deserialize user error:", error);
      done(null, false);
    }
  });

  // Auth routes
  app.get("/api/auth/google", (req, res, next) => {
    console.log("=== Google OAuth Debug ===");
    console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("Callback URL configured:", "https://c87ef50c-4409-492f-a048-caf4e8291a44-00-1hbrq1kktyewb.janeway.replit.dev/api/auth/google/callback");
    console.log("Request host:", req.get('host'));
    console.log("========================");
    
    passport.authenticate("google", {
      scope: ["profile", "email"],
      accessType: "offline",
      prompt: "consent", // Force consent screen to bypass caching
    state: Date.now().toString() // Add timestamp to prevent caching
    })(req, res, next);
  });

  app.get("/api/auth/google/callback", 
    (req, res, next) => {
      console.log("=== OAuth Callback Received ===");
      console.log("Query params:", req.query);
      console.log("Request URL:", req.url);
      console.log("==============================");
      next();
    },
    (req, res, next) => {
      passport.authenticate("google", (err, user, info) => {
        if (err) {
          console.error("OAuth authentication error:", err);
          return res.redirect("/?error=auth_error");
        }
        if (!user) {
          console.log("No user returned from OAuth");
          return res.redirect("/?error=no_user");
        }
        
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr);
            return res.redirect("/?error=login_error");
          }
          
          console.log("OAuth successful, user logged in:", user);
          
          if (!user.userType) {
            console.log("New user needs onboarding");
            return res.redirect("/?onboarding=true");
          } else {
            console.log("Existing user authenticated");
            return res.redirect("/?success=true");
          }
        });
      })(req, res, next);
    }
  );

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // User route is handled in routes.ts
}

// Middleware to check if user is authenticated
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user has completed onboarding
export const requireUserType: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = req.user as any;
    if (user.userType) {
      return next();
    }
    return res.status(403).json({ message: "User type not set. Complete onboarding first." });
  }
  res.status(401).json({ message: "Unauthorized" });
};