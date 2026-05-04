import express from "express";
import { signup, login, getUsers } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/users", authMiddleware, roleMiddleware("admin"), getUsers);

export default router;