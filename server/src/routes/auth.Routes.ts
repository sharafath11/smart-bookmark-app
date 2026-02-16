import express from "express";
import { container } from "tsyringe";
import { TYPES } from "../core/types";
import { IAuthController } from "../core/interfaces/controllers/IAuth.Controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

const authController = container.resolve<IAuthController>(TYPES.IAuthController);

router.post("/google", authController.googleAuth.bind(authController));
router.get("/me",authenticateToken,authController.getCurrentUser.bind(authController))
router.post("/logout",authenticateToken,authController.logout.bind(authController))
router.post("/refresh-token",authController.refeshToken.bind(authController))
export default router;
