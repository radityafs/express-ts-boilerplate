import jwt from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
import response from "../utils/response.util";

interface UserJwt {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return response.failed(res, "You are not logged in", 401);
    }

    token = token.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as UserJwt;

    if (!decoded.id) {
      return response.failed(res, "Token is not valid / expired", 401);
    }

    req.userId = decoded.id.toString();
    next();
  } catch (error) {
    return response.failed(res, "Token is not valid / expired", 401);
  }
};

export default authenticated;
