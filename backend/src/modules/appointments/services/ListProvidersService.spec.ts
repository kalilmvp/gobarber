import 'reflect-metadata';
import FakeUserRepository from '@modules/users/infra/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let fakeCacheProvider: FakeCacheProvider;
let service: ListProvidersService;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    service = new ListProvidersService(fakeUserRepository, fakeCacheProvider);
  });
  it('should be able to list the providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    const user2 = await fakeUserRepository.create({
      name: 'John Tre',
      email: 'johntre@gmail.com',
      password: '123123',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'John Qua',
      email: 'johntre@gmail.com',
      password: '123123',
    });

    const providers = await service.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});
