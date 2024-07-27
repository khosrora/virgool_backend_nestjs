import { ParseFilePipe, UploadedFiles } from '@nestjs/common';

export function UploadFileOptional() {
  return UploadedFiles(
    new ParseFilePipe({ fileIsRequired: false, validators: [] }),
  ); 
}
