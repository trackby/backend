import { Service } from './service';

export class FeedService extends Service {

  public async findEpisodeComments(uid: number) {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM episode_comments WHERE user_id IN
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1) 
                ORDER BY created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findSubcomments(uid: number): Promise<Comment[]> {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM subcomments WHERE user_id IN 
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1) 
                ORDER BY created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findSeasonComments(uid: number) {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM season_comments WHERE user_id IN
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1) 
                ORDER BY created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
    client.release();
    }
  }

  public async findShowComments(uid: number) {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM show_comments WHERE user_id IN
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1) 
                ORDER BY created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findShowWatches(uid: number) {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM show_watches WHERE user_id IN
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1) 
                ORDER BY created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findSeasonWatches(uid: number) {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM season_watches WHERE user_id IN
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1) 
                ORDER BY created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findEpisodeWatches(uid: number) {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM episode_watches WHERE user_id IN
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1) 
                ORDER BY created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findShowRates(uid: number) {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM show_rates WHERE user_id IN
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1) 
                ORDER BY created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findSeasonRates(uid: number) {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM season_rates WHERE user_id IN
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1) 
                ORDER BY created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findEpisodeRates(uid: number) {
    const client = await this.pool.connect();
    const sql = `SELECT * FROM episode_rates WHERE user_id IN
                (SELECT second_user_id FROM friends_view WHERE first_user_id = $1) 
                ORDER BY created_at DESC`;
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }
}
