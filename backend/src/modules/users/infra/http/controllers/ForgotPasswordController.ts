import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    const service = container.resolve(SendForgotPasswordEmailService);
    await service.execute({
      email,
    });

    return res.status(204).send();
  }
}
