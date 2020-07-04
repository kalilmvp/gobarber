import uploadConfig from '@config/upload';
import fs from 'fs';
import path from 'path';
import IStorageProvider from '../models/IStorageProvider';

export default class DisktStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tempFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    // if the file is found, the stat will return NO ERROR, this way you can unlink
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
