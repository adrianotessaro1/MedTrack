import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../../shared/components/default-login-layout/default-login-layout.component';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { PrimaryInputComponent } from '../../../shared/components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';

@Component({
  selector: 'app-signup',
  imports: [DefaultLoginLayoutComponent, SharedModule, PrimaryInputComponent],
  providers: [AccountService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  public readonly emailPattern =
    "^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+" +
    "(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|" +
    '"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|' +
    '\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@' +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';

  public signupForm: FormGroup<ISignupForm> = new FormGroup({
    name: new FormControl<string | null>('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
    email: new FormControl<string | null>('', {
      validators: [Validators.required, Validators.pattern(this.emailPattern)],
    }),
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
        this.signupForm.value.name!,
        this.signupForm.value.email!,
        this.signupForm.value.password!
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
}

interface ISignupForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>;
}
