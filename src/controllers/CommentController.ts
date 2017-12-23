import { Request, Response } from 'express';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { Comment } from '../models/comment';
import { CommentService } from '../services/commentservice';
import { UnprocessableEntity } from '../errors/UnprocessableEntity';
import { Reaction } from '../models/reaction';



const commentService = new CommentService();

export class CommentController {

  // For user feed
  public static async readUserComments(req: Request, res: Response) {
    const uid = 1;
    const r = await commentService.findUserComments(uid);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

    // For user feed
  public static async readComment(req: Request, res: Response) {
    const { commentid } = req.params;
    const uid = 1;
    const r: Comment = await commentService.findById(commentid);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public static async readSubcomments(req: Request, res: Response) {
    const { commentid } = req.params;
    const r: Comment[] = await commentService.findSubcomments(commentid);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public static async createSubcomment(req: Request, res: Response) {
    const { commentid } = req.params;
    const { comment_body, user_id } = req.body;

    if (!comment_body || !user_id) {
      return res.status(400).send(new BadRequest());
    }

    const comment: Comment = new Comment(null, comment_body, user_id, commentid);    
    const r: number = await commentService.create(comment);
    if (r) {
      return res.status(201).send({ id: r }); // shorthand to showid: showid
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public static async deleteComment(req: Request, res: Response) {
    const { commentid } = req.params;
    const r: number = await commentService.delete(commentid);
    if (r) {
      return res.status(200).send({ id: r });
    }
    return res.status(404).send(new NotFound());
  }

  public static async readCommentReactions(req: Request, res: Response) {
    const { commentid } = req.params;
    const r: Reaction[] = await commentService.readCommentReactions(commentid);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public static async createCommentReaction(req: Request, res: Response) {
    const { commentid } = req.params;
    const { reaction_type, user_id } = req.body;
    if (!reaction_type || !user_id) {
      return res.status(400).send(new BadRequest());
    }
    const reaction: Reaction = new Reaction(null, reaction_type, user_id);
    const r: number = await commentService.createCommentReaction(commentid, reaction);
    if (r) {
      return res.status(201).send({ id: r }); // shorthand to showid: showid
    }
    return res.status(422).send(new UnprocessableEntity());
  }

}
