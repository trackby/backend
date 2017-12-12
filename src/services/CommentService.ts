import { Comment } from '../models/comment';
import { Service } from './service';

export class ShowService  extends Service {

    public async findById(id: number): Promise<Comment> {
        const client = await this.pool.connect();
        const sql = 'SELECT * FROM comment WHERE id = $1';
        try {
            const res = await client.query(sql, [id]);
            return res.rows[0];
        } catch (e) {
           // console.log(e.stack);
        } finally {
          client.release();
        }
        return null;
    }

    public async create(comment: Comment): Promise<number> {
        const client = await this.pool.connect();
        const sql = 'INSERT INTO comment (body, user_id, parent_id) VALUES($1, $2, $3, $4) RETURNING id';
        try {
            const id = await client.query(sql, [comment.body, comment.user_id, comment.parent_id]);
            return id;
        } catch (e) {
           // console.log(e.stack)
        } finally {
          client.release();
        }
        return null;
    }

    public async delete(sid: number): Promise<number> {
        const client = await this.pool.connect();
        const sql = 'DELETE FROM comment WHERE id = $1 RETURNING id';
        try {
            const id = await client.query(sql, [sid]);
            return id;
        } catch (e) {
            // console.log(e.stack)
        } finally {
          client.release();
        }
        return null;
    }

    public async findAll(): Promise<Comment[]> {
        const client = await this.pool.connect();
        const sql = 'SELECT * FROM comment';
        try {
            const shows = await client.query(sql);
            return shows.rows;
        } catch (e) {
            // console.log(e.stack)
        } finally {
          client.release();
        }
        return null;
    }
}
