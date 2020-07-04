import 'reflect-metadata';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import RequestError from '@shared/errors/RequestError';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../infra/repositories/fakes/FakeAppointmentRepository';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;
let service: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();
    service = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await service.execute({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 10, 12),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });
  it('should not be able to create two appointments at the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await service.execute({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 10, 12),
    });

    await expect(
      service.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 12),
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      service.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 11),
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
  it('should not be able to create an appointment when the user and the provider are the same', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      service.execute({
        provider_id: 'user-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 12),
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
  it('should not not be able to create an appointment before 8am and after 17pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      service.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 11, 7),
      }),
    ).rejects.toBeInstanceOf(RequestError);

    await expect(
      service.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 11, 18),
      }),
    ).rejects.toBeInstanceOf(RequestError);
  });
});
