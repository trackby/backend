import { NextFunction, Request, Response } from 'express';
import { EpisodeController } from '../controllers/EpisodeController';
import { SeasonController } from '../controllers/SeasonController';
import { ShowController } from '../controllers/ShowController';
import { NotFound } from '../errors/NotFound';
import { RateService } from '../services/RateService';
import { ShowService } from '../services/ShowService';

export class Controller {
  public static sayHello(req: Request, res: Response) {
    res.send('Hello World!');
  }

  public static handleAll(req: Request, res: Response, next: NextFunction) {

    const { show, season, episode } = req.query;
    if (show && season && episode) {
      res.locals.ctrl = new EpisodeController();
    } else if (show && season) {
      res.locals.ctrl = new SeasonController();
    } else {
      res.locals.ctrl = new ShowController();
    }
    return next();
  }

  public static async create(req: Request, res: Response) {
    return res.locals.ctrl.create(req, res);
  }

  public static async delete(req: Request, res: Response) {
    return res.locals.ctrl.delete(req, res);
  }

  public static async read(req: Request, res: Response) {
    return res.locals.ctrl.readOne(req, res);
  }

  public static async update(req: Request, res: Response) {
    return res.locals.ctrl.update(req, res);
  }

  public static async readComments(req: Request, res: Response) {
    return res.locals.ctrl.readComments(req, res);
  }

  public static async readComment(req: Request, res: Response) {
    return res.locals.ctrl.readComment(req, res);
  }

  public static async createComment(req: Request, res: Response) {
    return res.locals.ctrl.createComment(req, res);
  }

  public static async markAsWatched(req: Request, res: Response) {
    return res.locals.ctrl.markAsWatched(req, res);
  }

  public static async unmarkWatch(req: Request, res: Response) {
    return res.locals.ctrl.unmarkWatch(req, res);
  }

  public static async rate(req: Request, res: Response) {
    return res.locals.ctrl.rate(req, res);
  }

  public static async changeRate(req: Request, res: Response) {
    return res.locals.ctrl.changeRate(req, res);
  }

  public static async findReports(req: Request, res: Response) {
    const showService = new ShowService();
    const rateService = new RateService();
    const r = await showService.findReport();
    const h = await rateService.getHighestRates();
    return res.status(200).send({report1: r, report2: h});
  }

}
