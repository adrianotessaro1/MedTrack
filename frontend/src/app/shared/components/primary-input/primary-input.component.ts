import {
  Component,
  computed,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
import { single } from 'rxjs';
import { TranslationConstants } from '../../services/translation.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDatepicker } from '@angular/material/datepicker';

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
export class PrimaryInputComponent implements ControlValueAccessor, OnInit {
  // By implementing the ControlValueAcessor, this component becomes a drop-in form control

  // TO REDO LATER, SPLIT INTO THREE INPUTS TO AVOID INJETING THIS WHEN NOT NEEDED
  @ViewChild('auto', { static: false }) public auto!: MatAutocomplete;
  @ViewChild('auto', { static: false })
  public pickerDateOfBirth!: MatDatepicker<Date>;

  public readonly inputType = input.required<InputTypes>();
  public readonly inputPlaceholder = input.required<string>();
  public readonly label = input<string>('');
  public readonly iconName = input<string>('');
  public readonly inputName = input.required<string>();
  public readonly withLabel = input<boolean>(true);
  public readonly withAutocomplete = input<boolean>();
  public readonly AutocompleteGroup = input<'gender' | 'specialty'>();
  // Builds a dictionary with the specific error and the label for the translate
  public readonly errorMap: Record<string, string> = {
    required: 'errorHint.mandatory',
    pattern: 'errorHint.email',
    dateOrder: 'errorHint.dateOrder',
    completeFullNameError: 'errorHint.fullName',
    alphaNumeric: 'errorHint.alphaNumeric',
    invalidCrm: 'errorHint.invalidCrm',
    minlength: 'errorHint.minLength',
    maxlength: 'errorHint.maxLength',
  };
  public selectedAutocompleteGroup?: Record<string, string>;

  // Inject the parent FromGroupDirective (this is done to avoid circular DI using ControlContainer and viewProvider)
  private readonly formGroupDirective = inject(FormGroupDirective);
  public get form(): FormGroup {
    return this.formGroupDirective.control as FormGroup;
  }

  public get autocompleteOptions(): Record<
    'gender' | 'specialty',
    Record<string, string>
  > {
    return {
      gender: {
        male: this.translationConstants.translate('form.gender.male'),
        female: this.translationConstants.translate('form.gender.female'),
        ratherNotSay: this.translationConstants.translate(
          'form.gender.ratherNotSay'
        ),
      },
      specialty: {
        cardiology: this.translationConstants.translate(
          'form.specialty.cardiology'
        ),
        dermatology: this.translationConstants.translate(
          'form.specialty.dermatology'
        ),
        neurology: this.translationConstants.translate(
          'form.specialty.neurology'
        ),
        pediatrics: this.translationConstants.translate(
          'form.specialty.pediatrics'
        ),
      },
    };
  }

  constructor(public readonly translationConstants: TranslationConstants) {}

  public ngOnInit(): void {
    if (this.withAutocomplete() === true) {
      this.selectedAutocompleteGroup =
        this.autocompleteOptions[this.AutocompleteGroup()!];
    }
  }

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
