import { Component, ViewChild } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../../shared/components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { PrimaryInputComponent } from '../../../shared/components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';
import { MatStepper } from '@angular/material/stepper';
import { completeFullNameValidator } from '../../../shared/validators/fullname.validator';

@Component({
  selector: 'app-signup',
  imports: [DefaultLoginLayoutComponent, SharedModule, PrimaryInputComponent],
  providers: [AccountService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  @ViewChild('stepper', { static: false }) public stepper!: MatStepper;
  public progressBarWidth: number = 0;

  public readonly emailPattern =
    "^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+" +
    "(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|" +
    '"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|' +
    '\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@' +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';

  public isDoctor: boolean = false;

  public personalInfoForm: FormGroup<IPersonalInfoForm> = new FormGroup({
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
        Validators.minLength(6),
        Validators.maxLength(6),
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

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService
  ) {}

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

  public nextStepper(): void {
    this.stepper.next();
  }

  public previousStepper(): void {
    this.stepper.previous();
  }
}

interface ISecurityForm {
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>;
}

interface IPersonalInfoForm {
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
