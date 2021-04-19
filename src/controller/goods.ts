import { Context } from 'koa';
import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { Goods } from '../entity';

export default class GoodsController {
	static async getAllGoods(ctx: Context): Promise<void> {
		const goodsRepository: Repository<Goods> = getManager().getRepository(Goods);
		const goodsAllList: Goods[] | undefined = await goodsRepository.find({
			where: { goods_seller_id: ctx.request.query.goods_seller_id },
		});

		if (goodsAllList.length) {
			ctx.status = 200;
			ctx.body = goodsAllList;
		} else {
			ctx.status = 400;
			ctx.body = '暂无商品';
		}
	}

	static async searchGoods(ctx: Context): Promise<void> {
		const goodsRepository: Repository<Goods> = getManager().getRepository(Goods);
	}

	static async createGoods(ctx: Context): Promise<void> {
		const goodsRepository: Repository<Goods> = getManager().getRepository(Goods);

		const GoodsToBeSaved: Goods = new Goods();
		GoodsToBeSaved.goods_name = ctx.request.body.goods_name;
		GoodsToBeSaved.goods_count = ctx.request.body.goods_count;
		GoodsToBeSaved.goods_from = ctx.request.body.goods_from;
		GoodsToBeSaved.goods_life = ctx.request.body.goods_life;
		GoodsToBeSaved.goods_birth_time = ctx.request.body.goods_birth_time;
		GoodsToBeSaved.goods_price = ctx.request.body.goods_price;
		GoodsToBeSaved.goods_category = ctx.request.body.goods_category;
		GoodsToBeSaved.goods_seller_id = ctx.request.body.goods_seller_id;

		const errors: ValidationError[] = await validate(GoodsToBeSaved);

		if (errors.length > 0) {
			ctx.status = 400;
			ctx.body = errors;
		} else if (await goodsRepository.findOne({ goods_name: GoodsToBeSaved.goods_name })) {
			ctx.status = 400;
			ctx.body = '商品已存在';
		} else {
			const Goods = await goodsRepository.save(GoodsToBeSaved);
			ctx.status = 201;
			ctx.body = Goods;
		}
	}

	static async updateGoods(ctx: Context): Promise<void> {
		const GoodsRepository: Repository<Goods> = getManager().getRepository(Goods);
		const GoodsToBeUpdated: Goods = new Goods();
		GoodsToBeUpdated.id = ctx.request.body.id;
		GoodsToBeUpdated.goods_name = ctx.request.body.goods_name;
		GoodsToBeUpdated.goods_count = ctx.request.body.goods_count;
		GoodsToBeUpdated.goods_from = ctx.request.body.goods_from;
		GoodsToBeUpdated.goods_life = ctx.request.body.goods_life;
		GoodsToBeUpdated.goods_birth_time = ctx.request.body.goods_birth_time;
		GoodsToBeUpdated.goods_price = ctx.request.body.goods_price;
		GoodsToBeUpdated.goods_category = ctx.request.body.goods_category;
		GoodsToBeUpdated.goods_seller_id = ctx.request.body.goods_seller_id;
		const errors: ValidationError[] = await validate(GoodsToBeUpdated);
		if (errors.length > 0) {
			ctx.status = 400;
			ctx.body = errors;
		} else if (!(await GoodsRepository.findOne(GoodsToBeUpdated.id))) {
			ctx.status = 400;
			ctx.body = '商品不存在';
		} else {
			const Goods = await GoodsRepository.save(GoodsToBeUpdated);
			ctx.status = 201;
			ctx.body = Goods;
		}
	}
	static async deleteGoods(ctx: Context): Promise<void> {
		const GoodsRepository: Repository<Goods> = getManager().getRepository(Goods);
		const goodsToRemove: Goods | undefined = await GoodsRepository.findOne(+ctx.request.query.id);
		if (!goodsToRemove) {
			ctx.status = 400;
			ctx.body = '用户不存在';
		} else {
			await GoodsRepository.remove(goodsToRemove);
			ctx.status = 200;
			ctx.body = { code: 0, success: true };
		}
	}
}
