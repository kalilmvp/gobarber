import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '..', '..', 'temp');

export default {
  tempFolder,
  uploadsFolder: path.resolve(tempFolder, 'uploads'),
  storage: multer.diskStorage({
    destination: tempFolder,
    filename(request, file, callback) {
      return callback(
        null,
        `${crypto.randomBytes(10).toString('HEX')}-${file.originalname}`,
      );
    },
  }),
};
