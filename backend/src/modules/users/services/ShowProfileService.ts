import User from '@modules/users/infra/typeorm/entities/User';
import RequestError from '@shared/errors/RequestError';
import { inject, injectable } from 'tsyringe';
import IUserRepository from '../infra/repositories/IUserRepository';

interface IRequestDTO {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<User> {
    const user = await this.repository.findById(user_id);

    if (!user) {
      throw new RequestError('User does not exist');
    }

    return user;
  }
}

export default ShowProfileService;
