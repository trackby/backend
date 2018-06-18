import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { CommentController } from './controllers/CommentController';
import { Controller } from './controllers/Controller';
import { FeedController } from './controllers/FeedController';
import { FriendshipController } from './controllers/FriendshipController';
import { ReactionController } from './controllers/ReactionController';
import { SearchController } from './controllers/SearchController';
import { ShowController } from './controllers/ShowController';
import { UploadController } from './controllers/UploadController';
import { WatchController } from './controllers/WatchController';

/**
 * route
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
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PATCH, PUT');
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
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
    router.get('/feed', FeedController.readFeed);
    /* Feed */

    router.get('/reports', Controller.findReports);

    /* Show */

    // handles for all routes with shows
    router.use('/shows', Controller.handleAll);
    router.post('/shows', AuthController.role('ADMIN'), Controller.create);
    router.patch('/shows', AuthController.role('ADMIN'), Controller.update);
    router.delete('/shows', AuthController.role('ADMIN'), Controller.delete);
    router.get('/shows', Controller.read);
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
    router.post('/friendships/requests/:direction', FriendshipController.showFriendshipRequests);
    router.get('/friendships/show/', FriendshipController.showFriendshipRelation);
    router.post('/friendships/create', FriendshipController.sendFriendshipRequest);
    router.patch('/friendships/update', FriendshipController.updateFriendshipStatus);
    router.delete('/friendships/remove', FriendshipController.removeFriend);

    router.get('/photos/:category/:id', UploadController.retrievePhoto); // Example: /photos/tvshow/1
    router.post('/upload', UploadController.uploadPhoto);
    router.delete('/upload', AuthController.role('ADMIN'), UploadController.removePhoto);

    router.post('/search', SearchController.search);
  }
}
