import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import ensureAuthenticatedUser from '../middlewares/ensureAuthenticatedUser';

const routes = Router();

const profileController = new ProfileController();

routes.use(ensureAuthenticatedUser);

routes.get('/', profileController.show);
routes.put('/', profileController.update);

export default routes;
