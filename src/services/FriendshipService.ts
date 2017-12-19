import { FriendshipController } from '../controllers/FriendshipController';
import { Friendship } from '../models/Friendship';
import { Service } from './service';

type FriendshipStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export class FriendshipService extends Service {
  public async showFriendshipRelation(firstUserId: number, secondUserId: number): Promise<Friendship> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM friendship WHERE first_user_id = $1 AND second_user_id = $2';
    const sortedIds: any = [ firstUserId, secondUserId ];
    sortedIds.sort((a, b) => (a - b));

    try {
      const res = await client.query(sql, sortedIds);
      if (res.rows[0]) {
        return res.rows[0];
      }
    } catch (e) {
        throw new Error(`There is some error during the showFriendship operation on id='${firstUserId}'.`);
    } finally {
        client.release();
    }
    return undefined;
  }

  public async save(friendship: Friendship): Promise<Friendship> {
    const { firstUserId, secondUserId, status, actionUserId } = friendship;
    const client = await this.pool.connect();
    const sql = `INSERT INTO friendship (first_user_id, second_user_id, status, action_user_id)
                VALUES($1, $2, $3, $4) RETURNING *`;

    const sortedIds: any = [ firstUserId, secondUserId ];
    sortedIds.sort((a, b) => (a - b));
    const values = sortedIds.concat([ status, actionUserId ]);

    try {
      const res = await client.query(sql, values);
      return res.rows[0];
    } catch (e) {
        throw new Error(`There is some error during the save operation on friendship='${friendship}' .`);
    } finally {
        client.release();
    }
  }

  public async update(friendship: Friendship): Promise<Friendship> {
    const { firstUserId, secondUserId, status, actionUserId } = friendship;
    const client = await this.pool.connect();
    const sql = `UPDATE friendship SET status = $3 WHERE first_user_id = $1 AND second_user_id = $2 RETURNING *`;
    const sortedIds: any = [ firstUserId, secondUserId ];
    sortedIds.sort((a, b) => (a - b));
    const values = sortedIds.concat([ status ]);

    try {
      const res = await client.query(sql, values);
      return res.rows[0];
    } catch (e) {
        throw new Error(`There is some error during the save operation on friendship='${friendship}' .`);
    } finally {
        client.release();
    }
  }
}
