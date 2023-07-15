import express from "express";
import { createUser } from "../controllers/UserController";
import { loginUser } from "../controllers/AuthController";
import authenticate from "../middlewares/AuthMiddleware";
import { createReview } from "../controllers/ReviewsController";

const router = express.Router();

router.post("/users", createUser);
router.post("/login", loginUser);
router.post("/reviews", authenticate, createReview);

export { router as userRoutes };
