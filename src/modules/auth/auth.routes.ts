import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { loginSchema, updateProfileSchema, updateRolePermissionsSchema } from "./auth.validation.js";

const router = Router();

// Public route
router.post("/login", validate(loginSchema), authController.login);

// Protected routes
router.get("/me", authenticate, authController.getMe);
router.put("/profile", authenticate, validate(updateProfileSchema), authController.updateProfile);

// Admin routes (Example RBAC usage)
router.get("/roles/permissions", authenticate, authorize(["SUPER_ADMIN", "HQ_USER"]), authController.getRolePermissions);
router.put("/roles/permissions/:role", authenticate, authorize(["SUPER_ADMIN", "HQ_USER"]), validate(updateRolePermissionsSchema), authController.updateRolePermissions);

export const authRoutes = router;
