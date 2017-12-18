import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { Controller } from './controllers/Controller';
import { ShowController } from './controllers/ShowContoller';

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

		// allah muhammet aşkına şunu en sonda aktif edin test edemiyorum postları vs, productiona aldım o yüzden
		
		/* only active on production */
		if	(process.env.NODE_ENV === 'production') {
			router.use(AuthController.protect);			
		}

		/*
		* Below routes are protected and cannot be accessed without authentication token.
		* Place the resources that need login operation to be accessed below:
		*/

    router.post('/protected', (req, res) => {
      res.json({ message: 'Hoorayyy! Welcome to TrackBy!' });
    });

		router.get('/shows', ShowController.readShows);
		router.get('/shows/:showid', ShowController.readShow);
		router.get('/shows/:showid/comments', ShowController.readShowComments);
		router.get('/shows/:showid/comments/:commentid', ShowController.readShowComment);

		/*
		* Below routes are protected and cannot be accessed without authentication token + admin privileges
		* Place the resources that need both login operation and admin privileges to be accessed below:
		* (Also some routes may be accessed with 'get' by users but cannot be accessed with 'post', 'delete', 'patch')
		* Example: /protected is open for get requests but not for post requests.
		*/

		router.post('/shows/:showid/watch', ShowController.markAsWatched);	
		router.delete('/shows/:showid/watch', ShowController.unmarkWatch);	
		router.post('/shows/:showid/comments', ShowController.createShowComment);		
		router.delete('/shows/:showid', ShowController.deleteShow);
		router.post('/shows', ShowController.createShow);
	}
}
