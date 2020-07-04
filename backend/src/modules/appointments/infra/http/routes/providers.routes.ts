import ensureAuthenticatedUser from '@modules/users/infra/http/middlewares/ensureAuthenticatedUser';
import { Router } from 'express';
import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const routes = Router();

routes.use(ensureAuthenticatedUser);

const controller = new ProvidersController();
const monthController = new ProviderMonthAvailabilityController();
const dayController = new ProviderDayAvailabilityController();

routes.get('/', controller.index);
routes.post('/:provider_id/month-availability', monthController.index);
routes.post('/:provider_id/day-availability', dayController.index);

export default routes;
