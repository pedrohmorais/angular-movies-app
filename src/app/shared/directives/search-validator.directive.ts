import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appSearchValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SearchValidatorDirective,
      multi: true
    }
  ]
})
export class SearchValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    // Validation 1: Minimum 3 characters
    if (value.length < 3) {
      errors['minLength'] = { requiredLength: 3, actualLength: value.length };
    }

    // Validation 2: Only alphanumeric
    const alphanumericRegex = /^[a-zA-Z0-9\s]*$/;
    if (!alphanumericRegex.test(value)) {
      errors['alphanumeric'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}
