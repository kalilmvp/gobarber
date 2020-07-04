import { classToClass } from 'class-transformer';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class AppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const service = container.resolve(ListProvidersService);
    return res.json(classToClass(await service.execute({ user_id })));
  }
}
