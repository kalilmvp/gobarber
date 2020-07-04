import RequestError from '@shared/errors/RequestError';
import 'reflect-metadata';
import FakeUserRepository from '../infra/repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let service: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    service = new ShowProfileService(fakeUserRepository);
  });
  it('should be able to show profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    const show_user = await service.execute({ user_id: user.id });

    expect(show_user.name).toBe('John Doe');
    expect(show_user.email).toBe('johndoe@gmail.com');
  });

  it('should not be able to show profile if user does not exist', async () => {
    await expect(
      service.execute({ user_id: 'user-does-not-exist' }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
