import Koa from 'koa';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import winston from 'winston';
import { Context } from 'koa';
import { createConnection } from 'typeorm';
import 'reflect-metadata';

import { logger } from './logger';
import { config } from './config';
import { unprotectedRouter } from './unprotectedRoutes';
import { protectedRouter } from './protectedRoutes';
import { cron } from './cron';

import { User, Goods } from './entity';
import { sessionStorage } from './global';

const serve = require('koa-static');

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
createConnection({
	type: 'mysql',
	host: 'localhost',
	database: 'goods',
	port: 3306,
	username: 'root',
	password: 'pang12138',
	synchronize: true,
	logging: false,
	entities: [User, Goods],
})
	.then(async () => {
		const app = new Koa();

		// Provides important security headers to make your app more secure
		app.use(helmet());

		// Enable cors with default options
		app.use(cors());

		// Logger middleware -> use winston as logger (logging.ts with config)
		app.use(logger(winston));

		app.use(serve('.'));

		// Enable bodyParser with default options
		app.use(bodyParser());

		// these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
		app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

		// app.use(async (ctx: Context, next) => {
		// 	const sid = ctx.cookies.get('sid');
		// 	if (!sessionStorage.has(sid)) {
		// 		ctx.throw(401, 'no auth');
		// 	}
		// 	await next();
		// });
		app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

		cron.start();

		app.listen(config.port);

		console.log(`Server running on port ${config.port}`);
	})
	.catch((error: string) => console.log('TypeORM connection error: ', error));
