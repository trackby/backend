import { Comment } from '../models/comment';
import { Show } from '../models/show';
import { ShowComment } from '../models/showcomment';
import { CommentService } from './commentservice';
import { Service } from './service';
import { WatchService } from './watchservice';
import { RateService } from './rateservice';

export class ShowService extends Service {
  public async findById(id: number): Promise<Show> {
    const client = await this.pool.connect();
    const sql = 'SELECT id, info, show_name, director_name, writer_name, image_url, trailer_url, season_count, overall_rating, rating, created_at '
                +'FROM tvshow NATURAL JOIN show_rate NATURAL JOIN rate';
    try {
      const res = await client.query(sql);
      return res.rows[0];
    } catch (e) {
      console.log(e)
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async create(show: Show): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'INSERT INTO tvshow(show_name, info, trailer_url, image_url, director_name, writer_name) ' +
                'VALUES($1, $2, $3, $4, $5, $6) RETURNING id';
    try {
      const res = await client.query(sql, [show.show_name, show.info, show.trailer_url, show.image_url, show.director_name, show.writer_name]);
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
      console.log(e);
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findUserShowComments(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT tvshow.show_name, comment.comment_body, comment.created_at FROM show_comment ' +
                'INNER JOIN tvshow ON show_comment.show_id = tvshow.id ' +
                'INNER JOIN comment ON show_comment.comment_id = comment.id WHERE comment.user_id IN '+
                '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1)'
                'ORDER BY comment.created_at DESC';

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
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
    const sql = 'INSERT INTO show_comment (show_id, comment_id) VALUES($1, $2) RETURNING comment_id';
    try {
      const res = await client.query(sql, [sid, cid]);
      return res.rows[0].comment_id;
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
      'SELECT comment_id, users.image_url, comment_body, users.id, users.username, subcomment_count, created_at FROM show_comment ' +
      'INNER JOIN comment ON show_comment.comment_id = comment.id ' +
      'INNER JOIN users ON comment.user_id = users.id WHERE show_id = $1';

    try {
      const res = await client.query(sql, [sid]);
      return res.rows;
    } catch (e) {
      console.log(e)
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async updateShow(sid: number, ...args: any[] ): Promise<any> {
    const client = await this.pool.connect();
    let sql = 'UPDATE tvshow SET ';
    args.forEach((arg, index) => {
      sql += arg.field + ' = ' + arg.val;
      if (index !== args.length - 1)  sql += ','; 
    });
    sql += ' WHERE id = $1';
    try {
      const res = client.query(sql, [sid]);
      return res;
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
    'SELECT comment_id, users.image_url, comment_body, users.id, users.username, subcomment_count, created_at FROM show_comment ' +
    'INNER JOIN comment ON show_comment.comment_id = comment.id ' +
    'INNER JOIN users ON comment.user_id = users.id WHERE show_id = $1 AND comment_id = $2';
 
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
    const ser: WatchService = new WatchService();
    const wid = await ser.create(uid);
    const client = await this.pool.connect();
    const sql = 'INSERT INTO show_watch(watch_id, show_id) VALUES($1, $2) RETURNING watch_id';

    try {
      const res = await client.query(sql, [wid, sid]);
      return res.rows[0].watch_id;
    } catch (e) {
      console.log(e);
      // console.log(e.stack)
    } finally {
      client.release();
    }
  }

  public async checkIfWatched(sid: number): Promise<Boolean> {
    const client = await this.pool.connect();
    const sql = 'SELECT * from show_watch WHERE show_id = $1';
    try {
      const res = await client.query(sql, [sid]);
      return (!res.rows.length) ? false: true;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return false;
  }

  public async unmarkWatch(sid: number, uid: number): Promise<Boolean> {
    const client = await this.pool.connect();    
    const sql = 'DELETE FROM watch WHERE id IN (SELECT watch_id FROM show_watch WHERE show_id = $1) AND user_id = $2';
    try {
      await client.query(sql, [sid, uid]);
      return true;
    } catch (e) {
      console.log(e);
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return false;
  }
  public async findUserShowWatches(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM show_watch ' +
                'INNER JOIN tvshow ON show_watch.show_id = tvshow.id ' +
                'INNER JOIN comment ON show_watch.watch_id = watch.id WHERE user_id = $1';

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async rateShow(uid: number, sid: number, rating): Promise<boolean> {
    const ser: RateService = new RateService();
    const rid = await ser.rate(uid, rating); 
    const client = await this.pool.connect();
    const sql = 'INSERT INTO show_rate(rate_id, show_id) VALUES($1, $2)'

    try {
      const res = await client.query(sql, [rid, sid]);
      return true;
    } catch (e) {
      console.log(e)
    } finally {
      client.release();
    }
    return false;
  }

  public async updateRate(uid: number, sid: number, rating): Promise<Boolean> {
    const ser: RateService = new RateService();
    return await ser.update(uid, sid, rating);
  }

  public async findOverallRate(sid: number): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'SELECT overall_rating FROM tvshow WHERE id = $1'
    try {
      const res = await client.query(sql, [sid]);
      return res.rows[0].overall_rating;
    } catch (e) {
      console.log(e)
    } finally {
      client.release();
    }
    return null;
  }

}



