import { BaseContext } from 'koa';

export default class GeneralController {
	public static async helloWorld(ctx: BaseContext): Promise<void> {
		ctx.body = 'Hello World!';
	}
}
