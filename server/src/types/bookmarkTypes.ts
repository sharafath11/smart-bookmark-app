import { Document, Types } from "mongoose";

export interface IBookmark extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
