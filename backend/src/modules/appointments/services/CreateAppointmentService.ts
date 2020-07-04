import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import RequestError from '@shared/errors/RequestError';
import { format, getHours, isBefore, startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentRepository from '../infra/repositories/IAppointmentRepository';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentRepository,
    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (user_id === provider_id) {
      throw new RequestError('An appointment cannot be created for yourself');
    }

    if (
      await this.appointmentRepository.findByDate(appointmentDate, provider_id)
    ) {
      throw new RequestError('This appointment is already booked!');
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new RequestError(
        'It´s not permitted to make appointments on the past',
      );
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new RequestError(
        'You can only create appointments between 8am and 17pm',
      );
    }

    const appointment = await this.appointmentRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const notificationDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento ${notificationDate}h`,
    });

    const cachedKey = `provider-appointments:${provider_id}:${format(
      appointmentDate,
      'yyyy-M-d',
    )}`;

    await this.cacheProvider.invalidate(cachedKey);

    return appointment;
  }
}

export default CreateAppointmentService;
