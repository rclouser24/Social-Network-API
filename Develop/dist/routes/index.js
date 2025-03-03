import { Router } from "express";
import userRoutes from "./api/user-routes.js";
import thoughtRoutes from "./api/thought-routes.js";
const router = Router();
router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoutes);
export default router;
