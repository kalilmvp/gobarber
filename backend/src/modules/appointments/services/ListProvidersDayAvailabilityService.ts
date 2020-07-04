import IAppointmentRepository from '@modules/appointments/infra/repositories/IAppointmentRepository';
import { getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponseDTO = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProvidersDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequestDTO): Promise<IResponseDTO> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        month,
        year,
        day,
      },
    );

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const currenteDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        // if there is no appointment at the hour AND if the date passed is AFTER now
        available: !hasAppointmentInHour && isAfter(compareDate, currenteDate),
      };
    });

    return availability;
  }
}
