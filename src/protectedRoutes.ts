import Router from '@koa/router';
import { user, goods, order, address } from './controller';

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
protectedRouter.get('/order', order.getAllOrder);
protectedRouter.post('/order', order.createOrder);
protectedRouter.put('/order', order.updateOrder);
protectedRouter.delete('/order', order.deleteOrder);

// ADDRESS ROUTES
protectedRouter.get('/address', address.getAllAddress);
protectedRouter.post('/address', address.createAddress);
protectedRouter.put('/address', address.updateAddress);
protectedRouter.delete('/address', address.deleteAddress);
export { protectedRouter };
