import { NextFunction, Request, Response } from "express"
import { auth } from "../lib/auth";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string,
        email: string,
        name: string,
        role: string,
        emailVerified: boolean,
      }
    }
  }
}

export const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any
      })
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!!!!"
        })
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Your email is not verified!!!"
        })
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified
      }

      if (roles.length > 0 && !roles.includes(req.user.role as UserRole)) {

        return res.status(403).json({
          success: false,
          message: "Protected Route, No Access"
        })

      }
      next();

    } catch (err) {
      next(err);
    }

  }
}