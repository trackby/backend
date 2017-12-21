import { Request, Response } from 'express';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { Comment } from '../models/comment';
import { CommentService } from '../services/commentservice';

const commentService = new CommentService();

export class CommentController {
  public static async readAllComments(req: Request, res: Response) {
    const r: Comment[] = await commentService.findAll();
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public static async readComment(req: Request, res: Response) {
    const { commentid } = req.params;
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

}
