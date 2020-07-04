import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.user.id;
    const { year, month, day } = req.body;

    const service = container.resolve(ListProviderAppointmentsService);
    return res.json(
      classToClass(await service.execute({ provider_id, year, month, day })),
    );
  }
}
