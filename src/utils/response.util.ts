import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Response } from "express";
import cleanSensitiveData from "./cleanSensitiveData";

interface Pagination {
  total_data: number;
  total_page: number;
  current_page: number;
  limit: number;
}

const response = {
  success: (
    res: Response,
    message: string,
    data?: any,
    pagination?: Pagination
  ) => {
    if (pagination) {
      return res.json({
        code: 200,
        status: "success",
        data: cleanSensitiveData(data),
        message,
        pagination,
      });
    }

    return res.json({
      code: 200,
      status: "success",
      ...(data && { data: cleanSensitiveData(data) }),
      message,
    });
  },
  failed: (res: Response, error: any, code?: number) => {
    if (error instanceof PrismaClientKnownRequestError) {
      let message = "";

      switch (error.code) {
        case "P2025":
          message = "Data not found";
          break;
        case "P2002":
          message = "Duplicate data";
          break;
        case "P2003":
          message = "Foreign key constraint error";
          break;
        case "P2004":
          message = "Unique constraint error";
          break;
        default:
          message = "Internal server error - Prisma error code not defined";
          break;
      }

      return res.status(code || 400).json({
        code: code || 400,
        status: "failed",
        error: message,
      });
    }

    return res.status(code || 400).json({
      code: code || 400,
      status: "failed",
      error: error.message || error,
    });
  },
};

export default response;
