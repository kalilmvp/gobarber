import RequestError from '@shared/errors/RequestError';
import 'reflect-metadata';
import FakeUserRepository from '../infra/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let service: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    service = new UpdateProfileService(fakeUserRepository, fakeHashProvider);
  });
  it('should be able to update profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    const updatedUser = await service.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@gmail.com',
    });

    expect(updatedUser.name).toBe('John Tre');
    expect(updatedUser.email).toBe('johntre@gmail.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    const user2 = await fakeUserRepository.create({
      name: 'Test',
      email: 'test@gmail.com',
      password: '123123',
    });

    await expect(
      service.execute({
        user_id: user2.id,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const updatedUser = await service.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@gmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password if the user does not exist', async () => {
    await expect(
      service.execute({
        user_id: 'user-does-not-exist',
        name: 'John Tre',
        email: 'johntre@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should not be able to update the password if the old one is not informed', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      service.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'johntre@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should not be able to update the password if the old one is incorrect', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      service.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'johntre@gmail.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
