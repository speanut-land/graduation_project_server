import { Context } from 'koa';
import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { Address } from '../entity';

export default class AddressController {
	static async getAllAddress(ctx: Context): Promise<void> {
		const AddressRepository: Repository<Address> = getManager().getRepository(Address);
		const addressAllList: Address[] | undefined = await AddressRepository.find({
			where: { Address_seller_id: ctx.request.query.Address_seller_id },
		});

		if (addressAllList.length) {
			ctx.status = 200;
			ctx.body = addressAllList;
		} else {
			ctx.status = 400;
			ctx.body = '暂无地址';
		}
	}

	static async createAddress(ctx: Context): Promise<void> {
		const AddressRepository: Repository<Address> = getManager().getRepository(Address);

		const AddressToBeSaved: Address = new Address();
		AddressToBeSaved.telephone = ctx.request.body.telephone;
		AddressToBeSaved.addressee = ctx.request.body.addressee;
		AddressToBeSaved.address_detail = ctx.request.body.address_detail;
		AddressToBeSaved.user_id = ctx.request.body.user_id;

		const errors: ValidationError[] = await validate(AddressToBeSaved);

		if (errors.length > 0) {
			ctx.status = 400;
			ctx.body = errors;
		} else {
			const address = await AddressRepository.save(AddressToBeSaved);
			ctx.status = 201;
			ctx.body = address;
		}
	}

	static async updateAddress(ctx: Context): Promise<void> {
		const AddressRepository: Repository<Address> = getManager().getRepository(Address);
		const addressToBeUpdated: Address = new Address();
		addressToBeUpdated.id = ctx.request.body.id;
		addressToBeUpdated.telephone = ctx.request.body.telephone;
		addressToBeUpdated.addressee = ctx.request.body.addressee;
		addressToBeUpdated.address_detail = ctx.request.body.address_detail;
		addressToBeUpdated.user_id = ctx.request.body.user_id;
		const errors: ValidationError[] = await validate(addressToBeUpdated);
		if (errors.length > 0) {
			ctx.status = 400;
			ctx.body = errors;
		} else if (!(await AddressRepository.findOne(addressToBeUpdated.id))) {
			ctx.status = 400;
			ctx.body = '地址不存在';
		} else {
			const Address = await AddressRepository.save(addressToBeUpdated);
			ctx.status = 201;
			ctx.body = Address;
		}
	}
	static async deleteAddress(ctx: Context): Promise<void> {
		const AddressRepository: Repository<Address> = getManager().getRepository(Address);
		const AddressToRemove: Address | undefined = await AddressRepository.findOne(+ctx.request.query.id);
		if (!AddressToRemove) {
			ctx.status = 400;
			ctx.body = '地址不存在';
		} else {
			await AddressRepository.remove(AddressToRemove);
			ctx.status = 200;
			ctx.body = { code: 0, success: true };
		}
	}
}
