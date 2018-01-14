
import { NextFunction, Request, Response } from 'express';
import { NotFound } from '../errors/NotFound';
import { ServerError } from '../errors/ServerError';
import { FeedService } from '../services/FeedService';

const feedService = new FeedService();

export class FeedController {
  public static async readFeed(req: Request, res: Response): Promise<any> {
    const { uid } = res.locals.user;
    let r = [];

    try {
      const showComments = await feedService.findShowComments(uid);
      const subComments = await feedService.findSubcomments(uid);
      const seasonComments = await feedService.findSeasonComments(uid);
      const episodeComments = await feedService.findEpisodeComments(uid);
      const showRates = await feedService.findShowRates(uid);
      const episodeRates = await feedService.findEpisodeRates(uid);
      const seasonRates = await feedService.findShowRates(uid);
      const episodeWatches = await feedService.findEpisodeWatches(uid);
      const seasonWatches = await feedService.findSeasonWatches(uid);
      const showWatches = await feedService.findShowWatches(uid);
      r =  r.concat(showComments, subComments, seasonComments, episodeComments, showRates,
                    episodeRates, seasonRates, episodeWatches, seasonWatches, showWatches);

      return res.status(200).send(r.sort((a, b) => a.created_at - b.created_at));
    } catch (e) {
      return res.status(500).send(new ServerError());
    }
  }
}
