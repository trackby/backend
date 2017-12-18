import { Service } from './service';

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
