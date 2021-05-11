import { Context } from 'koa';
import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { Dataset } from '../entity';
import { ResponseCode, ResponseMsg } from '../global';

export default class DatasetController {
	static async getDatasets(ctx: Context): Promise<void> {
		const datasetRepository: Repository<Dataset> = getManager().getRepository(Dataset);
		const datasets: Dataset[] | undefined = await datasetRepository.find({ user_id: +ctx.request.query.user_id });

		ctx.status = 200;
		ctx.body = {
			code: ResponseCode.Success,
			result: datasets,
		};
	}

	static async createDataset(ctx: Context): Promise<void> {
		const datasetRepository: Repository<Dataset> = getManager().getRepository(Dataset);

		const datasetToBeSaved: Dataset = new Dataset();
		datasetToBeSaved.title = ctx.request.body.title;
		datasetToBeSaved.dataset = JSON.stringify(ctx.request.body.dataset);
		datasetToBeSaved.user_id = +ctx.request.body.user_id;

		const errors: ValidationError[] = await validate(datasetToBeSaved);

		if (errors.length > 0) {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.Error,
				message: errors,
			};
		} else {
			await datasetRepository.save(datasetToBeSaved);
			ctx.status = 200;
			ctx.body = {
				code: ResponseCode.Success,
				message: ResponseMsg.Create,
			};
		}
	}

	static async deleteDataset(ctx: Context): Promise<void> {
		const datasetRepository: Repository<Dataset> = getManager().getRepository(Dataset);
		const datasetToRemove: Dataset | undefined = await datasetRepository.findOne(+ctx.request.body.id);
		if (!datasetToRemove) {
			ctx.status = 400;
			ctx.body = {
				code: ResponseCode.DatasetIsNotExist,
				message: ResponseMsg.DatasetIsNotExist,
			};
		} else {
			await datasetRepository.remove(datasetToRemove);
			ctx.status = 200;
			ctx.body = {
				code: ResponseCode.Success,
				message: ResponseMsg.Delete,
			};
		}
	}
}
