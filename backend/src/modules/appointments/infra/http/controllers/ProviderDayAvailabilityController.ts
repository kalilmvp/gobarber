import ListProvidersDayAvailabilityService from '@modules/appointments/services/ListProvidersDayAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderDayAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { provider_id } = req.params;
    const { month, year, day } = req.body;

    const service = container.resolve(ListProvidersDayAvailabilityService);
    return res.json(await service.execute({ provider_id, month, year, day }));
  }
}
