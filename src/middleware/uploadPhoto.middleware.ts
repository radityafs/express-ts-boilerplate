import multer from "multer";
import path from "path";
import fs from "fs";
import { NextFunction, Response, Request } from "express";
import response from "../utils/response.util";

const multerUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    if ([".jpg", ".png", ".jpeg", ".webp"].includes(ext.toLowerCase())) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    files: 5,
    fileSize: 1024 * 1024 * 3, // 3MB file size limit
  },
});

const singleUpload = (req: Request, res: Response, next: NextFunction) => {
  const multerSingle = multerUpload.single("image");
  multerSingle(req, res, async (err: any) => {
    if (err) {
      return response.failed(res, err.message, 400);
    }

    if (req.file) {
      try {
        const randomName = `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.extname(req.file.originalname)}`;

        fs.writeFileSync(
          path.join(__dirname, "../../public", randomName),
          req.file.buffer
        );

        req.body.image = randomName;
        next();
      } catch (error) {
        return response.failed(res, "Failed upload file", 500);
      }
    } else {
      next();
    }
  });
};

const multiUpload = (req: Request, res: Response, next: NextFunction) => {
  const multerMultiple = multerUpload.array("images", 5);
  multerMultiple(req, res, async (err: any) => {
    if (err) {
      return response.failed(res, err.message, 400);
    }

    if (req.files) {
      try {
        const promises = (req.files as Express.Multer.File[]).map((file) => {
          return new Promise((resolve, reject) => {
            try {
              const randomName = `${Date.now()}-${Math.round(
                Math.random() * 1e9
              )}${path.extname(file.originalname)}`;

              fs.writeFileSync(
                path.join(__dirname, "../../public", randomName),
                file.buffer
              );
              resolve(randomName);
            } catch (error) {
              reject(error);
            }
          });
        });

        const uploadedFiles = await Promise.all(promises);
        req.body.images = uploadedFiles;
        next();
      } catch (error) {
        return response.failed(res, "Failed upload file", 500);
      }
    } else {
      next();
    }
  });
};

export { singleUpload, multiUpload };
