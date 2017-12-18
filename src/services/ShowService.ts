import { Comment } from '../models/comment';
import { Show } from '../models/show';
import { ShowComment } from '../models/showcomment';
import { CommentService } from './commentservice';
import { Service } from './service';
import { WatchService } from './watchservice';
export class ShowService extends Service {
  public async findById(id: number): Promise<Show> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM tvshow WHERE id = $1';
    try {
      const res = await client.query(sql, [id]);
      return res.rows[0];
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async create(show: Show): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'INSERT into tvshow (show_name, info, trailer_url, image_url) VALUES($1, $2, $3, $4) RETURNING id';
    try {
      const res = await client.query(sql, [show.show_name, show.info, show.trailer_url, show.image_url]);
      return res.rows[0].id;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async delete(sid: number): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'DELETE FROM tvshow WHERE id = $1 RETURNING id';
    try {
      const res = await client.query(sql, [sid]);
      return res.rows[0].id;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findAll(): Promise<Show[]> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM tvshow';
    try {
      const shows = await client.query(sql);
      return shows.rows;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async createShowComment(sid: number, comment: Comment): Promise<number> {
    const ser: Service = new CommentService();
    const cid: number = await ser.create(comment);
    const client = await this.pool.connect();
    const sql = 'INSERT into show_comment (show_id, comment_id) VALUES($1, $2) RETURNING id';
    try {
      const res = await client.query(sql, [sid, cid]);
      return res.rows[0].id;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findShowComments(sid: number): Promise<Comment[]> {
    const client = await this.pool.connect();
    const sql =
      'SELECT * FROM show_comment INNER JOIN comment' +
      'ON show_comment.comment_id = comment.id WHERE show_id = $1';
    try {
      const res = await client.query(sql, [sid]);
      return res.rows;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findShowComment(sid: number, cid: number): Promise<Comment> {
    const client = await this.pool.connect();
    const sql =
      'SELECT * FROM show_comment INNER JOIN comment' +
      'ON show_comment.comment_id = comment.id WHERE show_id = $1 AND comment_id = $2';
    try {
      const res = await client.query(sql, [sid, cid]);
      return res.rows[0];
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }
  public async markAsWatched(sid: number, uid: number) {
    const ser: Service = new WatchService();
    const wid = await ser.create(uid);

    const client = await this.pool.connect();
    const sql = 'INSERT INTO show_watch(watch_id, show_id) VALUES($1, $2) RETURNİNG id';

    try {
      const res = await client.query(sql, [wid, sid]);
      return res.rows[0].id;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
  }

  public async unmarkWatch(sid: number, uid: number) {

    const client = await this.pool.connect();
    const sql = 'DELETE FROM show_watch WHERE show_id = $1 AND user_id = $2 RETURNİNG id';

    try {
      const res = await client.query(sql, [sid, uid]);
      return res.rows[0].id;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
  }
}
