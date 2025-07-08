import { Component, forwardRef, inject, input } from '@angular/core';
import { SharedModule } from '../../shared.module';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormGroup,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

type InputTypes = 'text' | 'email' | 'password';

@Component({
  selector: 'app-primary-input',
  imports: [SharedModule, TranslateModule],
  // Tells Angular that "this component can be used as a form control"
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true,
    },
  ],
  templateUrl: './primary-input.component.html',
  styleUrl: './primary-input.component.scss',
})
export class PrimaryInputComponent implements ControlValueAccessor {
  // By implementing the ControlValueAcessor, this component becomes a drop-in form control

  public readonly inputType = input<InputTypes>('text');
  public readonly inputPlaceholder = input<string>('');
  public readonly label = input<string>('');
  public readonly iconName = input<string>('');
  public readonly inputName = input<string>('');
  public readonly errorsValidators = input<Array<string>>([]);

  // Inject the parent FromGroupDirective (this is done to avoid circular DI using ControlContainer and viewProvider)
  private readonly formGroupDirective = inject(FormGroupDirective);
  public get form(): FormGroup {
    return this.formGroupDirective.control as FormGroup;
  }

  // Builds a dictionary with the specific error and the label for the translate
  public readonly errorMap: Record<string, string> = {
    required: 'errorHint.mandatory',
    pattern: 'errorHint.email',
    dateOrder: 'errorHint.dateOrder',
    fullName: 'errorHint.fullName',
    minlength: 'errorHint.minLength',
    maxlength: 'errorHint.maxLength',
  };

  public get control(): AbstractControl | null {
    return this.form.get(this.inputName());
  }

  public get errorKeys(): string[] {
    const errors = this.control?.errors;
    return errors ? Object.keys(errors) : [];
  }

  // Form Control value
  public value: string = '';

  // Placeholder for the functions Angular will register:
  public onChange: any = () => {};
  public onTouch: any = () => {};

  // Called on each keystroke. Stash the new string, and notify Angular's form that the control value changed
  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  // ControlValueAccessor: write value from parent form into this component
  public writeValue(value: any): void {
    this.value = value;
  }

  // ControlValueAcessor: called by Angular when the formControl is created
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // "Touched" notifier given by Angular
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // Handle Disabled State
  public setDisabledState(isDisabled: boolean): void {}
}
