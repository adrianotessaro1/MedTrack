import { Component, forwardRef, inject, input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { TranslationConstants } from '../../../services/translation.service';
import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'app-datepicker-input',
  imports: [SharedModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerInputComponent),
      multi: true
    }
  ],
  templateUrl: './datepicker-input.component.html',
  styleUrl: './datepicker-input.component.scss'
})
export class DatepickerInputComponent implements ControlValueAccessor {
  // By implementing the ControlValueAcessor, this component becomes a drop-in form control

  @ViewChild('pickerDateOfBirth', { static: false }) public pickerDateOfBirth!: MatDatepicker<Date>;
  public readonly inputPlaceholder = input.required<string>();
  public readonly label = input<string>('');
  public readonly mandatory = input<boolean>(true);
  public readonly inputName = input.required<string>();
  public readonly withLabel = input<boolean>(true);

  // Builds a dictionary with the specific error and the label for the translate
  public readonly errorMap: Record<string, string> = {
    required: 'errorHint.mandatory',
    dateOrder: 'errorHint.dateOrder',
  };

  // Inject the parent FromGroupDirective (this is done to avoid circular DI using ControlContainer and viewProvider)
  private readonly formGroupDirective = inject(FormGroupDirective);
  public get form(): FormGroup {
    return this.formGroupDirective.control as FormGroup;
  }

  constructor(public readonly translationConstants: TranslationConstants) { }

  // Called when the user selects a date from the calendar
  public onDateSelected(date: Date | null): void {
    // 1) Update your local display value (optional formatting)
    this.value = date ? date.toISOString().slice(0, 10) : '';

    // 2) Tell Angular forms that the control’s value changed
    this.onChange(date);
  }

  public dateFilter = (date: Date | null): boolean => {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    return date ? date <= eighteenYearsAgo : false;
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
  public onChange: any = () => { };
  public onTouch: any = () => { };

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
  public setDisabledState(isDisabled: boolean): void { }
}
