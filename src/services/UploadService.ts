import * as multer from 'multer';
import { Service } from './service';

export class UploadService extends Service {
  public async upload(id: number, category: string, imageUrl: string): Promise<string> {
    const client = await this.pool.connect();
    const sql = `UPDATE ${category} SET image_url=$2 WHERE id=$1 RETURNING *`;
    const values = [id, imageUrl];

    try {
      const res = await client.query(sql, values);
      if (res.rows[0]) {
        return res.rows[0].image_url;
      }
    } catch (e) {
      throw new Error(`There is some error during the upload photo operation on id='${id}'.`);
    } finally {
      client.release();
    }
    return undefined;
  }

  public async findById(id: number, category: string): Promise<any> {
    const client = await this.pool.connect();
    const sql = `SELECT image_url, id FROM ${category} WHERE id = $1 `;
    const values = [id];

    try {
      const res = await client.query(sql, values);
      if (res.rows[0]) {
        return res.rows[0].image_url;
      } else {
        return false;
      }
    } catch (e) {
      throw new Error(`There is some error during the findById photo operation on id='${id}'.`);
    } finally {
      client.release();
    }
  }

  public async update(id: number, category: string, imageUrl: string): Promise<string> {
    const client = await this.pool.connect();
    const sql = `UPDATE ${category} SET image_url=$2 WHERE id=$1 RETURNING *`;
    const values = [id, imageUrl];

    try {
      const res = await client.query(sql, values);
      if (res.rows[0]) {
        return res.rows[0].image_url;
      }
    } catch (e) {
      throw new Error(`There is some error during the update photo operation on id='${id}'.`);
    } finally {
      client.release();
    }
    return undefined;
  }

  public async delete(id: number, category: string): Promise<string> {
    const client = await this.pool.connect();
    const values = [id];
    const sql = `WITH old AS (SELECT image_url FROM ${category} WHERE id = $1)
                 UPDATE ${category} SET image_url = NULL WHERE id = $1
                 RETURNING (SELECT image_url FROM old)`;
    try {
      const res = await client.query(sql, values);
      if (res.rows[0]) {
        return res.rows[0].image_url;
      }
    } catch (e) {
      throw new Error(`There is some error during the delete photo operation on id='${id}'.`);
    } finally {
      client.release();
    }
    return undefined;
  }
}
