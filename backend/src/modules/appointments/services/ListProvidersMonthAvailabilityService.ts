import IAppointmentRepository from '@modules/appointments/infra/repositories/IAppointmentRepository';
import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
}

type IResponseDTO = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProvidersMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequestDTO): Promise<IResponseDTO> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: daysInMonth },
      // index + 1 because the days in month start with 1
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      return {
        day,
        // the day can only have the maximum of 10 appointments ( 08 - 17:00 ),
        // so if the length is lower than 10, there is availability on that day
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}
