import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'login-page';

  constructor(
    private readonly iconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer
  ) {
    // Registers a whole SVG sprite (a svg file with all individual icons together - with each wrapper in its own <symbol> tag) under the "app" namespace:
    this.iconRegistry.addSvgIconSetInNamespace(
      'app',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/icons.svg')
    );
  }
}
