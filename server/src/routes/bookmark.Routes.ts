import express from "express";
import { container } from "tsyringe";
import { TYPES } from "../core/types";
import { IBookmarkController } from "../core/interfaces/controllers/IBookmark.Controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();
const bookmarkController = container.resolve<IBookmarkController>(TYPES.IBookmarkController);

router.get("/", authenticateToken, bookmarkController.list.bind(bookmarkController));
router.post("/", authenticateToken, bookmarkController.create.bind(bookmarkController));
router.delete("/:id", authenticateToken, bookmarkController.remove.bind(bookmarkController));

export default router;
