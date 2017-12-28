import { Reaction } from '../models/reaction';
import { CommentService } from './CommentService';
import { Service } from './service';

export class ReactionService extends Service {

  public async create(reaction: Reaction): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'INSERT INTO reaction (reaction_type, user_id) VALUES($1, $2) RETURNING id';
    try {
      const res = await client.query(sql, [reaction.reaction_type, reaction.user_id]);
      return res.rows[0].id;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async deleteReaction(rid: number, uid: number): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'DELETE FROM reaction WHERE id = $1 AND user_id = $2 RETURNING id';
    try {
      const res = await client.query(sql, [rid, uid]);
      return res.rows[0].id;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  }

  public async findUserReactions(uid: number): Promise<any> {
    const ser: CommentService = new CommentService();
    const comment_reactions = await ser.findUserCommentReactions(uid);
    // may be added more
    return {
      comment_reactions,
    };
  }
}
