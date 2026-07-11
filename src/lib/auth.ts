import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "./db.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    permissions: string[];
    franchiseId?: string | null;
  };
}

// Helper to resolve user permissions based on user-specific overrides or role defaults
export async function resolveUserPermissions(userId: string, role: string): Promise<string[]> {
  try {
    const user = await db.employee.findUnique({
      where: { id: userId },
      include: { permission: true },
    });
    
    if (user?.permission?.modules && user.permission.modules.length > 0) {
      return user.permission.modules;
    }
    
    const baseRole = role.split("|")[0] || "";
    const rp = await db.rolePermission.findUnique({
      where: { role: baseRole },
    });
    
    if (rp?.permissions) {
      return rp.permissions;
    }
  } catch (err) {
    console.error("Error resolving user permissions:", err);
  }
  
  const fallbackMatrix: Record<string, string[]> = {
    SUPER_ADMIN: ["dashboard", "carin", "jobs", "outpass", "leads", "customers", "billing", "payments", "inventory", "reports", "employees", "attendance", "settings", "roles"],
    HQ_USER: ["dashboard", "carin", "jobs", "outpass", "leads", "customers", "billing", "payments", "inventory", "reports", "employees", "attendance", "settings"],
    FRANCHISE_ADMIN: ["dashboard", "carin", "jobs", "outpass", "leads", "customers", "billing", "payments", "inventory", "reports", "employees", "attendance"],
    BRANCH_MANAGER: ["dashboard", "carin", "jobs", "outpass", "leads", "customers", "billing", "payments", "inventory", "reports", "attendance"],
    RECEPTION_EXECUTIVE: ["dashboard", "carin", "outpass", "customers", "leads"],
    SERVICE_ADVISOR: ["dashboard", "carin", "jobs", "customers", "leads"],
    TECHNICIAN: ["dashboard", "jobs", "attendance"],
    QUALITY_INSPECTOR: ["dashboard", "jobs", "carin"],
    BILLING_EXECUTIVE: ["dashboard", "billing", "payments", "reports"],
    INVENTORY_EXECUTIVE: ["dashboard", "inventory", "reports"],
  };
  
  const base = role.split("|")[0] || "";
  return fallbackMatrix[base] || [];
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
    // Extract base role if serialized with custom dashboard options (e.g. ROLE_NAME|leads,carin)
    if (decoded.role && typeof decoded.role === "string" && decoded.role.includes("|")) {
      decoded.role = decoded.role.split("|")[0];
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to require specific permissions
export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      res.status(403).json({ error: `Forbidden: Missing required permission: ${permission}` });
      return;
    }
    
    next();
  };
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
