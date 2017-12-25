import { Request, Response } from 'express';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { UnprocessableEntity } from '../errors/UnprocessableEntity';
import { Comment } from '../models/comment';
import { Show } from '../models/show';
import { ShowComment } from '../models/showcomment';
import { ShowService } from '../services/showservice';
import { EpisodeService } from '../services/episodeservice';
import { SeasonService } from '../services/seasonservice';


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
    const { user_id } = req.body;
    const episodeService = new EpisodeService();
    const seasonService = new SeasonService();
    const r = await showService.find(show, user_id);
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
    const params = req.body;
    delete params['user_id'];
    const r: boolean = await showService.updateShow(show, params);
    if (r) {
      return res.status(204).send();
    }
    return res.status(422).send(new UnprocessableEntity());  
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
    if(!show) {
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
    const { comment_body, user_id } = req.body;
    if (!comment_body) {
      return res.status(400).send(new BadRequest());
    }
    let c: Comment = new Comment(null, comment_body, user_id, null);
    const r: number = await showService.createShowComment(show, c);
    if(r) {
      const comment: Comment = await showService.findShowComment(show, r);
      if (comment) {
        return res.status(200).send(comment);
      }
      return res.status(404).send(new NotFound());
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async markAsWatched(req: Request, res: Response) {
    const { user_id } = req.body;
    const { show } = req.query;  
    const r: number = await showService.markAsWatched(show, user_id);
    if (r) {
      return res.status(201).send({ id: r });
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async unmarkWatch(req: Request, res: Response) {
    const { user_id } = req.body;
    const { show } = req.query;  
    const r: Boolean = await showService.unmarkWatch(show, user_id);
    if (r) {
      return res.status(204).send();
    }
    return res.status(404).send(new NotFound());
  }

  public async rate(req: Request, res: Response) {
    const { user_id, rating } = req.body;
    const { show } = req.query;
    if(!rating || rating < 1 || rating > 5) {
      return res.status(422).send(new BadRequest());
    }

    const r: Boolean = await showService.rateShow(user_id, show, rating);
    if (r) {
      const r: number = await showService.findOverallRate(show);
      return res.status(200).send({ overall_rate: r });
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async changeRate(req: Request, res: Response) {
    const { user_id, rating } = req.body;
    const { show } = req.query;
    const r: Boolean = await showService.updateRate(user_id, show, rating);
    if (r) {
      const r: number = await showService.findOverallRate(show);
      return res.status(200).send({ overall_rate: r });
    }
    return res.status(422).send(new UnprocessableEntity());  
  }
  
}