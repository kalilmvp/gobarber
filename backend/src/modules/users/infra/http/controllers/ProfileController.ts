import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const service = container.resolve(ShowProfileService);
    const user = await service.execute({
      user_id: req.user.id,
    });

    return res.json(classToClass(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, old_password, password } = req.body;
    const service = container.resolve(UpdateProfileService);
    const user = await service.execute({
      user_id: req.user.id,
      name,
      email,
      old_password,
      password,
    });

    return res.json(classToClass(user));
  }
}
