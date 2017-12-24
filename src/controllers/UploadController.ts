import * as del from 'del';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import * as multer from 'multer';
import * as path from 'path';
import { extname } from 'path';
import * as util from 'util';
import { BadRequest } from '../errors/BadRequest';
import { ServerError } from '../errors/ServerError';
import { UploadService } from '../services/UploadService';

const HOST = process.env.HOST;
const UPLOAD_PATH = process.env.STATIC_DIR;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${UPLOAD_PATH}/`);
  },
  filename(req: any, file, cb) {
    cb(null, file.fieldname + '-' + Math.random().toString(36).substr(2, 32) + '-' + Date.now()
        + path.extname(file.originalname));
  },
});

const clean = (folderPath, url) => {
  // Delete old profile photos but not the folder itself.
  del.sync([`${folderPath}/${url}`, `!${folderPath}`]);
};

const upload = util.promisify(multer({ storage }).single('profile-photo'));
const service = new UploadService();

export class UploadController {
  public static async uploadProfilePhoto(req: any, res: Response, next: NextFunction) {
    const { user_id } = req.body;
    const success = await service.findById(user_id).catch((error) => {throw new Error(error); });
    let imageUrl = '';
    try {
        await upload(req, res);
        imageUrl = `${HOST}/static/${req.file.filename}`;
      } catch (e) {
        return res.status(400).send(new BadRequest('Image upload operation is not successful!'));
      }

    try {
      let profilePhoto: any = null;
      if (!success) {
             profilePhoto = await service.uploadPhoto(user_id, imageUrl);
          } else {
            const delUrl = success.substring(22);
            profilePhoto = await service.update(user_id, imageUrl);
            clean(UPLOAD_PATH, delUrl);
          }
      if (profilePhoto) {
            res.status(200).send({ profilePhoto });
          } else {
            return res.status(500).send(new ServerError());
          }
        } catch (e) {
          return res.status(400).send(new BadRequest());
        }
      }

      public static async removeProfilePhoto(req: any, res: Response, next: NextFunction) {
        const { user_id } = req.body;

        try {
          const success = await service.delete(user_id);
          if (success) {
            const delUrl = success.substring(22);
            clean(UPLOAD_PATH, delUrl);
            return res.sendStatus(200);
          } else {
            return res.status(400).send(new BadRequest());
          }
        } catch (e) {
          return res.status(400).send(new BadRequest('Image delete operation is not successful!'));
        }
      }

      public static async retrieveProfilePhoto(req: any, res: Response, next: NextFunction) {
        const { userid } = req.params;

        try {
          const profilePhoto = await service.findById(userid);
          if (profilePhoto) {
            return res.status(200).send({profilePhoto});
          } else {
            return res.status(400).send(new BadRequest());
          }
        } catch (e) {
          return res.status(400).send(new BadRequest('Image retrieve operation is not successful!'));
        }
      }
  }
