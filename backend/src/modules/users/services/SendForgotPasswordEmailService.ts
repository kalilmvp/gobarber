import path from 'path';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import RequestError from '@shared/errors/RequestError';
import { inject, injectable } from 'tsyringe';
import IUserRepository from '../infra/repositories/IUserRepository';
import IUserTokenRepository from '../infra/repositories/IUserTokenRepository';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
  ) { }

  public async execute({ email }: IRequestDTO): Promise<void> {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new RequestError('User does not exist');
    }

    const { token } = await this.userTokenRepository.generate(user.id);

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de Senha',
      templateData: {
        file: this.getFilePath(),
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
          token,
        },
      },
    });
  }

  getFilePath(): string {
    return path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');
  }
}

export default SendForgotPasswordEmailService;
