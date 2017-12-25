import { Service } from './service';
import { ShowService } from './ShowService';

export class RateService extends Service {
  public async rate(uid: number, rating): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'INSERT into rate (user_id, rating) VALUES($1, $2) RETURNING id';
    try {
      const res = await client.query(sql, [uid, rating]);
      return res.rows[0].id;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async update(uid: number, sname: string, rating): Promise<Boolean> {
    const client = await this.pool.connect();
    const sql = 'UPDATE rate SET rating = $1 WHERE id IN (SELECT rate_id FROM show_rate WHERE show_name = $2) AND user_id = $3';
    try {
      await client.query(sql, [rating, sname,  uid]);
      return true;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return false;
  }

  public async updateSeason(uid: number, sname: string, season: number, rating): Promise<Boolean> {
    const client = await this.pool.connect();
    const sql = 'UPDATE rate SET rating = $1 WHERE id IN (SELECT rate_id FROM show_rate WHERE show_name = $2 AND season_no = $3) AND user_id = $4';
    try {
      await client.query(sql, [rating, sname, season, uid]);
      return true;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return false;
  }

  public async updateEpisode(uid: number, sname: string, season: number, episode: number, rating): Promise<Boolean> {
    const client = await this.pool.connect();
    const sql = 'UPDATE rate SET rating = $1 WHERE id IN (SELECT rate_id FROM episode_rate WHERE show_name = $2 AND season_no = $3 AND episode_no = $4) AND user_id = $5';
    try {
      await client.query(sql, [rating, sname, season, episode, uid]);
      return true;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return false;
  }

  public async getHighestRates() {
    const client = await this.pool.connect();
    const sql = 'SELECT username, AVG(rating) as average_rating,'
              + 'stddev(rating) as rating_deviation, COUNT(*) as rate_count FROM users '
              + 'INNER JOIN rate ON rate.user_id = users.id '
              + 'GROUP BY users.id ORDER BY rate_count DESC LIMIT 4';
    try {
      const res = await client.query(sql);
      return res.rows;
    } catch (e) {
      console.log(e)
    } finally {
      client.release();
    }
    return null;
  }
}
