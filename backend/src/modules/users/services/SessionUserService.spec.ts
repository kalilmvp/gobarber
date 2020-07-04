import RequestError from '@shared/errors/RequestError';
import 'reflect-metadata';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '../infra/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import SessionUserService from './SessionUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let sessionService: SessionUserService;
let userService: CreateUserService;

describe('SessionUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    sessionService = new SessionUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    userService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to authenticate', async () => {
    const user = await userService.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '123123',
    });

    const response = await sessionService.execute({
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with a non-existing user', async () => {
    await expect(
      sessionService.execute({
        email: 'johndoe@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('should not be able to authenticate with an invalid password', async () => {
    await userService.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '123123',
    });

    await expect(
      sessionService.execute({
        email: 'johndoe@gmail.com',
        password: 'abc123',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
