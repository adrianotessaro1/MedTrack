import { Component, forwardRef, inject, input, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AbstractControl, ControlValueAccessor, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslationConstants } from '../../../services/translation.service';

@Component({
  selector: 'app-autocomplete-input',
  imports: [SharedModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteInputComponent),
      multi: true
    }
  ],
  templateUrl: './autocomplete-input.component.html',
  styleUrl: './autocomplete-input.component.scss'
})
export class AutocompleteInputComponent implements ControlValueAccessor {
  // By implementing the ControlValueAcessor, this component becomes a drop-in form control

  @ViewChild('auto', { static: false }) public auto!: MatAutocomplete;
  public readonly inputPlaceholder = input.required<string>();
  public readonly label = input<string>('');
  public readonly mandatory = input<boolean>(true);
  public readonly iconName = input<string>('');
  public readonly inputName = input.required<string>();
  public readonly withLabel = input<boolean>(true);
  public readonly AutocompleteGroup = input<'gender' | 'specialty'>();
  public selectedAutocompleteGroup?: Record<string, string>;
  public disabled: boolean = false;

  // Builds a dictionary with the specific error and the label for the translate
  public readonly errorMap: Record<string, string> = {
    required: 'errorHint.mandatory',
  };

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

  constructor(public readonly translationConstants: TranslationConstants) { }

  public ngOnInit(): void {
    this.selectedAutocompleteGroup =
      this.autocompleteOptions[this.AutocompleteGroup()!];

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
  public onChange: any = () => { };
  public onTouch: any = () => { };

  // Called on each keystroke. Stash the new string, and notify Angular's form that the control value changed
  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;

    // Notify Angular's form that the control value changed
    this.onChange(value);
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value ?? ''.toString();
    this.value = value;

    // Notify Angular that the control has been touched
    this.onTouch();

    // Notify Angular's form that the control value changed
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
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
