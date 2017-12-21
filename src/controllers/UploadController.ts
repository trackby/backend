import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import * as multer from 'multer';
import * as path from 'path';
import { BadRequest } from '../errors/BadRequest';
import { UploadService } from '../services/UploadService';

const UPLOAD_PATH = 'public/uploads';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${UPLOAD_PATH}/`);
  },
  filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage }).single('profile-photo');
const service = new UploadService();

export class UploadController {
  public static async upload(req: Request, res: Response, next: NextFunction) {
      upload(req, res, (err) =>  {
        if (err) {
          return res.status(400).send(new BadRequest());
        } else {
          return res.sendStatus(200);
        }
      });
  }

  public static async save() {
    // TODO: save the external image url in our database with relation to user-id.
  }
}
