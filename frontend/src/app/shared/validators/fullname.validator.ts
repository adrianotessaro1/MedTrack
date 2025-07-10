import { FormControl, ValidationErrors } from '@angular/forms';

//Allow only letters, might be uppercase or lowercase
//At least 3 characters for firstName
//An space to indicate the lastName
//Then at least 1 character for lastName
const FULL_NAME_REGEX: RegExp = /^[a-zA-ZÀ-ú1-9]{3,} [a-zA-ZÀ-ú1-9]{1,}/;
const FULL_NAME_VALIDATION_ERROR: { fullNameError: string } = { fullNameError: 'validators.fullName' };

const COMPLETE_FULL_NAME_VALIDATION_ERROR: ValidatorErrors = {
    completeFullNameError: 'validators.completeFullName',
    alphaNumeric: 'validators.alphaNumeric'
};

export function fullNameValidator(control: FormControl): ValidationErrors | null {
    return FULL_NAME_REGEX.test(control.value) ? null : FULL_NAME_VALIDATION_ERROR;
}

export function completeFullNameValidator(): (control: FormControl) => ValidationErrors | null {
    return function (control: FormControl): ValidationErrors | null {
        const value: string = control.value || '';
        const trimmedValue: string = value.trim();

        if (!trimmedValue || trimmedValue === null || trimmedValue === '') {
            return null;
        }

        if (!/^[a-zA-ZÀ-ú\s]*$/.test(trimmedValue)) {
            return { alphaNumeric: COMPLETE_FULL_NAME_VALIDATION_ERROR.alphaNumeric };
        }

        const fullNameError: ValidationErrors | null = fullNameValidator(control);
        if (fullNameError) {
            return { completeFullNameError: COMPLETE_FULL_NAME_VALIDATION_ERROR.completeFullNameError };
        }

        return null;
    };
}

export interface ValidatorErrors {
    completeFullNameError?: string;
    alphaNumeric?: string;
}