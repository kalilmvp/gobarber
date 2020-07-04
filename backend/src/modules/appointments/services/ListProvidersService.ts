import { classToClass } from 'class-transformer';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '@modules/users/infra/repositories/IUserRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import { inject, injectable } from 'tsyringe';

interface IRequestDTO {
  user_id: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({ user_id }: IRequestDTO): Promise<User[]> {
    const cacheKey = `providers-list:${user_id}`;
    let users = await this.cacheProvider.recover<User[]>(cacheKey);
    if (!users) {
      users = await this.repository.findAllProviders({
        except_user_id: user_id,
      });

      this.cacheProvider.save(cacheKey, classToClass(users));
    }

    return users;
  }
}
