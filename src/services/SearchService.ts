import { FriendshipController } from '../controllers/FriendshipController';
import { Friendship } from '../models/Friendship';
import { User } from '../models/User';
import { Service } from './service';
import { UserService } from './UserService';

export class SearchService extends Service {
  public async search(word: string): Promise<string> {
    const client = await this.pool.connect();
    const values = [ word ];

    const sql = `SELECT id as show_id, show_name, ts_rank(document, plainto_tsquery($1)) as relevancy
                  FROM search_index
                  WHERE document @@ plainto_tsquery($1)
                  ORDER BY relevancy DESC LIMIT 5`;

    try {
      const res = await client.query(sql, values);
      if (res.rows) {
        return res.rows;
      }
    } catch (e) {
      console.log(e);
      throw new Error(`There is some error during the search operation on id='${word}'.`);
    } finally {
      client.release();
    }
    return undefined;
  }

  public async didYouMean(word: string): Promise<string> {
    const client = await this.pool.connect();
    const values = [ word ];

    const sql = `SELECT word FROM unique_lexeme WHERE similarity(word, $1) > 0.4
                ORDER BY word <-> $1
                LIMIT 1;`;

    try {
      const res = await client.query(sql, values);
      if (res.rows) {
        return res.rows[0].word;
      }
    } catch (e) {
      console.log(e);
      throw new Error(`There is some error during the recommend operation on id='${word}'.`);
    } finally {
      client.release();
    }
    return undefined;
  }
}
