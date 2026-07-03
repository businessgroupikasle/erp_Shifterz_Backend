import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    franchiseId?: string | null;
  };
}

// Middleware to verify JWT token
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "shifterz_secret_key") as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to require specific roles (e.g. SUPER_ADMIN, FRANCHISE_ADMIN)
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: Insufficient permissions" });
      return;
    }
    
    next();
  };
};

// Middleware to enforce Tenant Scope (Multi-tenancy isolation)
export const tenantScope = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  // Super Admins can access everything, they don't get scoped
  if (req.user.role === "SUPER_ADMIN" || req.user.role === "HQ_USER") {
    // If they want to filter by franchise, they should pass it in query/body
    (req as any).tenantFilter = {}; 
    next();
    return;
  }

  // Franchise users are strictly scoped to their franchiseId
  if (!req.user.franchiseId) {
    res.status(403).json({ error: "User is not assigned to a franchise" });
    return;
  }

  // Attach a strict filter object that can be merged into Prisma queries
  (req as any).tenantFilter = { franchiseId: req.user.franchiseId };
  next();
};
