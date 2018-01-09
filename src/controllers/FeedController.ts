
import { NextFunction, Request, Response } from 'express';
import { NotFound } from '../errors/NotFound';
import { FeedService } from '../services/FeedService';
import { ServerError } from '../errors/ServerError';

const feedService = new FeedService();

export class FeedController {
  public static async readFeed(req: Request, res: Response): Promise<any> {
    const { user_id } = req.body;
    let r = [];

    try {
      const showComments = await feedService.findShowComments(user_id);
      const subComments = await feedService.findSubcomments(user_id);
      const seasonComments = await feedService.findSeasonComments(user_id);
      const episodeComments = await feedService.findEpisodeComments(user_id);
      const showRates = await feedService.findShowRates(user_id);
      const episodeRates = await feedService.findEpisodeRates(user_id);
      const seasonRates = await feedService.findShowRates(user_id);
      const episodeWatches = await feedService.findEpisodeWatches(user_id);
      const seasonWatches = await feedService.findSeasonWatches(user_id);
      const showWatches = await feedService.findShowWatches(user_id);      
      r =  r.concat(showComments, subComments, seasonComments, episodeComments, showRates, 
                    episodeRates, seasonRates, episodeWatches, seasonWatches, showWatches);    
                    
      return res.status(200).send(r.sort((a, b) => a.created_at - b.created_at));        
    } catch(e) {
      return res.status(500).send(new ServerError());      
    }
  }
}
