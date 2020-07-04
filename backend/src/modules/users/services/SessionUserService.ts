import authConfig from '@config/auth';
import User from '@modules/users/infra/typeorm/entities/User';
import RequestError from '@shared/errors/RequestError';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import IUserRepository from '../infra/repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponseDTO {
  user: User;
  token: string;
}

@injectable()
class SessionUserService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({
    email,
    password,
  }: IRequestDTO): Promise<IResponseDTO> {
    const foundUser = await this.repository.findByEmail(email);

    if (!foundUser) {
      throw new RequestError('Email/Password invalid!', 401);
    }

    if (!(await this.hashProvider.compare(password, foundUser.password))) {
      throw new RequestError('Email/Password invalid!', 401);
    }

    // gerando token jwt
    const token = sign({}, authConfig.jwt.token, {
      subject: foundUser.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return {
      user: foundUser,
      token,
    };
  }
}

export default SessionUserService;
