import { Request, Response } from 'express';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { UnprocessableEntity } from '../errors/UnprocessableEntity';
import { Comment } from '../models/comment';
import { Episode } from '../models/episode';
import { ShowComment } from '../models/showcomment';
import { EpisodeService } from '../services/episodeservice';

const episodeService = new EpisodeService();

export class EpisodeController {
  public async readOne(req: Request, res: Response) {
    const { show, season, episode } = req.query;
    const r: Episode = await episodeService.find(show, season, episode);
    if (r) {
      r.watched = await episodeService.checkIfWatched(show, season, episode);      
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public async update(req: Request, res: Response) {
    const fields = req.body;
    const { show, season, episode } = req.query;    
    let args = [];
    for (let field in fields) {
      args.push({ field: field, val: fields[field]});
    }
    if (!fields.length) {
      return res.status(400).send(new BadRequest());
    }
    const r: boolean = await episodeService.updateEpisode(show, season, episode, ...args);
    if (r) {
      return res.status(204);
    }
    return res.status(422).send(new UnprocessableEntity());  
  }

  public async readComment(req: Request, res: Response) {
    const { commentid } = req.params;
    const { show, season, episode } = req.query;        
    const r: Comment = await episodeService.findEpisodeComment(show, season, episode, commentid);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public async readComments(req: Request, res: Response) {
    const { show, season, episode } = req.query;        
    const r: Comment[] = await episodeService.findEpisodeComments(show, season, episode);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public async create(req: Request, res: Response) {
    console.log('bravo');
    
    const { show, season, episode } = req.query;
    const { info, image_url, trailer_url, episode_name } = req.body;
    console.log('sasasa');
    if (!image_url || !info || !episode_name || !trailer_url) {      
      return res.status(400).send(new BadRequest());
    }
    const e: Episode = new Episode(episode, episode_name, info, trailer_url, image_url, episode_name, season, show);
    const id: number = await episodeService.create(e);
    if (id) {
      return res.status(201).send({ showid: id });
    }
    return res.status(422).send(new UnprocessableEntity());
  }
  public async delete(req: Request, res: Response) {
    const { show, season, episode } = req.query;    
    const r: number = await episodeService.deleteEpisode(show, season, episode);
    if (r) {
      return res.status(200).send({ show }); // shorthand to showid: showid
    }
    return res.status(404).send(new NotFound());
  }

  public async createComment(req: Request, res: Response) {
    const { show, season, episode } = req.query;        
    const { comment_body, user_id } = req.body;
    if (!comment_body) {
      return res.status(400).send(new BadRequest());
    }
    let c: Comment = new Comment(null, comment_body, user_id, null);
    const r: number = await episodeService.createEpisodeComment(show, season, episode, c);
    if(r) {
      const comment: Comment = await episodeService.findEpisodeComment(show, season, episode, r);
      if (comment) {
        return res.status(200).send(comment);
      }
      return res.status(404).send(new NotFound());
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async markAsWatched(req: Request, res: Response) {
    const { show, season, episode } = req.query;            
    const { user_id } = req.body;
    const r: number = await episodeService.markAsWatched(show, season, episode, user_id);
    if (r) {
      return res.status(201).send({ id: r });
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async unmarkWatch(req: Request, res: Response) {
    const { show, season, episode } = req.query;                
    const { user_id } = req.body;
    const r: Boolean = await episodeService.unmarkWatch(show, season, episode, user_id);
    if (r) {
      return res.status(204).send();
    }
    return res.status(404).send(new NotFound());
  }

  public async rate(req: Request, res: Response) {
    const { show, season, episode } = req.query;                    
    const { user_id, rating } = req.body;
    if(!rating || rating < 1 || rating > 5) {
      return res.status(422).send(new BadRequest());
    }
    const r: Boolean = await episodeService.rateEpisode(user_id, show, season, episode, rating);
    if (r) {
      const r: number = await episodeService.findOverallRate(show, season, episode);
      return res.status(200).send({ overall_rate: r });
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async changeRate(req: Request, res: Response) {
    const { show, season, episode } = req.query;                        
    const { user_id, rating } = req.body;
    const r: Boolean = await episodeService.updateRate(user_id, show, season, episode, rating);
    if (r) {
      const r: number = await episodeService.findOverallRate(show, season, episode);
      return res.status(200).send({ overall_rate: r });
    }
    return res.status(422).send(new UnprocessableEntity());  
  }
  
}