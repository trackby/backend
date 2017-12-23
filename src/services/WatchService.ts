import { Service } from './service';
import { ShowService } from './ShowService';

export class WatchService extends Service {
  public async create(uid: number): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'INSERT into watch (user_id) VALUES($1) RETURNING id';
    try {
      const res = await client.query(sql, [ uid ]);
      return res.rows[0].id;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }
  

  public async findUserWatches(uid: number): Promise<any> {
    const ser: ShowService = new ShowService();
    const show_watches = await ser.findUserShowWatches(uid);
    //may be added more
    return {
      show_watches: show_watches
    };
  }

  public async delete(uid: number): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'DELETE FROM watch WHERE id = $1 RETURNING id';
    try {
      const res = await client.query(sql, [ uid ]);
      return res.rows[0].id;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }
}
