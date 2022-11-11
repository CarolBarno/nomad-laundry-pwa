import { Injectable } from '@angular/core';

declare let toastr: any;
export interface Toaster {
  "progressBar": boolean;
  "timeOut": number;
  "extendedTimeOut": number;
  "tapToDismiss": boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  toaster = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": 7000,
    "extendedTimeOut": 2000,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "onclick": null,
    "tapToDismiss": false
  }
  constructor() { }

  success(message: string, title?: string, config?: Toaster) {
    // Object.assign(this.toaster, config)
    toastr.options = this.toaster
    toastr.success(message, title)
  }

  info(message: string, title?: string, config?: Toaster) {
    Object.assign(this.toaster, config);
    toastr.options = this.toaster;
    toastr.info(message, title)
  }

  warning(message: string, title?: string, config?: Toaster) {
    toastr.options = this.toaster
    toastr.warning(message, title)
  }

  error(message: string, title?: string, config?: Toaster) {
    Object.assign(this.toaster, config);
    toastr.options = this.toaster
    toastr.error(message, title)
  }

  clear(): void {
    toastr.clear()
  }
}
