import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../../shared/components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { PrimaryInputComponent } from '../../../shared/components/inputs/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';
import { MatStepper } from '@angular/material/stepper';
import { completeFullNameValidator } from '../../../shared/validators/fullname.validator';
import { AutocompleteInputComponent } from '../../../shared/components/inputs/autocomplete-input/autocomplete-input.component';
import { DatepickerInputComponent } from '../../../shared/components/inputs/datepicker-input/datepicker-input.component';

@Component({
  selector: 'app-signup',
  imports: [DefaultLoginLayoutComponent, SharedModule, PrimaryInputComponent, AutocompleteInputComponent, DatepickerInputComponent],
  providers: [AccountService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements AfterViewInit, OnInit {

  @ViewChild('stepper', { static: false }) public stepper!: MatStepper;

  public readonly emailPattern =
    "^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+" +
    "(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|" +
    '"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|' +
    '\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@' +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';

  public personalInfoForm: FormGroup<IPersonalInfoForm> = new FormGroup({
    type: new FormControl<'patient' | 'doctor' | null>(null, {
      validators: [Validators.required],
    }),
    name: new FormControl<string | null>('', {
      validators: [Validators.required, completeFullNameValidator()],
    }),
    dateOfBirth: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    phone: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });
  public doctorInfoForm: FormGroup<IDoctorInfo> = new FormGroup({
    email: new FormControl<string | null>('', {
      validators: [Validators.required, Validators.pattern(this.emailPattern)],
    }),
    CRM: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ],
    }),
    specialty: new FormControl<string | null>('', {
      validators: [Validators.required],
    }),
  });
  public patientInfoForm: FormGroup<IPatientInfo> = new FormGroup({
    email: new FormControl<string | null>('', {
      validators: [Validators.required, Validators.pattern(this.emailPattern)],
    }),
    gender: new FormControl<string | null>('', {
      validators: [Validators.required],
    }),
  });
  public securityForm: FormGroup<ISecurityForm> = new FormGroup({
    password: new FormControl<string | null>('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
      ],
    }),
    passwordConfirm: new FormControl<string | null>('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
      ],
    }),
  });

  public currentStepperIndex: number = 0;
  public progressBarWidth: number = 4;
  public lastCurrentStepperIndex: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService,
    private cd: ChangeDetectorRef
  ) { }


  public ngOnInit(): void {
    this.patientInfoForm.statusChanges.subscribe(() => {
      Object.keys(this.patientInfoForm.controls).forEach(controlName => {
        const control = this.patientInfoForm.get(controlName);
        if (control && control.invalid) {
          console.log(`Control '${controlName}' is invalid`);
        }
      });
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.stepper.selectionChange.subscribe((stepper) => {
        this.currentStepperIndex = stepper.selectedIndex;
        this.lastCurrentStepperIndex =
          this.currentStepperIndex === this.stepper.steps.length - 1;
        const matStepLength: number = this.stepper.steps.length;
        this.progressBarWidth =
          (stepper.selectedIndex * 100) / (matStepLength - 1);
        if (this.currentStepperIndex === 0) {
          this.progressBarWidth = 4;
        }
        this.cd.detectChanges();
      });
    }, 500);
  }

  public submit(): void {
    this.accountService
      .signup(
        this.personalInfoForm.value.name!,
        this.doctorInfoForm.value.email!, // CHANGE THIS LATER BECAUSE IT'S ONLY FOR DOCTORS NOW
        this.securityForm.value.password!
      )
      .subscribe({
        next: () => {
          console.log('success');
          this.router.navigate(['/account/login']);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  public navigate(): void {
    this.router.navigate(['/account/login']);
  }

  public disabledConfirmButton(): boolean {
    const currentStep: number = this.currentStepperIndex;

    if (currentStep === 0) {
      return !this.personalInfoForm.valid;
    } else if (currentStep === 1 && this.personalInfoForm.controls['type'].value === 'doctor') {
      return !this.doctorInfoForm.valid;
    } else if (currentStep === 1 && this.personalInfoForm.controls['type'].value === 'patient') {
      return !this.patientInfoForm.valid;
    } else if (currentStep === 2) {
      return !this.securityForm.valid;
    } else {
      return false;
    }
  }

  public nextStepper(): void {
    this.stepper.next();
  }

  public previousStepper(): void {
    this.stepper.previous();
  }

  public goToLogin(): void {
    this.router.navigate(['/account/login']);
  }

}

interface ISecurityForm {
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>;
}

interface IPersonalInfoForm {
  type: FormControl<'patient' | 'doctor' | null>;
  name: FormControl<string | null>;
  phone: FormControl<string | null>;
  dateOfBirth: FormControl<Date | null>;
}
interface IDoctorInfo {
  email: FormControl<string | null>;
  CRM: FormControl<number | null>;
  specialty: FormControl<string | null>;
}

interface IPatientInfo {
  email: FormControl<string | null>;
  gender: FormControl<string | null>;
}
