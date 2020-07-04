import 'reflect-metadata';
import ListProvidersMonthAvailabilityService from './ListProvidersMonthAvailabilityService';
import FakeAppointmentsRepository from '../infra/repositories/fakes/FakeAppointmentRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let service: ListProvidersMonthAvailabilityService;

describe('ListProvidersMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    service = new ListProvidersMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 )
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 - JAVASCRIPT OBJECT )
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 - JAVASCRIPT OBJECT )
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 - JAVASCRIPT OBJECT )
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 - JAVASCRIPT OBJECT )
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 - JAVASCRIPT OBJECT )
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 - JAVASCRIPT OBJECT )
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 - JAVASCRIPT OBJECT )
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 - JAVASCRIPT OBJECT )
      date: new Date(2020, 4, 20, 16, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 - JAVASCRIPT OBJECT )
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user-id',
      // month May ( 4, because it starts on 0 )
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await service.execute({
      provider_id: 'user',
      year: 2020,
      // correct month, because it´s passed by the user
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
