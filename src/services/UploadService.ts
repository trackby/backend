import * as multer from 'multer';
import { Service } from './service';

export class UploadService extends Service {
  public async uploadPhoto(userId: number, imageUrl: string): Promise<string> {
    const client = await this.pool.connect();
    const sql = `INSERT INTO user_profile_photo (user_id, image_url) VALUES($1, $2) RETURNING *`;
    const values = [userId, imageUrl];

    try {
      const res = await client.query(sql, values);
      if (res.rows[0]) {
        return res.rows[0];
      }
    } catch (e) {
      throw new Error(`There is some error during the upload photo operation on id='${userId}'.`);
    } finally {
      client.release();
    }
    return undefined;
  }

  public async findById(userId: number): Promise<any> {
    const client = await this.pool.connect();
    const sql = `SELECT image_url FROM user_profile_photo WHERE user_id = $1 `;
    const values = [userId];

    try {
      const res = await client.query(sql, values);
      if (res.rows[0]) {
        return res.rows[0].image_url;
      } else {
        return false;
      }
    } catch (e) {
      throw new Error(`There is some error during the upload photo operation on id='${userId}'.`);
    } finally {
      client.release();
    }
  }

  public async update(userId: number, imageUrl: string): Promise<string> {
    const client = await this.pool.connect();
    const sql = `UPDATE user_profile_photo SET image_url=$2 WHERE user_id=$1 RETURNING *`;
    const values = [userId, imageUrl];

    try {
      const res = await client.query(sql, values);
      if (res.rows[0]) {
        return res.rows[0];
      }
    } catch (e) {
      throw new Error(`There is some error during the upload photo operation on id='${userId}'.`);
    } finally {
      client.release();
    }
    return undefined;
  }

  public async delete(userId: number): Promise<string> {
    const client = await this.pool.connect();
    const sql = `DELETE FROM user_profile_photo WHERE user_id=$1 RETURNING *`;
    const values = [userId];

    try {
      const res = await client.query(sql, values);
      if (res.rows[0].image_url) {
        return res.rows[0].image_url;
      }
    } catch (e) {
      throw new Error(`There is some error during the upload photo operation on id='${userId}'.`);
    } finally {
      client.release();
    }
    return undefined;
  }

}
