import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { CommentController } from './controllers/CommentController';
import { Controller } from './controllers/Controller';
import { FriendshipController } from './controllers/FriendshipController';
import { ReactionController } from './controllers/ReactionController';
import { ShowController } from './controllers/ShowContoller';
import { UploadController } from './controllers/UploadController';
import { WatchController } from './controllers/WatchController';

/**
 * / route
 *
 * @class User
 */
export class Routes {
  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    router.use((req, res, next) => {
      next();
    });

    router.get('/', Controller.sayHello);

    // trackby.me routes
    router.route('/signup').post(AuthController.signup);
    router.route('/auth').post(AuthController.authenticate);
    router.get('/protected', (req, res) => {
      res.json({ message: 'Hoorayyy! Welcome to TrackBy!' });
    });

    /* only active on production */
    if (process.env.NODE_ENV === 'production') {
      router.use(AuthController.protect);
    }


    router.get('/friendships/show/', FriendshipController.showFriendshipRelation);
    router.post('/friendships/create', FriendshipController.sendFriendshipRequest);
    router.patch('/friendships/update', FriendshipController.updateFriendshipStatus);

    router.post('/protected', (req, res) => {
      res.json({ message: 'Hoorayyy! Welcome to TrackBy!' });
    });

    /* Feed */
    router.get('/feed/comments', CommentController.readUserComments);
    router.get('/feed/reactions', ReactionController.readUserReactions);    
    router.get('/feed/watches', WatchController.readUserWatches);  
    /* Feed */

    /* Show */
    router.post('/shows', ShowController.createShow);
    router.get('/shows', ShowController.readShows);
    router.get('/shows/:showid', ShowController.readShow);    
    router.patch('/shows/:showid', ShowController.updateShow); //for each field
    router.delete('/shows/:showid', ShowController.deleteShow);
    router.get('/shows/:showid/comments', ShowController.readShowComments);
    router.post('/shows/:showid/comments', ShowController.createShowComment);    
    router.get('/shows/:showid/comments/:commentid', ShowController.readShowComment);
    router.post('/shows/:showid/watch', ShowController.markAsWatched);
    /* Show */

    /* Comment */
    router.get('/comments/:commentid', CommentController.readComment);
    router.delete('/comments/:commentid', CommentController.deleteComment);
    router.get('/comments/:commentid/subcomments', CommentController.readSubcomments);
    router.post('/comments/:commentid/subcomments', CommentController.createSubcomment);
    router.get('/comments/:commentid/reactions', CommentController.readCommentReactions);
    router.post('/comments/:commentid/reactions', CommentController.createCommentReaction);
    /* Comment */

    router.delete('/reactions/:reactionid', ReactionController.deleteReaction);
    router.delete('/watches/:watchid', WatchController.unmarkWatch);
    

    router.post('/upload', UploadController.upload);
  }
}
