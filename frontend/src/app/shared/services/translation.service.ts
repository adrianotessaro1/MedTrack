import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslationConstants {
  constructor(private readonly translateService: TranslateService) {}

  public translate(path: string): string {
    return this.translateService.instant(path);
  }
}
