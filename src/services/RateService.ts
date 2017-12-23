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
      console.log(e)
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async update(uid: number, sid: number, rating): Promise<Boolean> {
    const client = await this.pool.connect();
    const sql = 'UPDATE rate SET rating = $1 WHERE id IN (SELECT rate_id FROM show_rate WHERE show_id = $2) AND user_id = $3';
    try {
      await client.query(sql, [rating, sid,  uid]);
      return true;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return false;
  }
}
