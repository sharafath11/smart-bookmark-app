import mongoose, { Model, Schema } from "mongoose";
import { IBookmark } from "../types/bookmarkTypes";

const bookmarkSchema: Schema<IBookmark> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    url: { type: String, required: true, trim: true, maxlength: 2048 },
  },
  { timestamps: true }
);

export const BookmarkModel: Model<IBookmark> = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
