import { Comment } from '../models/comment';
import { Episode } from '../models/episode';
import { Show } from '../models/show';
import { ShowComment } from '../models/showcomment';
import { CommentService } from './commentservice';
import { RateService } from './rateservice';
import { Service } from './service';
import { WatchService } from './watchservice';

export class EpisodeService extends Service {
  public async find(sname: string, season: number, episode: number, uid: number): Promise<Episode> {
    const client = await this.pool.connect();
    const sql = `SELECT info, episode.episode_no, episode.episode_name,
                trailer_url, overall_rating, rating, created_at
                FROM episode LEFT JOIN episode_rate ON episode_rate.show_name = episode.show_name AND
                episode_rate.episode_no = episode.episode_no AND episode_rate.season_no = episode.season_no
                LEFT JOIN rate ON rate.id = episode_rate.rate_id AND rate.user_id = $1
                WHERE episode.show_name = $2 AND episode.season_no = $3 AND episode.episode_no = $4`;
    try {
      const res = await client.query(sql, [uid, sname, season, episode]);
      return res.rows[0];
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findEpisodesByNo(sname: string, season: string): Promise<Episode[]> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM episode WHERE show_name = $1 AND season_no = $2';

    try {
      const shows = await client.query(sql, [sname, season]);
      return shows.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findAllShowEpisodes(sname: string): Promise<Episode[]> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM episode WHERE show_name = $1';

    try {
      const shows = await client.query(sql, [sname]);
      return shows.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }
  public async create(episode: Episode): Promise<number> {
    const client = await this.pool.connect();
    const sql = `INSERT INTO episode(episode_no, episode_name, info, trailer_url, image_url, season_no, show_name)
                 VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`;
    try {
      const res = await client.query(sql,
        [episode.episode_no, episode.episode_name, episode.info, episode.trailer_url,
           episode.image_url, episode.season_no, episode.show_name]);
      return res.rows[0].id;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async deleteEpisode(sname: string, season: number, episode: number): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'DELETE FROM episode WHERE show_name = $1 AND season_no = $2 AND episode_no = $3 RETURNING *';

    try {
      const res = await client.query(sql, [sname, season]);
      return res.rows[0];
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findEpisodesBySeason(sname, season): Promise<Episode[]> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM episode WHERE show_name = $1 AND season_no = $2';

    try {
      const shows = await client.query(sql, [sname, season]);
      return shows.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  /* later */
  public async findUserSeasonComments(uid: number) {
    const client = await this.pool.connect();
    const sql = `SELECT tvshow.show_name, comment.comment_body, comment.created_at FROM season_comment
                INNER JOIN season ON season_comment.season_id = season.id
                INNER JOIN comment ON show_comment.comment_id = comment.id WHERE comment.user_id IN
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1)
                ORDER BY comment.created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async createEpisodeComment(sname: string, season: number, eid: number, comment: Comment): Promise<number> {
    const ser: Service = new CommentService();
    const cid: number = await ser.create(comment);
    const client = await this.pool.connect();
    const sql = `INSERT INTO episode_comment (show_name, season_no, episode_no, comment_id)
                 VALUES($1, $2, $3, $4) RETURNING comment_id`;
    try {
      const res = await client.query(sql, [sname, season, eid, cid]);
      return res.rows[0].comment_id;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findEpisodeComments(sname: string, season: number, episode: number): Promise<Comment[]> {
    const client = await this.pool.connect();
    const sql = `SELECT comment_id, users.image_url, comment_body, users.id, users.username,
                 subcomment_count, created_at FROM episode_comment
                 INNER JOIN comment ON episode_comment.comment_id = comment.id
                 INNER JOIN users ON comment.user_id = users.id WHERE show_name = $1
                 AND season_no = $2 AND episode_no = $3
                 ORDER BY comment.created_at DESC`;
    try {
      const res = await client.query(sql, [sname, season, episode]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findEpisodeComment(sname: string, season: number, eid: number, cid: number): Promise<Comment> {
    const client = await this.pool.connect();
    const sql = `SELECT comment_id, users.image_url, comment_body, users.id, users.username,
                 subcomment_count, created_at
                 FROM episode_comment
                 INNER JOIN comment ON episode_comment.comment_id = comment.id
                 INNER JOIN users ON comment.user_id = users.id WHERE show_name = $1 AND season_no = $2
                 AND episode_no = $3 AND comment_id = $4`;
    try {
      const res = await client.query(sql, [sname, season, eid, cid]);
      return res.rows[0];
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async updateEpisode(sname: string, season: number, episode: number, ...args: any[] ): Promise<any> {
    const client = await this.pool.connect();
    let sql = 'UPDATE season SET ';
    args.forEach((arg, index) => {
      sql += arg.field + ' = ' + arg.val;
      if (index !== args.length - 1)  { sql += ','; }
    });
    sql += ' WHERE show_name = $1 AND season_no = $2 AND episode_no = $3';
    try {
      const res = client.query(sql, [sname, season, episode]);
      return res;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async markAsWatched(sname: string, season: number, episode: number, uid: number) {
    const ser: WatchService = new WatchService();
    const wid = await ser.create(uid);
    const client = await this.pool.connect();
    const sql = `INSERT INTO episode_watch(watch_id, show_name, season_no, episode_no) VALUES($1, $2, $3, $4)
                 RETURNING watch_id`;
    try {
      const res = await client.query(sql, [wid, sname, season, episode]);
      return res.rows[0].watch_id;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

 public async checkIfWatched(sname: string, season: number, episode: number): Promise<boolean > {
    const client = await this.pool.connect();
    const sql = 'SELECT * from episode_watch WHERE show_name = $1 AND season_no = $2 AND episode_no = $3';

    try {
      const res = await client.query(sql, [sname, season, episode]);
      return(!res.rows.length) ? false : true;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async unmarkWatch(sname: string, season: number, episode: number, uid: number): Promise <boolean> {
    const client = await this.pool.connect();
    const sql = `DELETE FROM watch WHERE id IN
                (SELECT watch_id FROM episode_watch WHERE show_name = $1 AND season_no = $2 AND episode_no = $3)
                AND user_id = $4`;
    try {
      await client.query(sql, [sname, season, episode, uid]);
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
    const sql = `SELECT * FROM episode_watch
                 INNER JOIN episode ON episode.show_name = tvshow.show_name
                 INNER JOIN comment ON show_watch.watch_id = watch.id WHERE user_id = $1`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async rateEpisode(uid: number, sname: string, season: number, episode: number, rating): Promise < boolean > {
    const ser: RateService = new RateService();
    const rid = await ser.rate(uid, rating);
    const client = await this.pool.connect();
    const sql = 'INSERT INTO episode_rate(rate_id, show_name, season_no, episode_no) VALUES($1, $2, $3, $4)';

    try {
      const res = await client.query(sql, [rid, sname, season, episode]);
      return true;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async updateRate(uid: number, sname: string, season: number, episode: number, rating): Promise <boolean> {
    const ser: RateService = new RateService();
    return await ser.updateEpisode(uid, sname, season, episode, rating);
  }

  public async findOverallRate(sname: string, season: number, episode: number): Promise <number> {
    const client = await this.pool.connect();
    const sql = 'SELECT overall_rating FROM episode WHERE show_name = $1 AND season_no = $2 AND episode_no = $3';
    try {
      const res = await client.query(sql, [sname, season, episode]);
      return res.rows[0].overall_rating;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }
}
