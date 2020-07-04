import RequestError from '@shared/errors/RequestError';
import { inject, injectable } from 'tsyringe';
import { differenceInHours } from 'date-fns';
import IUserRepository from '../infra/repositories/IUserRepository';
import IUserTokenRepository from '../infra/repositories/IUserTokenRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new RequestError('Token does not exist');
    }

    const user = await this.userRepository.findById(userToken.user_id);

    if (!user) {
      throw new RequestError('User does not exist');
    }

    if (differenceInHours(Date.now(), userToken.created_at) > 2) {
      throw new RequestError('Token has expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);
  }
}

export default ResetPasswordService;
