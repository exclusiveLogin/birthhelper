import { FormGroup, ValidatorFn } from "@angular/forms";

export function requiredOneOfList(list: string[]): ValidatorFn {
    return function validate(formGroup: FormGroup) {
        let valid = false;

        list.forEach((key) => {
            const control = formGroup.controls[key];

            if (!!control.value) {
                valid = true;
            }
        });
        return valid ? null : { requiredOneOfList: true };
    };
}
