import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "";
if (!JWT_SECRET) {
    console.error("CRITICAL ERROR: JWT_SECRET is not defined in environment variables.");
    process.exit(1);
}
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role,
            franchiseId: decoded.franchiseId || null,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Unauthorized: Token expired or invalid" });
    }
};
export const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }
        next();
    };
};
export const tenant = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (req.user.role !== "SUPER_ADMIN" && req.user.role !== "HQ_USER") {
        if (!req.user.franchiseId) {
            return res.status(403).json({ error: "Forbidden: No franchise assigned" });
        }
    }
    next();
};
//# sourceMappingURL=auth.middleware.js.map