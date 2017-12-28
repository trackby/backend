import { Comment } from '../models/comment';
import { Season } from '../models/season';
import { Show } from '../models/show';
import { ShowComment } from '../models/showcomment';
import { CommentService } from './commentservice';
import { RateService } from './rateservice';
import { Service } from './service';
import { WatchService } from './watchservice';

export class SeasonService extends Service {
  public async find(sname: string, season: number, uid: number): Promise<Season> {
    const client = await this.pool.connect();
    const sql = `SELECT info, season_year, season.season_no,
                trailer_url, episode_count, overall_rating, rating, created_at
                FROM season LEFT JOIN season_rate ON season_rate.season_no = season.season_no
                AND season_rate.show_name = season.show_name
                LEFT JOIN rate ON rate.id = season_rate.rate_id AND rate.user_id = $1
                WHERE season.show_name = $2 AND season.season_no = $3`;
    try {
      const res = await client.query(sql, [uid, sname, season]);
      return res.rows[0];
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findAllSeasons(sname: string): Promise<Season[]> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM season WHERE show_name = $1';
    try {
      const shows = await client.query(sql, [sname]);
      return shows.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

/*season table */
  public async create(season: Season): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'INSERT INTO season(season_no, info, trailer_url, image_url, season_year, show_name) ' +
                'VALUES($1, $2, $3, $4, $5, $6) RETURNING id';
    try {
      const res = await client.query(sql,
          [season.season_no, season.info, season.trailer_url, season.image_url, season.season_year, season.show_name]);
      return res.rows[0].id;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async deleteSeason(sname: string, season: number): Promise<number> {
    const client = await this.pool.connect();
    const sql = `DELETE FROM season WHERE show_name = $1 AND season_no = $2 RETURNING id`;
    try {
      const res = await client.query(sql, [sname, season]);
      return res.rows[0].id;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async createSeasonComment(sname: string, season: number, comment: Comment): Promise<number> {
    const ser: Service = new CommentService();
    const cid: number = await ser.create(comment);
    const client = await this.pool.connect();
    const sql = `INSERT INTO season_comment (show_name, season_no, comment_id) VALUES($1, $2, $3) RETURNING comment_id`;
    try {
      const res = await client.query(sql, [sname, season, cid]);
      return res.rows[0].comment_id;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findSeasonComments(sname: string, season: number): Promise<Comment[]> {
    const client = await this.pool.connect();
    const sql = `SELECT comment_id, users.image_url, comment_body, users.id, users.username,
                 subcomment_count, created_at
                 FROM season_comment
                 INNER JOIN comment ON season_comment.comment_id = comment.id
                 INNER JOIN users ON comment.user_id = users.id WHERE show_name = $1 AND season_no = $2
                 ORDER BY comment.created_at DESC`;
    try {
      const res = await client.query(sql, [sname, season]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async updateSeason(sname: string, season: number, ...args: any[] ): Promise<any> {
    const client = await this.pool.connect();
    let sql = 'UPDATE season SET ';
    args.forEach((arg, index) => {
      sql += arg.field + ' = ' + arg.val;
      if (index !== args.length - 1)  { sql += ','; }
    });
    sql += ' WHERE show_name = $1 AND season_no = $2';
    try {
      const res = client.query(sql, [sname, season]);
      return res;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findSeasonComment(sname: string, season: number, cid: number): Promise<Comment> {
    const client = await this.pool.connect();
    const sql = `SELECT comment_id, users.image_url, comment_body, users.id, users.username,
                subcomment_count, created_at
                FROM show_comment
                INNER JOIN comment ON season_comment.comment_id = comment.id
                INNER JOIN users ON comment.user_id = users.id WHERE show_name = $1 AND season_no = $2
                AND comment_id = $3`;

    try {
      const res = await client.query(sql, [sname, season, cid]);
      return res.rows[0];
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async markAsWatched(sname: string, season: number, uid: number) {
    const ser: WatchService = new WatchService();
    const wid = await ser.create(uid);
    const client = await this.pool.connect();
    const sql = 'INSERT INTO season_watch(watch_id, show_name, season_no) VALUES($1, $2, $3) RETURNING watch_id';

    try {
      const res = await client.query(sql, [wid, sname, season]);
      return res.rows[0].watch_id;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async checkIfWatched(sname: string, season: number): Promise<boolean> {
    const client = await this.pool.connect();
    const sql = 'SELECT * from season_watch WHERE show_name = $1 AND season_no = $2';
    try {
      const res = await client.query(sql, [sname, season]);
      return (!res.rows.length) ? false : true;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async unmarkWatch(sname: string, season: number, uid: number): Promise<boolean> {
    const client = await this.pool.connect();
    const sql = `DELETE FROM watch WHERE id IN (SELECT watch_id FROM season_watch WHERE show_name = $1
                AND season_no = $2) AND user_id = $3`;
    try {
      await client.query(sql, [sname, season, uid]);
      return true;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  // modify this!
  public async findUserShowWatches(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM show_watch ' +
                'INNER JOIN tvshow ON show_watch.show_name = tvshow.id ' +
                'INNER JOIN comment ON show_watch.watch_id = watch.id WHERE user_id = $1';

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async rateSeason(uid: number, sname: string, season: number, rating): Promise<boolean> {
    const ser: RateService = new RateService();
    const rid = await ser.rate(uid, rating);
    const client = await this.pool.connect();
    const sql = 'INSERT INTO season_rate(rate_id, show_name, season_no) VALUES($1, $2, $3)';

    try {
      const res = await client.query(sql, [rid, sname, season]);
      return true;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async updateRate(uid: number, sname: string, season: number, rating): Promise<boolean> {
    const ser: RateService = new RateService();
    return await ser.updateSeason(uid, sname, season, rating);
  }

  public async findOverallRate(sname: string, season: number): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'SELECT overall_rating FROM season WHERE show_name = $1 AND season_no = $2';
    try {
      const res = await client.query(sql, [sname, season]);
      return res.rows[0].overall_rating;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }
}
