import { Show, ShowComment } from '../models/show';
import { Comment } from '../models/comment';
import { Service } from './service'

export class ShowService  extends Service {

    public async findById(id: number): Promise<Show> {
        const client = await this.pool.connect()
        const sql = 'SELECT * FROM tvshow WHERE id = $1'
        try {
            const res = await client.query(sql, [id])
            return res.rows[0];
        } catch (e) {
            console.log(e.stack)
        } finally {
          client.release()
        }
        return null
    }

    public async create(show: Show): Promise<number> {
        const client = await this.pool.connect()
        const sql = 'INSERT into tvshow (name, info, trailer_url, image_url) VALUES($1, $2, $3, $4) RETURNING id'
        try {
            const id = await client.query(sql, [show.show_name, show.info, show.trailer_url, show.image_url])
            return id;
        } catch (e) {
            console.log(e.stack)
        } finally {
          client.release()
        }
        return null
    }

    public async delete(sid: number): Promise<number> {
        const client = await this.pool.connect()
        const sql = 'DELETE FROM tvshow WHERE id = $1 RETURNING id'
        try {
            const id = await client.query(sql, [sid])
            return id;
        } catch (e) {
            console.log(e.stack)
        } finally {
          client.release()
        }
        return null
    }

    public async findAll(): Promise<Show[]> {
        const client = await this.pool.connect()
        const sql = 'SELECT * FROM tvshow'
        try {
            const shows = await client.query(sql)
            return shows.rows;
        } catch (e) {
            console.log(e.stack)
        } finally {
          client.release()
        }
        return null
    }

    public async createShowComment(scomment: ShowComment): Promise<number> {
        const client = await this.pool.connect()
        const sql = 'INSERT into showcomment (show_id, comment_id) VALUES($1, $2) RETURNING id'
        try {
            const id = await client.query(sql, [scomment.show_id, scomment.comment_id])
            return id;
        } catch (e) {
            console.log(e.stack)
        } finally {
          client.release()
        }
        return null
    }

    public async findShowComments(sid: number): Promise<Comment[]> {
        const client = await this.pool.connect()
        const sql = 'SELECT * FROM showcomment INNER JOIN comment ON showcomment.comment_id = comment.id WHERE show_id = $1'
        try {
            const res = await client.query(sql, [sid])
            return res.rows;
        } catch (e) {
            console.log(e.stack)
        } finally {
          client.release()
        }
        return null
    }

    public async findShowComment(sid: number, cid: number): Promise<Comment[]> {
        const client = await this.pool.connect()
        const sql = 'SELECT * FROM showcomment INNER JOIN comment ON showcomment.comment_id = comment.id WHERE show_id = $1 AND comment_id = $2'
        try {
            const res = await client.query(sql, [sid, cid])
            return res.rows[0];
        } catch (e) {
            console.log(e.stack)
        } finally {
          client.release()
        }
        return null
    }

}