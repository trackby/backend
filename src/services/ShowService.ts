import { Comment } from '../models/comment';
import { Show } from '../models/show';
import { ShowComment } from '../models/showcomment';
import { CommentService } from './commentservice';
import { RateService } from './rateservice';
import { Service } from './service';
import { WatchService } from './watchservice';

export class ShowService extends Service {

  public async find(sname: string): Promise<Show> {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM tvshow WHERE show_name = $1`;
    try {
      const res = await client.query(sql, [sname]);
      return res.rows[0];
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findUserRate(sname: string, uid: number): Promise<number> {
    const client = await this.pool.connect();
    const sql = `SELECT rating FROM rate INNER JOIN show_rate ON rate.id = show_rate.rate_id
            INNER JOIN tvshow ON tvshow.show_name = show_rate.show_name WHERE tvshow.show_name = $1 AND
            rate.user_id = $2`;
    try {
      const res = await client.query(sql, [sname, uid]);
      return (res.rows[0]) ? res.rows[0].rating : null;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async create(show: Show): Promise<string> {
    const client = await this.pool.connect();
    const sql = `INSERT INTO tvshow(show_name, info, trailer_url, image_url, director_name, writer_name)
                 VALUES($1, $2, $3, $4, $5, $6) RETURNING show_name`;
    try {
      const res = await client.query(sql,
        [show.show_name, show.info, show.trailer_url, show.image_url, show.director_name, show.writer_name]);
      return res.rows[0].show_name;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async deleteShow(sname: string): Promise<string> {
    const client = await this.pool.connect();
    const sql = 'DELETE FROM tvshow WHERE show_name = $1 RETURNING show_name';
    try {
      const res = await client.query(sql, [sname]);
      return res.rows[0].show_name;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findAll(): Promise<Show[]> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM tvshow';
    try {
      const shows = await client.query(sql);
      return shows.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async createShowComment(sname: string, comment: Comment): Promise<Comment> {
    const ser: Service = new CommentService();
    const cid: number = await ser.create(comment);
    const client = await this.pool.connect();

    try {
      let sql = 'INSERT INTO show_comment (show_name, comment_id) VALUES($1, $2) RETURNING show_name, comment_id';
      await client.query('BEGIN');
      const { rows } = await client.query(sql, [sname, cid]);
      sql = `SELECT * FROM show_comments WHERE show_name = $1 AND comment_id = $2 `;
      const res = await client.query(sql, [rows[0].show_name, rows[0].comment_id]);
      await client.query('COMMIT');
      return res.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findShowComments(sname: string): Promise<Comment[]> {
    const client = await this.pool.connect();
    const sql = `SELECT comment_id, users.image_url, comment_body, users.id, users.username,
                subcomment_count, created_at FROM show_comment
                INNER JOIN comment ON show_comment.comment_id = comment.id
                INNER JOIN users ON comment.user_id = users.id WHERE show_name = $1 ORDER BY comment.created_at DESC`;

    try {
      const res = await client.query(sql, [sname]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async updateShow(sname: string, args): Promise<any> {
    const client = await this.pool.connect();
    let sql = 'UPDATE tvshow SET ';
    for (const k in args) {
      if (k) {
        sql += k + ' = \'' + args[k] + '\',';
      }
    }
    sql = sql.slice(0, -1) + ' WHERE show_name = $1';
    try {
      const res = client.query(sql, [sname]);
      return res;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findShowComment(sname: string, cid: number): Promise<Comment> {
    const client = await this.pool.connect();
    const sql = `SELECT comment_id, users.image_url, comment_body, users.id, users.username,
                 subcomment_count, created_at FROM show_comment
                 INNER JOIN comment ON show_comment.comment_id = comment.id
                 INNER JOIN users ON comment.user_id = users.id WHERE show_name = $1 AND comment_id = $2`;
    try {
      const res = await client.query(sql, [sname, cid]);
      return res.rows[0];
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async markAsWatched(sname: string, uid: number) {
    const ser: WatchService = new WatchService();
    const wid = await ser.create(uid);
    const client = await this.pool.connect();
    const sql = 'INSERT INTO show_watch(watch_id, show_name) VALUES($1, $2) RETURNING watch_id';

    try {
      const res = await client.query(sql, [wid, sname]);
      return res.rows[0].watch_id;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async checkIfWatched(sname: string, uid: number): Promise<boolean> {
    const client = await this.pool.connect();
    const sql = `SELECT * from watch WHERE id IN
        (SELECT watch_id FROM show_watch WHERE show_name = $1) AND user_id = $2`;
    try {
      const res = await client.query(sql, [sname, uid]);
      return (!res.rows.length) ? false : true;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async unmarkWatch(sname: string, uid: number): Promise<boolean> {
    const client = await this.pool.connect();
    const sql = 'DELETE FROM watch WHERE id IN (SELECT watch_id FROM show_watch WHERE show_name = $1) AND user_id = $2';
    try {
      await client.query(sql, [sname, uid]);
      return true;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
    // return false; Handle errors in controllers. Also return id of the deleted data.
  }

  public async rateShow(uid: number, sname: string, rating): Promise<boolean> {
    const ser: RateService = new RateService();
    const rid = await ser.rate(uid, rating);
    const client = await this.pool.connect();
    const sql = 'INSERT INTO show_rate(rate_id, show_name) VALUES($1, $2)';
    try {
      const res = await client.query(sql, [rid, sname]);
      return true;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async updateRate(uid: number, sname: string, rating): Promise<boolean> {
    const ser: RateService = new RateService();
    return await ser.update(uid, sname, rating);
  }

  public async findOverallRate(sname: string): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'SELECT overall_rating FROM tvshow WHERE show_name = $1';
    try {
      const res = await client.query(sql, [sname]);
      return res.rows[0].overall_rating;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findReport() {
    const client = await this.pool.connect();
    const sql = `SELECT tvshow.show_name,  AVG(rating) as average_rating FROM rate
                 INNER JOIN show_rate ON show_rate.rate_id = rate.id
                 INNER JOIN tvshow ON tvshow.show_name = show_rate.show_name
                 WHERE show_rate.show_name IN (SELECT show_name FROM show_rate
                 GROUP BY show_rate.show_name ORDER BY COUNT(*) DESC LIMIT 3) GROUP BY tvshow.show_name`;
    try {
      const res = await client.query(sql);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }
}
