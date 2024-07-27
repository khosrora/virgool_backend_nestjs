import { Request } from 'express';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ValidationMessage } from 'src/modules/auth/enums/message.enum';

export type CallbackFileName = (error: Error, destination: string) => void;
export type CallbackDestination = (error: Error, destination: string) => void;
export type MulterFile = Express.Multer.File;

export function multerDestination(fieldName: string) {
  return function (
    req: Request,
    file: Express.Multer.File,
    callBack: CallbackDestination,
  ) {
    let path = join('public', 'uploads', fieldName);
    mkdirSync(path, { recursive: true });
    callBack(null, path);
  };
}

export function multerFileName(
  req: Request,
  file: Express.Multer.File,
  callBack: CallbackFileName,
) {
  const ext = extname(file.originalname).toLowerCase();
  if (!isValidFormatImage(ext)) {
    callBack(new Error(ValidationMessage.InvalidImageFormat), null);
  }
  const filename = `${Date.now()}${ext}`;
  callBack(null, filename);
}

function isValidFormatImage(ext: string) {
  return ['.png', '.jpeg', '.jpg'].includes(ext);
}

export function multerStorage(folderName: string) {
  return diskStorage({
    destination: multerDestination(folderName),
    filename: multerFileName,
  });
}
