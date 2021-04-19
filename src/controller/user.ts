import { Context } from 'koa';
import { getManager, Repository, Not, Equal, Like } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { User } from '../entity';
import { uuidv4 } from '../util';
import { sessionStorage } from '../global';

export default class UserController {
	static async getUsers(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);
		const user: User[] | undefined = await userRepository.find();

		if (user) {
			ctx.status = 200;
			ctx.body = user;
		} else {
			ctx.status = 400;
			ctx.body = '用户不存在';
		}
	}

	static async createUser(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);

		const userToBeSaved: User = new User();
		userToBeSaved.username = ctx.request.body.username;
		userToBeSaved.password = ctx.request.body.password;
		userToBeSaved.email = ctx.request.body.email;

		const errors: ValidationError[] = await validate(userToBeSaved);

		if (errors.length > 0) {
			ctx.status = 400;
			ctx.body = errors;
		} else if (await userRepository.findOne({ username: userToBeSaved.username })) {
			ctx.status = 400;
			ctx.body = '用户已存在';
		} else {
			const user = await userRepository.save(userToBeSaved);
			ctx.status = 201;
			ctx.body = user;
		}
	}

	static async updateUser(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);
		const userToBeUpdated: User = new User();
		userToBeUpdated.id = +ctx.request.body.id;
		userToBeUpdated.username = ctx.request.body.username;
		userToBeUpdated.password = ctx.request.body.password;
		userToBeUpdated.email = ctx.request.body.email;
		const errors: ValidationError[] = await validate(userToBeUpdated);
		if (errors.length > 0) {
			ctx.status = 400;
			ctx.body = errors;
		} else if (!(await userRepository.findOne(userToBeUpdated.id))) {
			ctx.status = 400;
			ctx.body = '用户不存在';
		} else if (await userRepository.findOne(userToBeUpdated.username)) {
			ctx.status = 400;
			ctx.body = '用户名已存在';
		} else {
			console.log(1);
			const user = await userRepository.save(userToBeUpdated);
			ctx.status = 201;
			ctx.body = user;
		}
	}

	static async deleteUser(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);
		const userToRemove: User | undefined = await userRepository.findOne(+ctx.request.body.id);
		if (!userToRemove) {
			ctx.status = 400;
			ctx.body = '用户不存在';
		} else {
			await userRepository.remove(userToRemove);
			ctx.status = 200;
			ctx.body = { code: 0, success: true };
		}
	}

	static async userLogin(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);

		const { username, password } = ctx.request.body;
		const user = await userRepository.findOne({ username });
		if (!user) {
			ctx.status = 400;
			ctx.body = '用户名不存在';
		} else if (password !== user.password) {
			ctx.status = 400;
			ctx.body = '密码出错';
		} else {
			ctx.status = 200;
			const uuid = uuidv4();
			sessionStorage.set(uuid, user);
			ctx.cookies.set('sid', uuid, {
				maxAge: 24 * 60 * 1000, // cookie有效时长
				httpOnly: false, // 是否只用于http请求中获取
			});
			ctx.body = '登陆成功';
		}
	}
}
