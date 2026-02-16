import { IBookmark } from "../../../types/bookmarkTypes";
import { IBaseRepository } from "./IBaseRepository";

export interface IBookmarkRepository extends IBaseRepository<IBookmark, IBookmark> {
  findByUser(userId: string): Promise<IBookmark[]>;
}
