import { Context } from 'koa';
import { getManager, Repository, Not, Equal, Like } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { User } from '../entity';
import { uuidv4 } from '../util';
import { ResponseCode, sessionStorage, ResponseMsg } from '../global';

export default class UserController {
	static async getUsers(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);
		const users: User[] | undefined = await userRepository.find();

		if (users) {
			ctx.status = 200;
			ctx.body = {
				code: ResponseCode.Success,
				result: users,
			};
		} else {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.UserIsNotExist,
				message: ResponseMsg.UserIsNotExist,
			};
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
			ctx.body = {
				code: ResponseCode.Error,
				message: errors,
			};
		} else if (await userRepository.findOne({ username: userToBeSaved.username })) {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.UserIsExist,
				message: ResponseMsg.UserIsExist,
			};
		} else if (await userRepository.findOne({ email: userToBeSaved.email })) {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.EmailIsExist,
				message: ResponseMsg.EmailIsExist,
			};
		} else {
			await userRepository.save(userToBeSaved);
			ctx.status = 201;
			ctx.body = {
				code: ResponseCode.Success,
				message: ResponseMsg.Create,
			};
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
			ctx.body = {
				code: ResponseCode.Error,
				message: errors,
			};
		} else if (!(await userRepository.findOne(userToBeUpdated.id))) {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.UserIsExist,
				message: ResponseMsg.UserIsExist,
			};
		} else if (await userRepository.findOne(userToBeUpdated.username)) {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.UserNameIsExist,
				message: ResponseMsg.UserNameIsExist,
			};
		} else {
			await userRepository.save(userToBeUpdated);
			ctx.status = 200;
			ctx.body = {
				code: ResponseCode.Success,
				message: ResponseMsg.Update,
			};
		}
	}

	static async deleteUser(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);
		const userToRemove: User | undefined = await userRepository.findOne(+ctx.request.body.id);
		if (!userToRemove) {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.UserIsNotExist,
				message: ResponseMsg.UserIsNotExist,
			};
		} else {
			await userRepository.remove(userToRemove);
			ctx.status = 200;
			ctx.body = {
				code: ResponseCode.Success,
				message: ResponseMsg.Delete,
			};
		}
	}

	static async resetUserPassword(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);
		const { password, email } = ctx.request.body;
		const userToResetPwd: User | undefined = await userRepository.findOne({ email });
		if (!userToResetPwd) {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.EmailIsNotExist,
				message: ResponseMsg.EmailIsNotExist,
			};
		} else {
			userToResetPwd.password = password;
			await userRepository.save(userToResetPwd);
			ctx.status = 200;
			ctx.body = {
				code: ResponseCode.Success,
				message: ResponseMsg.Update,
			};
		}
	}

	static async userLogin(ctx: Context): Promise<void> {
		const userRepository: Repository<User> = getManager().getRepository(User);

		const { username, password, isRemember } = ctx.request.body;
		const user = await userRepository.findOne({ username });
		if (!user) {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.UserIsNotExist,
				message: ResponseMsg.UserIsNotExist,
			};
		} else if (password !== user.password) {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.PasswordError,
				message: ResponseMsg.PasswordError,
			};
		} else {
			if (isRemember) {
				const uuid = uuidv4();
				sessionStorage.set(uuid, user);
				ctx.cookies.set('sid', uuid, {
					maxAge: 24 * 60 * 1000, // cookie有效时长
					httpOnly: false, // 是否只用于http请求中获取
				});
			}
			ctx.status = 200;
			ctx.body = {
				code: ResponseCode.Success,
				message: ResponseMsg.LoginSuccess,
				result: { userInfo: user },
			};
		}
	}
}
