import { IBookmark } from "../../../types/bookmarkTypes";

export interface IBookmarkService {
  list(userId: string): Promise<IBookmark[]>;
  create(userId: string, data: { title: string; url: string }): Promise<IBookmark>;
  remove(userId: string, bookmarkId: string): Promise<void>;
}
