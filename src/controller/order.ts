import { Context } from 'koa';
import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { Order } from '../entity';

export default class OrderController {
	static async getAllOrder(ctx: Context): Promise<void> {
		const orderRepository: Repository<Order> = getManager().getRepository(Order);
		const orderAllList: Order[] | undefined = await orderRepository.find({
			where: { order_buyer_id: ctx.request.query.order_buyer_id },
		});

		if (orderAllList.length) {
			ctx.status = 200;
			ctx.body = orderAllList;
		} else {
			ctx.status = 400;
			ctx.body = '暂无订单';
		}
	}

	static async createOrder(ctx: Context): Promise<void> {
		const orderRepository: Repository<Order> = getManager().getRepository(Order);

		const orderToBeSaved: Order = new Order();
		orderToBeSaved.order_address = ctx.request.body.order_address;
		orderToBeSaved.order_buyer_id = ctx.request.body.order_buyer_id;
		orderToBeSaved.order_create_time = ctx.request.body.order_create_time;
		orderToBeSaved.order_finish_time = ctx.request.body.order_finish_time;
		orderToBeSaved.order_goods_id = ctx.request.body.order_goods_id;
		orderToBeSaved.order_seller_id = ctx.request.body.order_seller_id;

		const errors: ValidationError[] = await validate(orderToBeSaved);

		if (errors.length > 0) {
			ctx.status = 400;
			ctx.body = errors;
		} else {
			const order = await orderRepository.save(orderToBeSaved);
			ctx.status = 201;
			ctx.body = order;
		}
	}

	static async updateOrder(ctx: Context): Promise<void> {
		const orderRepository: Repository<Order> = getManager().getRepository(Order);
		const orderToBeUpdated: Order = new Order();
		orderToBeUpdated.id = ctx.request.body.id;
		orderToBeUpdated.order_address = ctx.request.body.order_address;
		orderToBeUpdated.order_buyer_id = ctx.request.body.order_buyer_id;
		orderToBeUpdated.order_create_time = ctx.request.body.order_create_time;
		orderToBeUpdated.order_finish_time = ctx.request.body.order_finish_time;
		orderToBeUpdated.order_goods_id = ctx.request.body.order_goods_id;
		orderToBeUpdated.order_seller_id = ctx.request.body.order_seller_id;
		const errors: ValidationError[] = await validate(orderToBeUpdated);
		if (errors.length > 0) {
			ctx.status = 400;
			ctx.body = errors;
		} else if (!(await orderRepository.findOne(orderToBeUpdated.id))) {
			ctx.status = 400;
			ctx.body = '订单不存在';
		} else {
			const order = await orderRepository.save(orderToBeUpdated);
			ctx.status = 201;
			ctx.body = order;
		}
	}
	static async deleteOrder(ctx: Context): Promise<void> {
		const orderRepository: Repository<Order> = getManager().getRepository(Order);
		const orderToRemove: Order | undefined = await orderRepository.findOne(+ctx.request.query.id);
		if (!orderToRemove) {
			ctx.status = 400;
			ctx.body = '订单不存在';
		} else {
			await orderRepository.remove(orderToRemove);
			ctx.status = 200;
			ctx.body = { code: 0, success: true };
		}
	}
}
