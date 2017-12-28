import { Request, Response } from 'express';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { UnprocessableEntity } from '../errors/UnprocessableEntity';
import { Comment } from '../models/comment';
import { Reaction } from '../models/reaction';
import { ReactionService } from '../services/reactionservice';

const reactionService = new ReactionService();
export class ReactionController {
  public static async readUserReactions(req: Request, res: Response) {
    const { user_id } = req.body;
    const r = await reactionService.findUserReactions(user_id);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public static async deleteReaction(req: Request, res: Response) {
    const { reactionid } = req.params;
    const r: number = await reactionService.delete(reactionid);
    if (r) {
      return res.status(200).send({ id: r});
    }
    return res.status(404).send(new NotFound());
  }

}
