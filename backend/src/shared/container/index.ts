import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointmentRepository from '@modules/appointments/infra/repositories/IAppointmentRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import IUserRepository from '@modules/users/infra/repositories/IUserRepository';
import UserTokenRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';
import IUserTokenRepository from '@modules/users/infra/repositories/IUserTokenRepository';
import NotificationRepository from '@modules/notifications/infra/typeorm/repositories/NotificationRepository';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';

container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository,
);
container.registerSingleton<IAppointmentRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);
container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  NotificationRepository,
);
