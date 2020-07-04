import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import IAppointmentRepository from '../infra/repositories/IAppointmentRepository';

interface IRequestDTO {
  provider_id: string;
  year: number;
  month: number;
  day: number;
}

@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private repository: IAppointmentRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequestDTO): Promise<Appointment[]> {
    const cachedKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;
    let appointmentsInDayFromProvider = await this.cacheProvider.recover<
      Appointment[]
    >(cachedKey);

    if (!appointmentsInDayFromProvider) {
      appointmentsInDayFromProvider = await this.repository.findAllInDayFromProvider(
        {
          provider_id,
          year,
          month,
          day,
        },
      );

      await this.cacheProvider.save(
        cachedKey,
        classToClass(appointmentsInDayFromProvider),
      );
    }

    return appointmentsInDayFromProvider;
  }
}
