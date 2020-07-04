import User from '@modules/users/infra/typeorm/entities/User';
import RequestError from '@shared/errors/RequestError';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '../infra/repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequestDTO): Promise<User> {
    if (await this.repository.findByEmail(email)) {
      throw new RequestError('Email address already added!');
    }

    const hashed_password = await this.hashProvider.generateHash(password);

    const user = await this.repository.create({
      name,
      email,
      password: hashed_password,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;
