
import { Request, Response, NextFunction } from 'express';
import { NotFound } from '../errors/NotFound';
import { FeedService } from '../services/FeedService';

const feedService = new FeedService();

export class FeedController {
  public static async readFeed(req: Request, res: Response): Promise<any> {
    const { user_id } = req.body;
    let r = []
    const show_comments = await feedService.findShowComments(user_id);    
    const subcomments = await feedService.findSubcomments(user_id);
    const season_comments = await feedService.findSeasonComments(user_id);
    const episode_comments = await feedService.findEpisodeComments(user_id);
    const show_rates = await feedService.findShowRates(user_id);
    const episode_rates = await feedService.findEpisodeRates(user_id);
    const season_rates = await feedService.findShowRates(user_id);
    const episode_watches = await feedService.findEpisodeWatches(user_id);
    const season_watches = await feedService.findSeasonWatches(user_id);
    const show_watches = await feedService.findShowWatches(user_id);
    r =  r.concat(show_comments, subcomments, 
                  season_comments, episode_comments, 
                  show_rates, episode_rates, 
                  season_rates, episode_watches, 
                  season_watches, show_watches);
    
    return res.status(200).send(r.sort((a, b) => a.created_at - b.created_at)); 
  }
}



