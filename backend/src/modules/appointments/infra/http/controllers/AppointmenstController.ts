import { Request, Response } from 'express';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

export default class AppointmentsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { provider_id, date } = req.body;

    const parsedDate = parseISO(date);

    const service = container.resolve(CreateAppointmentService);
    return res.json(
      await service.execute({ provider_id, user_id, date: parsedDate }),
    );
  }
}
