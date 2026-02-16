import { Request, Response } from "express";

export interface IBookmarkController {
  list(req: Request, res: Response): Promise<void>;
  create(req: Request, res: Response): Promise<void>;
  remove(req: Request, res: Response): Promise<void>;
}
