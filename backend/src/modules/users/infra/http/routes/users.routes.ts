import uploadConfig from '@config/upload';
import ensureAuthenticatedUser from '@modules/users/infra/http/middlewares/ensureAuthenticatedUser';
import { Router } from 'express';
import multer from 'multer';
import UserAvatarController from '../controllers/UserAvatarController';
import UsersController from '../controllers/UsersController';

const routes = Router();
const upload = multer(uploadConfig);

const userController = new UsersController();
const userAvatarController = new UserAvatarController();

routes.post('/', userController.create);

// use the patch protocol when you want to update a single information, not the whole object
routes.patch(
  '/avatar',
  ensureAuthenticatedUser,
  upload.single('avatar'),
  userAvatarController.create,
);

export default routes;
