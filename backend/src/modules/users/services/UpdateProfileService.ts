import User from '@modules/users/infra/typeorm/entities/User';
import RequestError from '@shared/errors/RequestError';
import { inject, injectable } from 'tsyringe';
import IUserRepository from '../infra/repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequestDTO): Promise<User> {
    const user = await this.repository.findById(user_id);
    if (!user) {
      throw new RequestError('User does not exist');
    }

    const userWithEmail = await this.repository.findByEmail(email);

    if (userWithEmail && userWithEmail.id !== user.id) {
      throw new RequestError('Email already being used');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new RequestError('Old password must be informed');
    }

    if (password && old_password) {
      const checkedPassword = await this.hashProvider.compare(
        old_password,
        user.password,
      );
      if (!checkedPassword) {
        throw new RequestError('Old password is wrong');
      }
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.repository.save(user);
  }
}

export default UpdateProfileService;
