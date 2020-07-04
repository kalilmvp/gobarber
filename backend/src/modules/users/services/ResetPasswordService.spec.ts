import 'reflect-metadata';
import RequestError from '@shared/errors/RequestError';
import FakeUserRepository from '../infra/repositories/fakes/FakeUserRepository';
import FakeUserTokenRepository from '../infra/repositories/fakes/FakeUserTokenRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashMailProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashMailProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokenRepository,
      fakeHashMailProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashMailProvider, 'generateHash');

    const newPassword = '123123aA';
    await resetPasswordService.execute({
      token,
      password: newPassword,
    });

    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith(newPassword);
    expect(updatedUser?.password).toBe(newPassword);
  });

  it('should not be able to reset the password for a non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123123aA',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should not be able to reset the password for a non-existing user', async () => {
    const { token } = await fakeUserTokenRepository.generate(
      'non-existing-user',
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: '123123aA',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should not be able to reset the password if it has already passed 2 hours', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: '123123aA',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
