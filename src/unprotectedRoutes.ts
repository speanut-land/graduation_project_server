import Router from '@koa/router';
import { general } from './controller';
import { user } from './controller';

const unprotectedRouter = new Router();

// Hello World route
unprotectedRouter.get('/', general.helloWorld);

unprotectedRouter.post('/user/login', user.userLogin);

export { unprotectedRouter };
