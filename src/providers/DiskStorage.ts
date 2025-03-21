import fs from 'fs';
import path from 'path';
import { TMP_FOLDER, UPLOADS_FOLDER } from '../config/upload';

export class DiskStorage {
  async saveFile(file: Express.Multer.File): Promise<string> {
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file.filename),
      path.resolve(UPLOADS_FOLDER, file.filename)
    );

    return file.filename;
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.resolve(UPLOADS_FOLDER, filename);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}