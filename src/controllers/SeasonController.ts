import { Request, Response } from 'express';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { UnprocessableEntity } from '../errors/UnprocessableEntity';
import { Comment } from '../models/comment';
import { Season } from '../models/season';
import { ShowComment } from '../models/showcomment';
import { SeasonService } from '../services/SeasonService';
import { EpisodeService } from '../services/EpisodeService';


const seasonService = new SeasonService();

export class SeasonController {

  public async readOne(req: Request, res: Response) {
    const { show,  season } = req.query;
    const episodeService = new EpisodeService();
    const r: Season = await seasonService.find(show, season);
    if (r) {
      r.watched = await seasonService.checkIfWatched(show, season);  
      r.episodes = await episodeService.findEpisodesByNo(show, season);
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public async update(req: Request, res: Response) {
    const { season, show } = req.query;    
    const fields = req.body;
    let args = [];
    for (let field in fields) {
      args.push({ field: field, val: fields[field]});
    }
    if (!fields.length) {
      return res.status(400).send(new BadRequest());
    }
    const r: boolean = await seasonService.updateSeason(show, season, ...args);
    if (r) {
      return res.status(204).send();
    }
    return res.status(422).send(new UnprocessableEntity());  
  }

  public async readComment(req: Request, res: Response) {
    const { season, show } = req.query;        
    const { commentid } = req.params;
    const r: Comment = await seasonService.findSeasonComment(season, season, commentid);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public async readComments(req: Request, res: Response) {
    const { season, show } = req.query;            
    const r: Comment[] = await seasonService.findSeasonComments(show, season);
    if (r) {
      return res.status(200).send(r);
    }
    return res.status(404).send(new NotFound());
  }

  public async create(req: Request, res: Response) {
    const { show, season } = req.query;
    const { info, image_url, trailer_url, season_year } = req.body;
    if (!image_url || !info || !trailer_url || !season_year ) {      
      return res.status(400).send(new BadRequest());
    }
    const s: Season = new Season(season, info, trailer_url, image_url, season_year, show)
    const id: number = await seasonService.create(s);
    if (id) {
      return res.status(201).send({ seasonid: id });
    }
    return res.status(422).send(new UnprocessableEntity());
  }
  public async delete(req: Request, res: Response) {
    const { season, show } = req.query;
    const r: number = await seasonService.deleteSeason(show, season);
    if (r) {
      return res.status(200).send({ show_id : r, season: season });
    }
    return res.status(404).send(new NotFound());
  }

  public async createComment(req: Request, res: Response) {
    const { show, season } = req.query;
    const { comment_body, user_id } = req.body;
    if (!comment_body || !show || !season) {
      return res.status(400).send(new BadRequest());
    }
    let c: Comment = new Comment(null, comment_body, user_id, null);
    const r: number = await seasonService.createSeasonComment(show, season, c);
    if(r) {
      const comment: Comment = await seasonService.findSeasonComment(show, season, r);
      if (comment) {
        return res.status(200).send(comment);
      }
      return res.status(404).send(new NotFound());
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async markAsWatched(req: Request, res: Response) {
    const { user_id } = req.body;
    const { season, show } = req.query;
    const r: number = await seasonService.markAsWatched(show, season, user_id);
    if (r) {
      return res.status(201).send({ id: r });
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async unmarkWatch(req: Request, res: Response) {
    const { user_id } = req.body;
    const { season, show } = req.query;
    const r: Boolean = await seasonService.unmarkWatch(show, season, user_id);
    if (r) {
      return res.status(204);
    }
    return res.status(404).send(new NotFound());
  }

  public async rate(req: Request, res: Response) {
    const { user_id, rating } = req.body;
    const { season, show } = req.query;
    if(!rating || rating < 1 || rating > 5) {
      return res.status(422).send(new BadRequest());
    }

    const r: Boolean = await seasonService.rateSeason(user_id, show, season, rating);
    if (r) {
      const r: number = await seasonService.findOverallRate(show, season);
      return res.status(200).send({ overall_rate: r });
    }
    return res.status(422).send(new UnprocessableEntity());
  }

  public async changeRate(req: Request, res: Response) {
    const { user_id, rating } = req.body;
    const { season, show } = req.query;
    const r: Boolean = await seasonService.updateRate(user_id, show, season, rating);
    if (r) {
      const r: number = await seasonService.findOverallRate(show, season);
      return res.status(200).send({ overall_rate: r });
    }
    return res.status(422).send(new UnprocessableEntity());  
  }
  
}