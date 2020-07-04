import User from '@modules/users/infra/typeorm/entities/User';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import RequestError from '@shared/errors/RequestError';
import { inject, injectable } from 'tsyringe';
import IUserRepository from '../infra/repositories/IUserRepository';

interface IRequestDTO {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    avatarFileName,
  }: IRequestDTO): Promise<User> {
    const user = await this.repository.findById(user_id);

    if (!user) {
      throw new RequestError(
        'Only authenticated users can change the avatar.',
        401,
      );
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    user.avatar = await this.storageProvider.saveFile(avatarFileName);

    await this.repository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
