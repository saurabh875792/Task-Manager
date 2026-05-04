import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  addMember,
} from "../controllers/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProjects);
router.post("/", authMiddleware, roleMiddleware("admin"), createProject);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateProject);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteProject);

router.post("/add-member", authMiddleware, roleMiddleware("admin"), addMember);

export default router;