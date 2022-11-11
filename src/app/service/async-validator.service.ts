import { Directive, forwardRef, Injectable, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, FormGroup, NG_ASYNC_VALIDATORS, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { SharedService } from './shared.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MustMatch } from '../components/common/register/password-match';

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

//password match
@Injectable({
  providedIn: 'root'
})

export class PasswordMatchValidator implements Validator {
  constructor() { }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return null;
  }
}

@Directive({
  selector: '[appPasswordMatch]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordMatchValidator),
      multi: true
    }
  ]
})

export class PasswordMatch {

  constructor(private validator: PasswordMatchValidator) { }

  validate(control: AbstractControl) {
    this.validator.validate(control);
  }
}

@Directive({
  selector: '[mustMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MustMatchDirective, multi: true }]
})
export class MustMatchDirective implements Validator {
  @Input('mustMatch') mustMatch: string[] = [];

  validate(formGroup: FormGroup): ValidationErrors {
    return MustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup);
  }
}

