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
import { UserService } from '../services/UserService';

const service = new FriendshipService();

export class FriendshipController {
  public static async sendFriendshipRequest(req: Request, res: Response) {
    const { target_user_id } = req.body;
    const { uid } = res.locals.user;
    let success: any = false;

    if (!uid || !target_user_id) {
      return res.status(400).send(new BadRequest('Required body parameters cannot be empty.'));
    }
    /*  if (![user_id, target_user_id].includes(action_id)) {
      return res.status(400).send(new BadRequest('action_uid must be defined as one of the two other user ids.'));
    } */
    try {
      const friendship = new Friendship(uid, target_user_id, undefined, uid);
      success = await service.save(friendship);
    } catch (e) {
      return res.status(400).send(new BadRequest());
    }
    if (success) {
      return res.status(200).send({ success });
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
      return res.status(200).send({ friendship });
    } catch (e) {
      return res.status(400).send(new BadRequest());
    }
  }

  public static async updateFriendshipStatus(req: Request, res: Response) {
    const { target_user_id, status } = req.body;
    const { uid } = res.locals.user;
    let check: any = false;

    if (!uid || !target_user_id || !status) {
      return res.status(400).send(new BadRequest('Required body parameters cannot be empty.'));
    }
    try {
      check = await service.showFriendshipRelation(uid, target_user_id);
    } catch (e) {
      return res.status(400).send(new BadRequest());
    }
    if (check) {
      const { action_user_id } = check;
      if (action_user_id === uid) {
        return res.status(400).send(new BadRequest('You cannot modify your own friendship request.'));
      }
    } else {
      return res.status(422).send(new UnprocessableEntity());
    }

    try {
      const friendship = new Friendship(uid, target_user_id, status, undefined);
      const success = await service.update(friendship);
      if (success) {
        return res.status(200).send({ success });
      }
    } catch (e) {
      return res.status(400).send(new BadRequest(e.stack));
    }
    return res.status(409).send(new ResourceExists());
  }

  public static async showFriends(req: Request, res: Response) {
    const { username } = req.params;

    if (!username) {
      return res.status(400).send(new BadRequest('Required url parameters cannot be empty.'));
    }
    try {
      const success = await service.findAllFriends(username);
      if (success) {
        return res.status(200).send(success);
      }
    } catch (e) {
      return res.status(400).send(new BadRequest());
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public static async showFriendshipRequests(req: Request, res: Response) {
    const { uid } = res.locals.user;
    const { direction } = req.params;

    if (!uid) {
      return res.status(400).send(new BadRequest('Required body parameters cannot be empty.'));
    }
    try {
      const success = await service.showFriendshipRequests(uid, direction);
      if (success) {
        return res.status(200).send(success);
      }
    } catch (e) {
      return res.status(400).send(new BadRequest());
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public static async removeFriend(req: Request, res: Response) {
    const { target_user_id } = req.body;
    const { uid } = res.locals.user;

    if (!uid || !target_user_id) {
      return res.status(400).send(new BadRequest('Required body parameters cannot be empty.'));
    }
    try {
      const friendship = new Friendship(uid, target_user_id, undefined, undefined);
      const success = await service.delete(0, friendship);
      if (success) {
        return res.status(200).send(success);
      }
    } catch (e) {
      return res.status(400).send(new BadRequest());
    }
    return res.status(422).send(new UnprocessableEntity());
  }
}
