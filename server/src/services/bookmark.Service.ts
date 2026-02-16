import { inject, injectable } from "tsyringe";
import { IBookmarkService } from "../core/interfaces/services/IBookmarkService";
import { IBookmarkRepository } from "../core/interfaces/repository/IBookmarkRepository";
import { TYPES } from "../core/types";
import { throwError } from "../utils/response";
import { MESSAGES } from "../const/messages";
import { validateBookmarkInput } from "../utils/validateBookmark";
import { IBookmark } from "../types/bookmarkTypes";
import { Types } from "mongoose";

const normalizeUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    return parsed.toString();
  } catch {
    return "";
  }
};

@injectable()
export class BookmarkService implements IBookmarkService {
  constructor(
    @inject(TYPES.IBookmarkRepository)
    private _bookmarkRepo: IBookmarkRepository
  ) {}

  async list(userId: string): Promise<IBookmark[]> {
    return this._bookmarkRepo.findByUser(userId);
  }

  async create(userId: string, data: { title: string; url: string }): Promise<IBookmark> {
    validateBookmarkInput(data.title, data.url);

    const title = data.title.trim();
    const normalizedUrl = normalizeUrl(data.url || "");

    if (!normalizedUrl) {
      throwError(MESSAGES.BOOKMARK.INVALID_INPUT);
    }

    return this._bookmarkRepo.create({
      userId: new Types.ObjectId(userId),
      title,
      url: normalizedUrl,
    } as Partial<IBookmark>);
  }

  async remove(userId: string, bookmarkId: string): Promise<void> {
    const existing = await this._bookmarkRepo.findById(bookmarkId);
    if (!existing) throwError(MESSAGES.BOOKMARK.NOT_FOUND, 404);
    if (existing.userId.toString() !== userId) {
      throwError(MESSAGES.COMMON.ACCESS_DENIED, 403);
    }

    await this._bookmarkRepo.delete(bookmarkId);
  }
}
