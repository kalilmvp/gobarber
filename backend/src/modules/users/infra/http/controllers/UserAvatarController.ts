import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async create(req: Request, res: Response): Promise<Response> {
    const service = container.resolve(UpdateUserAvatarService);
    const user = await service.execute({
      user_id: req.user.id,
      avatarFileName: req.file.filename,
    });

    return res.json(classToClass(user));
  }
}
