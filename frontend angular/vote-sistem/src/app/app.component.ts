import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
  <main> 
    <app-header/>
    <router-outlet/>
  </main>
  `
})
export class AppComponent {
  title = 'vote-sistem';
}
