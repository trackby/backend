import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { CommentController } from './controllers/CommentController';
import { Controller } from './controllers/Controller';
import { FriendshipController } from './controllers/FriendshipController';
import { ReactionController } from './controllers/ReactionController';
import { SearchController } from './controllers/SearchController';
import { ShowController } from './controllers/ShowController';
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

    router.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
      res.header('Access-Control-Allow-Methods', 'GET, POST,OPTIONS, DELETE, PATCH, PUT');
      next();
    });

    // trackby.me routes
    router.route('/signup').post(AuthController.signup);
    router.route('/auth').post(AuthController.authenticate);
    router.get('/protected', (req, res) => {
      res.json({ message: 'Hoorayyy! Welcome to TrackBy!' });
    });

    router.use(AuthController.protect);

    router.post('/protected', (req, res) => {
      res.json({ message: 'Hoorayyy! Welcome to TrackBy!' });
    });

    /* Feed */
    router.get('/feed/comments', CommentController.readUserComments);
    router.get('/feed/reactions', ReactionController.readUserReactions);
    router.get('/feed/watches', WatchController.readUserWatches);
    /* Feed */

    /* Show */

    //handles for all routes with shows
    router.use('/shows', Controller.handleAll);
   // router.get('/shows', Controller.readAll);
   // router.get('/shows/:showid', Controller.readOne);

    router.post('/shows', Controller.create);   
    router.get('/shows', Controller.read);
    router.patch('/shows', Controller.update); // check this out!
    router.delete('/shows', Controller.delete);
    router.get('/shows/comments', Controller.readComments);
    router.post('/shows/comments', Controller.createComment);
    router.get('/shows/comments/:commentid', Controller.readComment);
    router.post('/shows/watch', Controller.markAsWatched);
    router.delete('/shows/watch', Controller.unmarkWatch);
    router.post('/shows/rate', Controller.rate);
    router.patch('/shows/rate', Controller.changeRate);
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

    router.get('/user/:username/friends', FriendshipController.showFriends);
    router.get('/friendships/requests/', AuthController.protect, FriendshipController.showFriendshipRequests);
    router.get('/friendships/show/', FriendshipController.showFriendshipRelation);
    router.post('/friendships/create', FriendshipController.sendFriendshipRequest);
    router.patch('/friendships/update', FriendshipController.updateFriendshipStatus);
    router.delete('/friendships/remove', FriendshipController.removeFriend);

    router.get('/user/:userid/profile-photo', UploadController.retrieveProfilePhoto);
    router.post('/upload', UploadController.uploadProfilePhoto);
    router.delete('/upload', UploadController.removeProfilePhoto);

    router.post('/search', SearchController.search);
  }
}
