import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';

import { Routes } from './routes';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

      /**
       * Bootstrap the application.
       *
       * @class Server
       * @method bootstrap
       * @static
       * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
       */
      public static bootstrap(): Server {
        return new Server();
      }

      public app: express.Application;

      /**
       * Constructor.
       *
       * @class Server
       * @constructor
       */
      constructor() {
        this.app = express();
        this.config();
        this.routes();
      }

      /**
       * Configure application
       *
       * @class Server
       * @method config
       */
      public config() {

        // mount logger
        this.app.use(logger('dev'));

        // mount json form parser
        this.app.use(bodyParser.json());

        this.app.use(bodyParser.urlencoded({
          extended: true,
        }));

        // mount cookie parser middleware
        this.app.use(cookieParser('SECRET_GOES_HERE'));

        // catch 404 and forward to error handler
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            err.status = 404;
            next(err);
        });
    }
      /**
       * Create and return Router.
       *
       * @class Server
       * @method config
       * @return void
       */
      private routes() {
        let router: express.Router;
        router = express.Router();

        // IndexRoute
        Routes.create(router);

        // use router middleware
        this.app.use(router);
      }
    }
