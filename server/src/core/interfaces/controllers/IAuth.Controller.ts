import { Request, Response } from "express";

export interface IAuthController {
    googleAuth(req: Request, res: Response): Promise<void>
    getCurrentUser(req: Request, res: Response): Promise<void>
    logout(req: Request, res: Response): Promise<void>
    refeshToken(req: Request, res: Response): Promise<void>
}
