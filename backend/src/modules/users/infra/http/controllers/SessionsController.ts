import { Response, Request } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import SessionUserService from '@modules/users/services/SessionUserService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const service = container.resolve(SessionUserService);
    const { user, token } = await service.execute({
      email,
      password,
    });

    return res.json({ user: classToClass(user), token });
  }
}
