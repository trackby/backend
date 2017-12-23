import { Request, Response } from 'express';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { UnprocessableEntity } from '../errors/UnprocessableEntity';
import { Comment } from '../models/comment';
import { Show } from '../models/show';
import { ShowComment } from '../models/showcomment';
import { ShowService } from '../services/showservice';

const showService = new ShowService();


export class ShowController {
  public static async readShows(req: Request, res: Response) {
    const r: Show[] = await showService.findAll();
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public static async readShow(req: Request, res: Response) {
    const { showid } = req.params;
    const r: Show = await showService.findById(showid);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public static async updateShow(req: Request, res: Response) {
    const { showid } = req.params;
    const fields = req.body;
    let args = [];
    for (let field in fields) {
      args.push({ field: field, val: fields[field]});
    }
    if (!fields.length) {
      return res.status(400).send(new BadRequest());
    }
    const r: boolean = await showService.updateShow(showid, ...args);
    if (r) {
      return res.status(204);
    }
    return res.status(422).send(new UnprocessableEntity());  
  }

  public static async readShowComment(req: Request, res: Response) {
    const { showid, commentid } = req.params;
    const r: Comment = await showService.findShowComment(showid, commentid);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public static async readShowComments(req: Request, res: Response) {
    const { showid } = req.params;
    const r: Comment[] = await showService.findShowComments(showid);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public static async createShow(req: Request, res: Response) {
    const { image_url, info, show_name, trailer_url, director_name, writer_name } = req.body;
    if (!image_url || !info || !show_name || !trailer_url || !director_name || !writer_name ) {      
      return res.status(400).send(new BadRequest());
    }

    const show: Show = new Show(null, show_name, info, trailer_url, image_url, director_name, writer_name);
    const id: number = await showService.create(show);
    if (id) {
      return res.status(201).send({ showid: id });
    }
    return res.status(422).send(new UnprocessableEntity());
  }
  public static async deleteShow(req: Request, res: Response) {
    const { showid } = req.params;
    const r: number = await showService.delete(showid);
    if (r) {
      return res.status(200).send({ showid }); // shorthand to showid: showid
    }
    return res.status(404).send(new NotFound());
  }

  public static async createShowComment(req: Request, res: Response) {
    const { showid } = req.params;
    const { comment_body, user_id } = req.body;
    if (!comment_body || !user_id) {
      return res.status(400).send(new BadRequest());
    }
    const comment: Comment = new Comment(null, comment_body, user_id, null);
    const r: number = await showService.createShowComment(showid, comment);
    if (r) {
      comment.id = r;
      return res.status(200).send(comment); // shorthand to showid: showid
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public static async markAsWatched(req: Request, res: Response) {
    const { user_id } = req.body;
    const { showid } = req.params;  
    const r: number = await showService.markAsWatched(showid, user_id);
    if (r) {
      return res.status(201).send({ id: r });
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public static async unmarkWatch(req: Request, res: Response) {
    const { user_id } = req.body;
    const { showid } = req.params;  
    const r: number = await showService.unmarkWatch(showid, user_id);
    if (r) {
      return res.status(200).send({ id: r });
    }
    return res.status(404).send(new NotFound());
  }

  public static async rateShow(req: Request, res: Response) {
    const { user_id, rating } = req.body;
    const { showid } = req.params;
    const r: Boolean = await showService.rateShow(user_id, showid, rating);
    if (r) {
      return res.status(204);
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public static async changeRate(req: Request, res: Response) {
    const { user_id, rating } = req.body;
    const { showid } = req.params;
    const r: Boolean = await showService.updateRate(user_id, showid, rating);
    if (r) {
      return res.status(204);
    }
    return res.status(422).send(new UnprocessableEntity());  
  }
  
}
