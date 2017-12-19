import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { ResourceExists } from '../errors/ResourceExists';
import { ServerError } from '../errors/ServerError';
import { Unauthorized } from '../errors/Unauthorized';
import { Friendship } from '../models/Friendship';
import { User } from '../models/user';
import { FriendshipService } from '../services/FriendshipService';

const service = new FriendshipService();

export class FriendshipController {
  public static async addFriendship(req: Request, res: Response) {
    const { first_user_id, second_user_id, status, action_id } = req.body;
    let success = false;

    if (!first_user_id || !second_user_id || !action_id ) {
      return res.status(400).send(new BadRequest('Required body parameters cannot be empty.'));
    }

    if (![first_user_id, second_user_id].includes(action_id)) {
      return res.status(400).send(new BadRequest('action_uid must be defined as one of the two other user ids.'));
    }
    try {
      const friendship = new Friendship(first_user_id, second_user_id, status, action_id);
      success = await service.save(friendship);
    } catch (e) {
        return res.status(400).send(new BadRequest());
    }
    if (success) {
      return res.status(200).send({success});
    } else {
      return res.status(409).send(new ResourceExists());
    }
  }

  public static async showFriendshipRelation(req: Request, res: Response) {
    const { first_user_id, second_user_id } = req.query;

    if (!first_user_id || !second_user_id) {
      return res.status(400).send(new BadRequest('Required body parameters cannot be empty.'));
    }
    try {
      const friendship: Friendship = await service.showFriendshipRelation(first_user_id, second_user_id);
      return res.status(200).send({friendship});
    } catch (e) {
        return res.status(400).send(new BadRequest());
    }
  }
}
