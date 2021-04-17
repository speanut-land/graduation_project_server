import { Context } from 'koa';
import { getManager, Repository, Not, Equal, Like } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { User } from '../entity';

export default class UserController {
	static async getUser(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);

		const user: User | undefined = await userRepository.findOne(+ctx.params.id || 0);

		if (user) {
			ctx.status = 200;
			ctx.body = user;
		} else {
			ctx.status = 400;
			ctx.body = "The user you are trying to retrieve doesn't exist in the db";
		}
	}

	static async createUser(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);

		const userToBeSaved: User = new User();
		userToBeSaved.username = ctx.request.body.username;
		userToBeSaved.password = ctx.request.body.password;
		userToBeSaved.address = ctx.request.body.address;

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
		userToBeUpdated.id = +ctx.params.id || 0;
		userToBeUpdated.username = ctx.request.body.username;
		userToBeUpdated.password = ctx.request.body.password;
		const errors: ValidationError[] = await validate(userToBeUpdated);
		if (errors.length > 0) {
			ctx.status = 400;
			ctx.body = errors;
		} else if (!(await userRepository.findOne(userToBeUpdated.id))) {
			ctx.status = 400;
			ctx.body = "The user you are trying to update doesn't exist in the db";
		} else if (
			await userRepository.findOne({ id: Not(Equal(userToBeUpdated.id)), username: userToBeUpdated.username })
		) {
			ctx.status = 400;
			ctx.body = 'The specified e-mail address already exists';
		} else {
			const user = await userRepository.save(userToBeUpdated);
			ctx.status = 201;
			ctx.body = user;
		}
	}
}
