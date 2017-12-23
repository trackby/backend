import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { ResourceExists } from '../errors/ResourceExists';
import { ServerError } from '../errors/ServerError';
import { Unauthorized } from '../errors/Unauthorized';
import { UnprocessableEntity } from '../errors/UnprocessableEntity';
import { Friendship } from '../models/Friendship';
import { User } from '../models/user';
import { FriendshipService } from '../services/FriendshipService';
import { SearchService } from '../services/SearchService';
import { UserService } from '../services/UserService';

const service = new SearchService();

export class SearchController {
  public static async search(req: Request, res: Response) {
    const { value } = req.body;
    let queryResults: any = false;

    if (!value) {
      return res.status(400).send(new BadRequest('Required body parameters cannot be empty.'));
    }
    try {
      queryResults = await service.search(value);
      if (Object.keys(queryResults).length !== 0) {
        return res.status(200).send({ queryResults });
      } else {
        const str = await service.didYouMean(value);
        const recommended = str.charAt(0).toUpperCase() + str.substring(1);
        // It may return empty value. This means that there are none recommended keywords for search.
        return res.status(200).send({ recommended });
      }
    } catch (e) {
      return res.status(400).send(new BadRequest());
    }
  }
}
