import { Request, Response, NextFunction } from "express";
import AuthUser from "../models/authUsersModels.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];

    const user = await AuthUser.findOne({ token });

    if (!user) {
      throw new Error("Invalid token");
    }

    if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
      throw new Error("Token expired");
    }

    (req as any).user = user;

    next(); 
  } catch (error: any) {
    res.status(401).send({ Success: false, error: error.message });
  }
};