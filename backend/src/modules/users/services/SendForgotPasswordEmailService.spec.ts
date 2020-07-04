import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import RequestError from '@shared/errors/RequestError';
import 'reflect-metadata';
import FakeUserRepository from '../infra/repositories/fakes/FakeUserRepository';
import FakeUserTokenRepository from '../infra/repositories/fakes/FakeUserTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('should be able to recover password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });
  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@gmail.com',
    });

    await expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
