import Router from '@koa/router';
import { user, goods, dataset } from './controller';

const protectedRouter = new Router();

// USER ROUTES
protectedRouter.get('/user', user.getUsers);
protectedRouter.post('/user', user.createUser);
protectedRouter.put('/user', user.updateUser);
protectedRouter.delete('/user', user.deleteUser);
protectedRouter.put('/updateUserPwd', user.resetUserPassword);

// GOODS ROUTES
protectedRouter.get('/goods', goods.getAllGoods);
protectedRouter.get('/goods/search', goods.searchGoods);
protectedRouter.post('/goods', goods.createGoods);
protectedRouter.put('/goods', goods.updateGoods);
protectedRouter.delete('/goods', goods.deleteGoods);

// ORDER ROUTES
protectedRouter.get('/dataset', dataset.getDatasets);
protectedRouter.post('/dataset', dataset.createDataset);
protectedRouter.delete('/dataset', dataset.deleteDataset);
export { protectedRouter };
