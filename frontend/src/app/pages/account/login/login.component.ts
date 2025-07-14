import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../../shared/components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { PrimaryInputComponent } from '../../../shared/components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [DefaultLoginLayoutComponent, SharedModule, PrimaryInputComponent],
  providers: [AccountService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public readonly emailPattern =
    "^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+" +
    "(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|" +
    '"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|' +
    '\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@' +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';

  public loginForm: FormGroup<ILoginForm> = new FormGroup({
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
  });

  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService,
    private readonly toastService: ToastrService
  ) {}

  public submit(): void {
    this.accountService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .subscribe({
        next: () => {
          this.toastService.success('Login feito com sucesso!', 'Sucesso', {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.router.navigate(['/dashboard/patient']);
        },
        error: (error) => {
          console.error(error);
          this.toastService.error(
            'Erro inesperado, tente novamente mais tarde',
            'Erro',
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
        },
      });
  }

  public navigate(): void {
    this.router.navigate(['/account/sign-up']);
  }
}

interface ILoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
