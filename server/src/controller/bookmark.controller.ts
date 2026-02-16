import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../core/types";
import { IBookmarkController } from "../core/interfaces/controllers/IBookmark.Controller";
import { IBookmarkService } from "../core/interfaces/services/IBookmarkService";
import { handleControllerError, sendResponse, throwError } from "../utils/response";
import { StatusCode } from "../enums/statusCode";
import { MESSAGES } from "../const/messages";
import { validateBodyFields } from "../utils/validateRequest";
import { getIO } from "../lib/socket";

@injectable()
export class BookmarkController implements IBookmarkController {
  constructor(
    @inject(TYPES.IBookmarkService) private _bookmarkService: IBookmarkService
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as Request & { userId?: string }).userId;
      if (!userId) throwError(MESSAGES.AUTH.AUTH_REQUIRED, StatusCode.UNAUTHORIZED);

      const data = await this._bookmarkService.list(userId);
      sendResponse(res, StatusCode.OK, MESSAGES.BOOKMARK.LIST_SUCCESS, true, data);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as Request & { userId?: string }).userId;
      if (!userId) throwError(MESSAGES.AUTH.AUTH_REQUIRED, StatusCode.UNAUTHORIZED);

      validateBodyFields(req, ["title", "url"]);
      const { title, url } = req.body;

      const bookmark = await this._bookmarkService.create(userId, { title, url });
      sendResponse(res, StatusCode.CREATED, MESSAGES.BOOKMARK.CREATED, true, bookmark);

      getIO().to(`user:${userId}`).emit("bookmarks:changed", {
        action: "created",
        bookmark,
      });
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as Request & { userId?: string }).userId;
      if (!userId) throwError(MESSAGES.AUTH.AUTH_REQUIRED, StatusCode.UNAUTHORIZED);

      const { id } = req.params;
      if (!id) throwError(MESSAGES.COMMON.MISSING_FIELDS, StatusCode.BAD_REQUEST);

      await this._bookmarkService.remove(userId, id);
      sendResponse(res, StatusCode.OK, MESSAGES.BOOKMARK.DELETED, true);

      getIO().to(`user:${userId}`).emit("bookmarks:changed", {
        action: "deleted",
        bookmarkId: id,
      });
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
