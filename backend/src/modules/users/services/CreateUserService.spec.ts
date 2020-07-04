import RequestError from '@shared/errors/RequestError';
import 'reflect-metadata';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '../infra/repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let service: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    service = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await service.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
  });
  it('should not be able to create a new user with the same email', async () => {
    await service.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '123123',
    });

    await expect(
      service.execute({
        email: 'johndoe@gmail.com',
        name: 'John Doe',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
