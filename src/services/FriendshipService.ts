import { FriendshipController } from '../controllers/FriendshipController';
import { Friendship } from '../models/Friendship';
import { Service } from './service';

type FriendshipStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export class FriendshipService extends Service {
  public async showFriendshipRelation(sourceId: number, targetId: number): Promise<Friendship> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM friendship WHERE first_user_id = $1 AND second_user_id = $2';

    try {
      const res = await client.query(sql, [sourceId, targetId].sort());
      return res.rows;
    } catch (e) {
        throw new Error(`There is some error during the findbyId operation on id='${sourceId}' .`);
    } finally {
        client.release();
    }
  }

  public async save(friendship: Friendship): Promise<boolean> {
    const { firstUserId, secondUserId, status, actionUserId } = friendship;
    const client = await this.pool.connect();
    const sql = `INSERT INTO friendship (first_user_id, second_user_id, status, action_user_id)
                VALUES($1, $2, $3, $4) RETURNING *`;

    const sortedIds: any = [firstUserId, secondUserId].sort();
    const values = sortedIds.concat([status, actionUserId]);

    try {
      const res = await client.query(sql, values);
      if (res.rows[0]) {
        return true;
      }
    } catch (e) {
        throw new Error(`There is some error during the save operation on friendship='${friendship}' .`);
    } finally {
        client.release();
    }
    return false;
  }
}
