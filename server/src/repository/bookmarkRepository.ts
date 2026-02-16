import { BookmarkModel } from "../models/bookmark.Model";
import { IBookmark } from "../types/bookmarkTypes";
import { IBookmarkRepository } from "../core/interfaces/repository/IBookmarkRepository";
import { BaseRepository } from "./baseRepository";

export class BookmarkRepository extends BaseRepository<IBookmark, IBookmark> implements IBookmarkRepository {
  constructor() {
    super(BookmarkModel);
  }

  async findByUser(userId: string): Promise<IBookmark[]> {
    return this.model
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec() as unknown as IBookmark[];
  }
}
