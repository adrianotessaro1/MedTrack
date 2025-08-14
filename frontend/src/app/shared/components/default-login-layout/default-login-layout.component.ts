import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  output,
} from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-default-login-layout',
  imports: [SharedModule],
  templateUrl: './default-login-layout.component.html',
  styleUrl: './default-login-layout.component.scss',
})
export class DefaultLoginLayoutComponent {
  public readonly title: InputSignal<string> = input('');
  public readonly primaryButtonText: InputSignal<string> = input('');
  public readonly secondaryButtonText: InputSignal<string> = input('');
  public readonly disablePrimaryButton: InputSignal<boolean> = input(true);

  // Signal-style emitter
  public readonly submit = output<void>();
  public readonly navigate = output<void>();
}
