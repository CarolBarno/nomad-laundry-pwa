import { Directive, forwardRef, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { SharedService } from './shared.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

//sign in email validation
@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorEmail implements AsyncValidator {

  constructor(private sharedService: SharedService) { }

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.sharedService.isEmailRegistered(ctrl.value).then(
      isTaken => (isTaken === false ? { emailRegistered: true } : null),
      catchError(() => of(null))
    );
  }

}

@Directive({
  selector: '[appEmailRegistered]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => AsyncValidatorEmail),
      multi: true
    }
  ]
})
export class EmailLoginCheckDirective {

  constructor(private validator: AsyncValidatorEmail) { }

  validate(control: AbstractControl) {
    this.validator.validate(control);
  }
}

