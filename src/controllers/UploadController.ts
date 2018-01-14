import * as del from 'del';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import * as multer from 'multer';
import * as path from 'path';
import { extname } from 'path';
import * as util from 'util';
import { BadRequest } from '../errors/BadRequest';
import { Forbidden } from '../errors/Forbidden';
import { ServerError } from '../errors/ServerError';
import { Unauthorized } from '../errors/Unauthorized';
import { UploadService } from '../services/UploadService';

const HOST = process.env.HOST;
const UPLOAD_PATH = process.env.STATIC_DIR;
const TRIM_LENGTH = HOST.length + 8;
const MAX_SIZE = 8 * Math.pow(10, 6);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${UPLOAD_PATH}/`);
  },
  filename(req: any, file, cb) {
    cb(
      null,
      file.fieldname +
        '-' +
        Math.random().toString(36).substr(2, 32) +
        '-' +
        Date.now() +
        path.extname(file.originalname),
    );
  },
});

const imageFilter = (req, file, cb) => {
  if (req.body.category) {
    if (req.body.category !== 'users' && !req.body.id) {
        return cb(new Error('Field -id- cannot be empty!'), false);
    }
  } else {
    return cb(new Error('Field -category- cannot be empty!'), false);
  }
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const clean = (folderPath, url) => {
  // Delete old profile photos but not the folder itself.
  del.sync([ `${folderPath}/${url}`, `!${folderPath}` ]);
};

const upload = util.promisify(multer({ storage, fileFilter: imageFilter, limits: {fileSize: MAX_SIZE} })
                                                                                  .single('photo'));
const service = new UploadService();

export class UploadController {
  public static async uploadPhoto(req: any, res: Response, next: NextFunction) {
    const { uid, role } = res.locals.user;
    const isAdmin = role === 'ADMIN' ? true : false;
    let imageUrl = '';
    let category = '';
    let id = 0;
    let success = null;
    let delPreFlight = null;

    try {
      await upload(req, res);
      imageUrl = `${HOST}/static/${req.file.filename}`;
      delPreFlight = imageUrl.substring(TRIM_LENGTH);
      category = req.body.category;
      if (category === 'users') {
        id = uid;
      } else {
        id = req.body.id;
      }
    } catch (e) {
      return res.status(400).send(new BadRequest('Image upload operation is not successful!'));
    }

    if (category !== 'users' && !isAdmin) {
      clean(UPLOAD_PATH, delPreFlight);
      return res.status(403).send(new Forbidden('Only admins can upload photo for tv shows, movies, cast!'));
    }

    try {
      success = await service.findById(id, category);
    } catch (e) {
      clean(UPLOAD_PATH, delPreFlight);
      return res.status(400).send(new BadRequest());
    }

    try {
      let photo: any = null;
      if (!success) {
        photo = await service.upload(id, category, imageUrl);
      } else {
        const delUrl = success.substring(TRIM_LENGTH);
        photo = await service.update(id, category, imageUrl);
        clean(UPLOAD_PATH, delUrl);
      }
      if (photo) {
        return res.status(200).send({ photo });
      } else {
        clean(UPLOAD_PATH, delPreFlight);
        return res.status(400).send(new BadRequest('You are trying to upload photo for unknown entity.'));
      }
    } catch (e) {
      clean(UPLOAD_PATH, delPreFlight);
      return res.status(400).send(new BadRequest());
    }
  }

  public static async removePhoto(req: any, res: Response, next: NextFunction) {
    const { uid, role } = res.locals.user;
    const { category } = req.body;
    const isAdmin = role === 'ADMIN' ? true : false;
    let id = req.body.id;

    if (category === 'users') {
      id = uid;
    } else if (!isAdmin) {
      return res.status(401).send(new Unauthorized());
    }

    try {
      const success = await service.delete(id, category);
      if (success) {
        const delUrl = success.substring(TRIM_LENGTH);
        clean(UPLOAD_PATH, delUrl);
        return res.sendStatus(200);
      } else {
        return res.status(400).send(new BadRequest());
      }
    } catch (e) {
      return res.status(400).send(new BadRequest('Image delete operation is not successful!'));
    }
  }

  public static async retrievePhoto(req: any, res: Response, next: NextFunction) {
    const { id, category } = req.params;

    try {
      const photo = await service.findById(id, category);
      if (photo) {
        return res.status(200).send({ photo });
      } else {
        return res.status(400).send(new BadRequest());
      }
    } catch (e) {
      return res.status(400).send(new BadRequest('Image retrieve operation is not successful!'));
    }
  }
}
