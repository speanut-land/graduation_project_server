import Router from '@koa/router';
import { user } from './controller';

const protectedRouter = new Router();

// USER ROUTES
protectedRouter.get('/user', user.getUser);
protectedRouter.get('/user/:id', user.getUser);
protectedRouter.post('/user', user.createUser);
protectedRouter.put('/user/:id', user.updateUser);

export { protectedRouter };
