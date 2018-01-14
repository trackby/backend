import { Request, Response } from 'express';
import * as _ from 'lodash';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { UnprocessableEntity } from '../errors/UnprocessableEntity';
import { Comment } from '../models/comment';
import { Show } from '../models/show';
import { ShowComment } from '../models/showcomment';
import { EpisodeService } from '../services/episodeservice';
import { SeasonService } from '../services/seasonservice';
import { ShowService } from '../services/showservice';

const showService = new ShowService();

export class ShowController {
  public async readAll(req: Request, res: Response) {
    const r: Show[] = await showService.findAll();
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public async readOne(req: Request, res: Response) {
    const { show } = req.query;
    const { uid } = res.locals.user;
    const episodeService = new EpisodeService();
    const seasonService = new SeasonService();
    const r = await showService.find(show, uid);
    if (r) {
      r.watched = await showService.checkIfWatched(show);
      r.seasons = await seasonService.findAllSeasons(show);
      r.episodes = await episodeService.findAllShowEpisodes(show);
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public async update(req: Request, res: Response) {
    const { show } = req.query;
    const { isAdmin } = req.body;
    const params =  _.omit(req.body, ['isAdmin', 'user_id']);
    if (isAdmin) {
      const r: boolean = await showService.updateShow(show, params);
      if (r) {
        return res.status(204).send();
      }
      return res.status(422).send(new UnprocessableEntity());
    }
  }

  public async readComment(req: Request, res: Response) {
    const { show } = req.query;
    const { commentid } = req.params;
    const r: Comment = await showService.findShowComment(show, commentid);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public async readComments(req: Request, res: Response) {
    const { show } = req.query;
    if (!show) {
      return res.status(400).send(new BadRequest());
    }
    const r: Comment[] = await showService.findShowComments(show);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public async create(req: Request, res: Response) {
    const { show } = req.query;
    const { image_url, info, trailer_url, director_name, writer_name } = req.body;
    if (!image_url || !info || !show || !trailer_url || !director_name || !writer_name ) {
      return res.status(400).send(new BadRequest());
    }
    const s: Show = new Show(null, show, info, trailer_url, image_url, director_name, writer_name);
    const sname: string = await showService.create(s);
    if (sname) {
      return res.status(201).send({ showname: sname });
    }
    return res.status(422).send(new UnprocessableEntity());
  }
  public async delete(req: Request, res: Response) {
    const { show } = req.query;
    const r = await showService.deleteShow(show);
    if (r) {
      return res.status(200).send({ show }); // shorthand to showid: showid
    }
    return res.status(404).send(new NotFound());
  }

  public async createComment(req: Request, res: Response) {
    const { show } = req.query;
    const { uid } = res.locals.user;
    const { comment_body } = req.body;
    if (!comment_body) {
      return res.status(400).send(new BadRequest());
    }
    const comment: Comment = new Comment(null, comment_body, uid, null);
    const r: number = await showService.createShowComment(show, comment);
    if (r) {
      return res.status(200).send(comment);
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async markAsWatched(req: Request, res: Response) {
    const { uid } = res.locals.user;
    const { show } = req.query;
    const r: number = await showService.markAsWatched(show, uid);
    if (r) {
      return res.status(201).send({ id: r });
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async unmarkWatch(req: Request, res: Response) {
    const { uid } = res.locals.user;
    const { show } = req.query;
    const r: boolean = await showService.unmarkWatch(show, uid);
    if (r) {
      return res.status(204).send();
    }
    return res.status(404).send(new NotFound());
  }

  public async rate(req: Request, res: Response) {
    const { rating } = req.body;
    const { uid } = res.locals.user;
    const { show } = req.query;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(422).send(new BadRequest());
    }

    const success: boolean = await showService.rateShow(uid, show, rating);
    if (success) {
      const r: number = await showService.findOverallRate(show);
      return res.status(200).send({ overall_rate: r });
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async changeRate(req: Request, res: Response) {
    const { rating } = req.body;
    const { uid } = res.locals.user;
    const { show } = req.query;
    const success: boolean = await showService.updateRate(uid, show, rating);
    if (success) {
      const r: number = await showService.findOverallRate(show);
      return res.status(200).send({ overall_rate: r });
    }
    return res.status(422).send(new UnprocessableEntity());
  }

}
