import { Request, Response } from 'express';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { Comment } from '../models/comment';
import { Show } from '../models/show';
import { ShowComment } from '../models/showcomment';
import { ShowService } from '../services/showservice';

const showService = new ShowService();

export class ShowController {

    public static async readShows(req: Request, res: Response) {
        const r: Show[] = await showService.findAll();
        if (r) {
            res.status(200).send(r);
        }
        res.status(404).send(new NotFound());
    }

    public static async readShow(req: Request, res: Response) {
        const { showid } = req.params;
        const r: Show = await showService.findById(showid);
        if (r) {
            return res.status(200).send(r);
        }
        return res.status(404).send(new NotFound());
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
            res.status(200).send(r);
        }
        res.status(404).send(new NotFound());
    }

    public static async createShow(req: Request, res: Response) {
        const { image_url, info, show_name, trailer_url } = req.body;
        const show: Show = new Show(null, show_name, info, trailer_url, image_url);
        const id: number = await showService.create(show);
        if (id) {
            return res.status(201).send({
                showid: id,
            });
        }
        return res.status(400).send(new BadRequest());
    }
    public static async deleteShow(req: Request, res: Response) {
        const { showid } = req.params;
        const r: number = await showService.delete(showid);
        if (r) {
            return res.status(200).send({showid}); // shorthand to showid: showid
        }
        return res.status(400).send(new BadRequest());
    }
}
