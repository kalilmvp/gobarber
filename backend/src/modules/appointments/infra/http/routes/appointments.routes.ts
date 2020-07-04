import ensureAuthenticatedUser from '@modules/users/infra/http/middlewares/ensureAuthenticatedUser';
import { Router } from 'express';
import AppointmentsController from '../controllers/AppointmenstController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const routes = Router();

routes.use(ensureAuthenticatedUser);

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

routes.post('/', appointmentsController.create);
routes.post('/me', providerAppointmentsController.index);

export default routes;
