import { Injectable } from '@angular/core';

function extName(fileName: string) {
  const extn = fileName.split('.').slice(-1)[0];
  return '.' + extn;
}

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  validateFileUploadType(fileName: string) {
    const extn = extName(fileName);
    const allowedImageExtns = ['.png', '.jpeg', '.jpg', '.webp'];

    if (extn === '.pdf') {
      return true;
    } else if (extn === '.docx') {
      return true;
    } else if (allowedImageExtns.includes(extn)) {
      return true;
    } else {
      return false;
    }
  }
}
