import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import prisma from "../database/mysql.database";
import response from "../utils/response.util";
import UserMapper from "../utils/data/mapping/user.util";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  try {
    // Check email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return response.failed(res, "User not found", 404);
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return response.failed(res, "Invalid password", 400);
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    // Response
    return response.success(res, "Login success", {
      ...UserMapper(user),
      token,
      refreshToken,
    });
  } catch (error: any) {
    return response.failed(res, error.message, 500);
  }
};

export const register = async (req: Request, res: Response) => {
  let { name, email, password } = req.body;

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    if (!user) {
      return response.failed(res, "Failed to create user", 500);
    }

    // Response
    return response.success(res, "Register success", UserMapper(user));
  } catch (error: any) {
    return response.failed(res, error.message, 500);
  }
};
