import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { token, password } = req.body;
    const service = container.resolve(ResetPasswordService);
    await service.execute({
      token,
      password,
    });

    return res.status(204).send();
  }
}
