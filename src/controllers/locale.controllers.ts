import { Request, Response } from "express";
import response from "@/utils/response.util";
import path from "path";
import fs from "fs";

export const getLocale = async (_: Request, res: Response) => {
  try {
    const locale = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../locale/data.json"), "utf-8")
    );

    return res.json(locale);
  } catch (error) {
    return response.failed(res, error, 500);
  }
};
export const updateLocale = async (req: Request, res: Response) => {
  try {
    const locale = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../locale/data.json"), "utf-8")
    );

    const updatedLocale = { ...locale, ...req.body };
    const sortKeys = Object.keys(updatedLocale).sort();
    const sortedLocale: any = {};

    sortKeys.forEach((key) => {
      if (updatedLocale[key] === null) delete sortedLocale[key];
      else sortedLocale[key] = updatedLocale[key];
    });

    fs.writeFileSync(
      path.join(__dirname, "../locale/data.json"),
      JSON.stringify(sortedLocale, null, 2)
    );

    return res.json(sortedLocale);
  } catch (error) {
    return response.failed(res, error, 500);
  }
};
