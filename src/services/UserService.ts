import { Comment } from '../models/comment';
import { Show } from '../models/show';
import { ShowComment } from '../models/showcomment';
import {User} from '../models/User';
import { CommentService } from './commentservice';
import { Service } from './service';
import { WatchService } from './watchservice';

export class UserService extends Service {
  public async findByUsername(username: string): Promise<User> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM users WHERE username = $1';

    try {
      const res = await client.query(sql, [username]);
      return res.rows[0];
    } catch (e) {
        throw new Error(e);
    } finally {
        client.release();
    }
  }
}
